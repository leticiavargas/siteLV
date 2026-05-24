'use client';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Node, mergeAttributes, findParentNode } from '@tiptap/core';
import { useRef, useState } from 'react';
import './styles.css';

// ── Custom Figure node ────────────────────────────────────────────────────────

const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => el.querySelector('img')?.getAttribute('src') ?? null,
      },
      alt: {
        default: '',
        parseHTML: (el) => el.querySelector('img')?.getAttribute('alt') ?? '',
      },
      width: {
        default: null,
        parseHTML: (el) => {
          const img = el.querySelector('img');
          return img?.style.width || img?.getAttribute('width') || null;
        },
      },
      'data-align': {
        default: 'none',
        parseHTML: (el) => el.dataset.align || 'none',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'figure', contentElement: 'figcaption' }];
  },

  renderHTML({ node }) {
    const { src, alt, width, 'data-align': align } = node.attrs;
    const imgStyle = width ? `width:${width}` : 'max-width:100%';
    return [
      'figure',
      { 'data-align': align },
      ['img', { src, alt, style: imgStyle }],
      ['figcaption', 0],
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const figure = document.createElement('figure');
      figure.dataset.align = node.attrs['data-align'] || 'none';

      const img = document.createElement('img');
      img.src = node.attrs.src || '';
      img.alt = node.attrs.alt || '';
      if (node.attrs.width) img.style.width = node.attrs.width;
      else img.style.maxWidth = '100%';

      const figcaption = document.createElement('figcaption');
      figcaption.setAttribute('data-placeholder', 'Legenda da imagem…');

      figure.appendChild(img);
      figure.appendChild(figcaption);

      return {
        dom: figure,
        contentDOM: figcaption,
        update(updatedNode) {
          if (updatedNode.type !== node.type) return false;
          img.src = updatedNode.attrs.src || '';
          img.alt = updatedNode.attrs.alt || '';
          if (updatedNode.attrs.width) img.style.width = updatedNode.attrs.width;
          else img.style.maxWidth = '100%';
          figure.dataset.align = updatedNode.attrs['data-align'] || 'none';
          return true;
        },
      };
    };
  },
});

// ── Upload helper ─────────────────────────────────────────────────────────────

async function uploadImagem(file, pasta) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(',')[1];
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64,
            contentType: file.type,
            filename: file.name,
            pasta,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Erro no upload');
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsDataURL(file);
  });
}

// ── Toolbar button ────────────────────────────────────────────────────────────

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`richEditorBtn${active ? ' richEditorBtn--active' : ''}`}
    >
      {children}
    </button>
  );
}

// ── Image contextual toolbar ──────────────────────────────────────────────────

const SIZE_PRESETS = [
  { label: 'P', title: 'Pequena (30%)', width: '30%' },
  { label: 'M', title: 'Média (60%)', width: '60%' },
  { label: 'G', title: 'Grande (80%)', width: '80%' },
  { label: '⤢', title: 'Original (100%)', width: null },
];

const IMG_ALIGN_PRESETS = [
  { icon: 'format_align_left', title: 'Imagem à esquerda', value: 'none' },
  { icon: 'format_align_center', title: 'Imagem centralizada', value: 'center' },
  { icon: 'format_align_right', title: 'Imagem à direita', value: 'right' },
];

function getFigure(state) {
  return findParentNode((node) => node.type.name === 'figure')(state.selection) ?? null;
}

function ImageToolbar({ editor }) {
  useEditorState({ editor, selector: (ctx) => ctx.editor.isActive('figure') });
  const figureActive = editor.isActive('figure');
  const found = figureActive ? getFigure(editor.state) : null;
  const currentWidth = found?.node?.attrs?.width ?? null;
  const currentAlign = found?.node?.attrs?.['data-align'] ?? 'none';

  function setFigureAttr(attrs) {
    const result = getFigure(editor.view.state);
    if (!result) return;
    const { node, pos } = result;
    editor.view.dispatch(
      editor.view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs })
    );
  }

  if (!figureActive) return null;

  return (
    <>
      <div className="richEditorDivider richEditorDivider--tall" aria-hidden="true" />
      <span className="richEditorLabel">Imagem</span>
      {SIZE_PRESETS.map(({ label, title, width }) => (
        <ToolbarButton
          key={label}
          title={title}
          active={currentWidth === width}
          onClick={() => setFigureAttr({ width })}
        >
          {label}
        </ToolbarButton>
      ))}
      <div className="richEditorDivider" aria-hidden="true" />
      {IMG_ALIGN_PRESETS.map(({ icon, title, value }) => (
        <ToolbarButton
          key={value}
          title={title}
          active={currentAlign === value}
          onClick={() => setFigureAttr({ 'data-align': value })}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </ToolbarButton>
      ))}
    </>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export function RichTextEditor({ value, onChange, pasta = 'misc' }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Figure,
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploadError(null);
    setUploading(true);
    try {
      const url = await uploadImagem(file, pasta);
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'figure',
          attrs: { src: url, alt: file.name.replace(/\.[^.]+$/, '') },
          content: [],
        })
        .run();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  if (!editor) return null;

  return (
    <div className="richEditor">
      <div className="richEditorToolbar" role="toolbar" aria-label="Formatação de texto">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrito"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Itálico"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Tachado"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="richEditorDivider" aria-hidden="true" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título H2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Título H3"
        >
          H3
        </ToolbarButton>

        <div className="richEditorDivider" aria-hidden="true" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Alinhar à esquerda"
        >
          <span className="material-symbols-outlined">format_align_left</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Centralizar"
        >
          <span className="material-symbols-outlined">format_align_center</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Alinhar à direita"
        >
          <span className="material-symbols-outlined">format_align_right</span>
        </ToolbarButton>

        <div className="richEditorDivider" aria-hidden="true" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista com marcadores"
        >
          <span className="material-symbols-outlined">format_list_bulleted</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <span className="material-symbols-outlined">format_list_numbered</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Citação"
        >
          <span className="material-symbols-outlined">format_quote</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Bloco de código"
        >
          <span className="material-symbols-outlined">code_blocks</span>
        </ToolbarButton>

        <div className="richEditorDivider" aria-hidden="true" />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title={uploading ? 'Enviando imagem...' : 'Inserir imagem'}
        >
          <span className="material-symbols-outlined">
            {uploading ? 'hourglass_top' : 'image'}
          </span>
        </ToolbarButton>

        <div className="richEditorDivider" aria-hidden="true" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Desfazer"
        >
          <span className="material-symbols-outlined">undo</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refazer"
        >
          <span className="material-symbols-outlined">redo</span>
        </ToolbarButton>

        <ImageToolbar editor={editor} />
      </div>

      {uploadError && (
        <div className="richEditorUploadError" role="alert">
          <span className="material-symbols-outlined">error</span>
          {uploadError}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="richEditorFileInput"
        onChange={handleImageFile}
        aria-hidden="true"
        tabIndex={-1}
      />

      <EditorContent editor={editor} className="richEditorContent" />
    </div>
  );
}

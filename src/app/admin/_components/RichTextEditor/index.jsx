'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useRef, useState } from 'react';
import './styles.css';

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

export function RichTextEditor({ value, onChange, pasta = 'misc' }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false }),
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
      editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, '') }).run();
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

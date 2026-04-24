'use client';
import { useState } from 'react';
import './styles.css';

export function TagsInput({ value = [], onChange }) {
  const [input, setInput] = useState('');

  function addTag() {
    const tag = input.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag) {
    onChange(value.filter(t => t !== tag));
  }

  return (
    <div className="tagsInput">
      <ul className="tagsInputList">
        {value.map(tag => (
          <li key={tag} className="tagsInputTag">
            {tag}
            <button
              type="button"
              className="tagsInputRemove"
              onClick={() => removeTag(tag)}
              aria-label={`Remover tag ${tag}`}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </li>
        ))}
        <li className="tagsInputItem">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={value.length === 0 ? 'Digite e pressione Enter' : ''}
            className="tagsInputField"
          />
        </li>
      </ul>
    </div>
  );
}

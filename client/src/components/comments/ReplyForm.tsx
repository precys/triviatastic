import { useState, FormEvent } from 'react';

interface Props {
  parentId: string;
  onSubmit: (text: string) => void;
}

export default function ReplyForm({ parentId, onSubmit }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-2">
      <div className="mb-2">
        <textarea
          className="form-control form-control-sm"
          rows={2}
          placeholder="Write a reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-sm">
        Reply
      </button>
    </form>
  );
}

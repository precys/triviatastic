import { useState, FormEvent } from 'react';

interface Props {
  parentId: string;
  onSubmit: (content: string) => void;
}

export default function ReplyForm({ parentId, onSubmit }: Props) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-2">
      <div className="mb-2">
        <textarea className="form-control form-control-sm" rows={2} placeholder="Write a reply..." value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary btn-sm">Reply</button>
    </form>
  );
}

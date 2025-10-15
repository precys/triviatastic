import { useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  onSubmit: (content: string) => void;
}

export default function CommentForm({ onSubmit }: Props) {
  const {state} = useLocation();
  const [content, setContent] = useState(state);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="mb-2">
        <textarea className="form-control" rows={3} placeholder="Write a comment..." value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}

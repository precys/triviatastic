interface Props {
  likes: number;
  liked: boolean;
  onToggle: () => void;
}

export default function LikeButton({ likes, liked, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${liked ? 'btn-primary' : 'btn-outline-primary'}`}
      onClick={onToggle}
    >
      {liked ? 'Unlike' : 'Like'} ({likes})
    </button>
  );
}

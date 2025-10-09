interface Props {
  src?: string;
  size?: number;
}

export default function Avatar({ src, size = 40 }: Props) {
  return src ? (
    <img
      src={src}
      alt="avatar"
      className="rounded-circle"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      ?
    </div>
  );
}

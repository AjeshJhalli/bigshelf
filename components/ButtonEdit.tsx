export default function ButtonEdit({ href }: { href: string }) {
  return (
    <button
      className="btn btn-primary btn-sm"
      hx-get={href}
      hx-target="body"
      hx-swap="beforeend"
    >
      Edit
    </button>
  );
}

export default function ButtonNew({ href }: { href: string }) {
  return (
    <a
      className="btn btn-sm btn-primary"
      hx-get={href}
      hx-target="body"
      hx-swap="beforeend"
    >
      New
    </a>
  );
}

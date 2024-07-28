import Head from "../Head.tsx";
import { JSX } from "preact/jsx-runtime";

export default function UnauthenticatedLayout(
  { children }: { children: JSX.Element },
) {
  return (
    <html>
      <Head />
      <body data-theme="dark">
        {children}
      </body>
    </html>
  );
}

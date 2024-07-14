import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';
import AuthenticatedLayout from '../layouts/authenticated-layout/AuthenticatedLayout.tsx';
import { JSX } from "preact/jsx-runtime";

export default function r(component: JSX.Element) {
  return render(<AuthenticatedLayout>{component}</AuthenticatedLayout>);
}
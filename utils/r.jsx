import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';
import Layout from '../pages/Layout.jsx';

export default function r(component) {
  return render(<Layout>{component}</Layout>);
}
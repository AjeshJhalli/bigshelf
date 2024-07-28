import authUrl from "../utils/authUrl.ts";

export default function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Bigshelf</h1>
          <p className="py-6">
            Bigshelf is a CRM developed using Deno.js.
          </p>
          <a className="btn btn-primary" href={authUrl}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

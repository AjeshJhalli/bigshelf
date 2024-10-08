import Head from "../layouts/Head.tsx";
import authUrl from "../utils/authUrl.ts";
import UnauthenticatedLayout from "../layouts/unauthenticated-layout/UnauthenticatedLayout.tsx";

export default function Index() {
  return (
    <UnauthenticatedLayout>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Room Flow</h1>
            <p className="py-6">
              Room Flow is a CRM developed using Deno.js.
            </p>
            <a className="btn btn-primary" href={authUrl}>
              Sign in
            </a>
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
}

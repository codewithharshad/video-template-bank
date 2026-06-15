import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-zinc-400">Template not found.</p>
      <Link
        href="/hooks"
        className="mt-6 text-violet-400 hover:text-violet-300"
      >
        Browse templates
      </Link>
    </div>
  );
}

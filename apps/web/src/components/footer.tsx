import Link from "next/link";
import { Github, Instagram, Linkedin, Sparkles, Twitter, Youtube } from "lucide-react";

const columns = [
  {
    title: "Use cases",
    links: [
      { label: "Text Animation", href: "/hooks" },
      { label: "Engagement Mockup", href: "/hooks" },
      { label: "Video Flowchart", href: "/hooks" },
      { label: "3D Transformation", href: "/effects" },
      { label: "Web Search", href: "/hooks" },
    ],
  },
  {
    title: "Styles",
    links: [
      { label: "Hormozi", href: "/hooks" },
      { label: "Johnny Harris", href: "/hooks" },
      { label: "Vox", href: "/hooks" },
      { label: "SaaS Launch", href: "/effects" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Hooks Library", href: "/hooks" },
      { label: "Video Effects", href: "/effects" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Account", href: "/account" },
      { label: "Sign in", href: "/sign-in" },
      { label: "Privacy", href: "/" },
      { label: "Terms", href: "/" },
    ],
  },
];

const socials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://x.com", label: "X" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Anim<span className="gradient-text">ably</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-zinc-500">
              Viral motion graphics for creators. Browse, customize, and export
              pro hooks in seconds — no After Effects required.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-amber-500/40 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-zinc-200">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/60 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Animably. All rights reserved.
          </p>
          <p className="text-sm text-zinc-600">
            Made for creators who hate timelines.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Scale, Heart, Code2 } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t py-4 px-6 bg-card/30 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      <div className="flex items-center space-x-4">
        <span>© {new Date().getFullYear()} DevForge Core [Public Beta v0.9]</span>
        <span className="text-border">•</span>
        <Link href="/impressum" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
          Impressum & Datenschutz (TMG / DSGVO)
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1 hover:text-foreground transition-colors"
        >
          <Code2 size={13} />
          <span>Open Source</span>
        </a>
        <span className="text-border">•</span>
        <span className="inline-flex items-center space-x-1">
          <span>Entwickelt von Paul Konstantin Regler</span>
        </span>
      </div>
    </footer>
  );
}

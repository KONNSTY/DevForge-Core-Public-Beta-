import Link from "next/link";
import { Code2, ExternalLink } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="safe-area-bottom flex shrink-0 flex-col items-center justify-between gap-3 border-t bg-card/30 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
      <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:w-auto sm:justify-start sm:text-left">
        <span>© {new Date().getFullYear()} DevForge Core · kostenlos & ohne Konto</span>
        <span className="hidden text-border sm:inline">•</span>
        <Link href="/impressum" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
          Impressum & Datenschutz
        </Link>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:w-auto sm:justify-end sm:text-left">
        <a
          href="https://reglerproductions.com/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1 hover:text-foreground transition-colors"
        >
          <ExternalLink size={13} />
          <span>Regler Productions</span>
        </a>
        <span className="hidden text-border sm:inline">•</span>
        <a
          href="https://reglerproductions.com/preise.html"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Polymath Productions · Angebot
        </a>
        <span className="hidden text-border sm:inline">•</span>
        <a
          href="https://github.com/KONNSTY"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1 hover:text-foreground transition-colors"
        >
          <Code2 size={13} />
          <span>Quellcode</span>
        </a>
      </div>
      <p className="sr-only">DevForge Core ist ein kostenloses Produkt von Polymath Productions, einer Marke von Regler Productions.</p>
    </footer>
  );
}

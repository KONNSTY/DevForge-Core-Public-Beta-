import Link from "next/link";
import { ArrowUpRight, Code2, Mail } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="app-footer safe-area-bottom flex shrink-0 flex-col items-center justify-between gap-3 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:px-7">
      <p>© {new Date().getFullYear()} Konstantin Regler · AI &amp; Full-stack Engineering</p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <a href="mailto:contact@reglerproductions.com" className="footer-link"><Mail size={13} aria-hidden="true" /> Kontakt</a>
        <a href="https://github.com/KONNSTY" target="_blank" rel="noreferrer" className="footer-link"><Code2 size={13} aria-hidden="true" /> GitHub <ArrowUpRight size={11} aria-hidden="true" /></a>
        <Link href="/impressum" className="footer-link">Impressum &amp; Datenschutz</Link>
        <a href="https://reglerproductions.com/" target="_blank" rel="noreferrer" className="footer-link">Polymath Productions <ArrowUpRight size={11} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}

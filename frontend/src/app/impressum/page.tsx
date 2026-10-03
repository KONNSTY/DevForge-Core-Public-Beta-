import Link from "next/link";
import { Scale, ShieldCheck, Code2, Heart } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-12">
      <div>
        <div className="flex items-center space-x-2 text-primary font-semibold text-sm uppercase tracking-wider mb-2">
          <Scale size={18} />
          <span>Rechtliche Angaben & Transparenz</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Impressum & Datenschutz</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          DevForge Core — Nicht-kommerzielle Open-Source-Bildungsplattform für angehende Software-Entwickler & AI Engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-6 rounded-xl border bg-card/60 backdrop-blur shadow-sm space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Angaben gemäß § 5 TMG</h2>
          <div className="space-y-1 text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">Paul Konstantin Regler</p>
            <p>Kittenfeldstraße 2a</p>
            <p>91795 Dollnstein</p>
            <p>Deutschland</p>
          </div>
          <div className="pt-2">
            <h3 className="font-semibold text-sm text-foreground">Kontakt:</h3>
            <p className="text-sm text-muted-foreground">E-Mail: <a href="mailto:contact@reglerproductions.com" className="text-primary hover:underline">contact@reglerproductions.com</a></p>
          </div>
          <div className="pt-2">
            <h3 className="font-semibold text-sm text-foreground">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h3>
            <p className="text-sm text-muted-foreground">Paul Konstantin Regler (Anschrift wie oben)</p>
          </div>
        </section>

        <section className="p-6 rounded-xl border bg-card/60 backdrop-blur shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-500">
            <ShieldCheck size={20} />
            <h2 className="text-xl font-bold text-foreground">Datenschutzerklärung (DSGVO)</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong>Keine Tracking-Cookies, keine Werbenetzwerke:</strong> DevForge Core respektiert deine Privatsphäre vollständig. Wir setzen keine Third-Party Tracking- oder Profiling-Cookies ein.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Fortschrittsspeicherung:</strong> Dein Lernfortschritt, XP und Code-Experimente werden primär <em>clientseitig in deinem Browser (localStorage)</em> gespeichert.
            </p>
          <p>
              <strong>Keine Cloud-Profile:</strong> Es gibt keine Accounts, keine Anmeldung und keine Firebase-/Profil-Synchronisation. Lernfortschritt, XP und Code-Experimente bleiben in deinem Browser und werden nicht an DevForge Core übertragen.
            </p>
            <p>
              <strong>Server-Logs:</strong> Beim Abruf von Seiten erfasst der Webserver temporär die üblichen technischen Verbindungsdaten (IP-Adresse, Browser-Typ, Zugriffszeit), um den sicheren Betrieb zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </div>
        </section>
      </div>

      <section className="p-6 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
        <h2 className="text-xl font-bold">Open-Source & Haftungsausschluss</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          DevForge Core ist ein kostenloses Produkt von <a href="https://reglerproductions.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Regler Productions / Polymath Productions</a>. Alle Lerninhalte, interaktiven Code-Beispiele und Tests werden nach bestem Wissen erstellt. Für eventuelle Fehler in Codebeispielen oder für Konsequenzen, die aus der Nutzung der erlernten Konzepte in Produktivumgebungen resultieren, wird keine Haftung übernommen.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Der Quellcode kann öffentlich auf GitHub einsehbar sein. Dieses Projekt enthält derzeit bewusst keine LICENSE-Datei. Ohne ausdrückliche Lizenz ist die Nutzung, Veränderung und Weiterverteilung nicht automatisch freigegeben.
        </p>
        <div className="flex items-center space-x-4 pt-2">
          <a
            href="https://github.com/KONNSTY"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <Code2 size={16} />
            <span>GitHub Repository</span>
          </a>
          <span className="text-muted-foreground text-xs">•</span>
          <span className="inline-flex items-center space-x-1 text-xs text-muted-foreground">
            <span>Made with passion for open education</span>
            <Heart size={14} className="text-red-500 fill-red-500 inline" />
          </span>
        </div>
      </section>

      <div className="pt-4">
        <Link href="/tracks" className="text-sm font-semibold text-primary hover:underline">
          ← Zurück zum Curriculum
        </Link>
      </div>
    </div>
  );
}

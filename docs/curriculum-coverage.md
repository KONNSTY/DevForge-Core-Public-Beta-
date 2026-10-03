# Curriculum- und Quellenabdeckung

Die Lerntexte und Übungen sind eigenständig auf Deutsch geschrieben. Offizielle CS50- und HarvardX-Materialien dienen zum Prüfen von Themen, Reihenfolge und Lernzielen. Es wurden keine vollständigen Transkripte, Vorlesungstexte, CS50-Aufgaben oder Musterlösungen übernommen.

## Quellenprüfung (Stand 3. Oktober 2026)

Die öffentlichen Kurswochen, Kursbeschreibungen und verlinkten Transkriptdateien wurden einzeln inventarisiert. Alle 112 Vorlesungswochen der 11 aktiven CS50-Kurse und 2 Archivkurse haben auf der Kursseite eine Quellenverknüpfung; die Transkript-URL und ihr offizieller CDN-Jahrgang sind in `frontend/src/data/cs50-courses.json` gespeichert. Die Wocheninhalte wurden mit den offiziellen Kursübersichten abgeglichen. Die Links verweisen je nach Kurs auf unterschiedliche Jahrgänge, darunter 2025 CS50x, 2020 CS50 Web und 2018 Mobile. Archivierte Kursversionen werden im UI deutlich gekennzeichnet.

| Kurs | Wochen | Track / Abdeckung |
| --- | ---: | --- |
| CS50x | 12 | Informatik-Grundlagen, C, Arrays, Algorithmen, Speicher, Datenstrukturen, Python, SQL, KI, Web, Flask und eigenes Abschlussprojekt |
| CS50 AI | 7 | Suche, Wissen, Unsicherheit, Optimierung, Lernen, neuronale Netze, Sprache |
| CS50 2D | 8 | Pong, Flappy Bird, Breakout, Match 3, Plattformspiel, Abenteuer, Physik, Runden-/Kampfzustände |
| CS50 Business | 9 | Informationen, Algorithmen, Datenstrukturen, Programmierung, KI, Internet, Web, Datenbanken, Sicherheit |
| CS50 Cybersecurity | 5 | Konten, Daten, Systeme, Software, Privatsphäre |
| CS50 for Lawyers | 10 | Computational Thinking, Sprachen, Algorithmen, Kryptografie, Cybersecurity, Cloud, Web, Datenbanken, Recht/Technik |
| CS50 Python | 10 | Funktionen, Bedingungen, Schleifen, Exceptions, Bibliotheken, Tests, Dateien, Regex, OOP, weitere Python-Werkzeuge |
| CS50 R | 7 | Daten darstellen und transformieren, Funktionen, tidy data, Visualisierung, Tests, Pakete |
| CS50 Scratch | 9 | Sprites, eigene Blöcke, Ereignisse, Werte, Bedingungen, Schleifen, Variablen, Abstraktion, eigenes Projekt |
| CS50 SQL | 7 | Abfragen, Beziehungen, Entwurf, Schreiboperationen, Views, Optimierung, Skalierung |
| CS50 Web | 9 | HTML/CSS, Git, Python, Django, Datenbanken/Migrationen, JavaScript, UI, Tests/CI/CD, Skalierung/Sicherheit |
| CS50 Mobile (Archiv) | 13 | Historische React-Native-, Navigation-, Daten-, Redux-, Performance- und Release-Themen |
| CS50 Technology (Archiv) | 6 | Hardware, Internet, Multimedia, Sicherheit, Web, Programmierung |

Jede der 112 Wochen verweist auf mindestens eine Plattformlektion. Der aktuelle Kurskatalog und die Kursseiten verlinken direkt zu den passenden Lernlektionen und optional zum Originaltranskript. Die Inhalte in jedem Track richten sich an Anfänger jeden Alters und enthalten Erklärungen, Beispiele, typische Fehler, Verständnisfragen und eigene Übungen.

## Zertifikatsprogramme

Die offiziellen Kursseiten verlinken derzeit HarvardX-Professional-Certificate-Pfade für CS50 AI, Python, Web und SQL. Das angrenzende Python-for-Data-Science-Programm ist sichtbar als eigener HarvardX-Pfad markiert, nicht als CS50-Kursreihe. Programmlinks können sich ändern. Es gibt keine Garantie, mit DevForge allein ein offizielles Zertifikat zu erhalten: HarvardX/edX verlangt die jeweiligen offiziellen Abgaben, Projekte und Bewertungsbedingungen. Die Plattform bietet zusätzliche Übung und Themenvorbereitung, keine offizielle Prüfungsbewertung.

## Abdeckungsabgleich

- Ein Abgleich prüft, dass jeder Katalogkurs, jede offizielle Woche, die Transcript-URL und eine gültige interne `lesson_id` zusammengehören. Der Datenbestand enthält 110 Lektionen in 16 Tracks; die 112 Wochen sind über Querverweise abgedeckt, weil verwandte Inhalte kurseübergreifend verknüpft sind.
- Themen umfassen außerdem die zuvor vorhandenen Junior-Entwicklungspfade: HTTP/DNS/TLS, HTML/CSS/JavaScript, APIs, Git, Django-Muster, React/UI, Tests/CI, Deployment, Skalierung, LLM/RAG und sicheres Prompt-/Tool-Design. Erweiterungen jenseits der CS50-Kurspläne sind in der jeweiligen Lektion mit `beyond_cs50` gekennzeichnet.
- Der Junior-Schwerpunkt liegt auf einem eigenen Fullstack-Abschlussprojekt mit prüfbaren Anforderungen, Tests, Dokumentation und sicherer Veröffentlichung.

## Laufzeit und Zugänglichkeit

- Python und C# laufen über die vorhandene begrenzte Piston-Route; HTML/CSS/JavaScript laufen im vorhandenen isolierten Browser-Sandbox-Iframe.
- C, SQL, Scratch, R und Lua/React Native laufen hier nicht nativ. Die betroffenen Lektionen kennzeichnen dies sichtbar und stellen konzeptuelle Übungen beziehungsweise Python-Modelle bereit.
- Keine Lektion verlangt den Abschluss vorheriger Lektionen. Fortschritt wird lediglich angezeigt/gespeichert; direkte Lernlinks bleiben frei zugänglich.
- Die offiziellen Kursaufgaben werden nicht kopiert. Wer ein Zertifikat anstrebt, reicht eigene Arbeiten bei HarvardX/edX nach deren Bedingungen ein.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { RecruiterModeProvider } from "@/components/recruiter-mode-context";
import { LanguageProvider } from "@/components/language-context";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Konstantin Regler — AI & Full-stack Engineer",
  description: "Portfolio von Konstantin Regler: Full-stack Engineering, AI, Produktentwicklung und DevForge Core.",
  openGraph: {
    title: "Konstantin Regler — AI & Full-stack Engineer",
    description: "Software Engineering, angewandte AI und sorgfältige Produktentwicklung.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-scroll-behavior="smooth" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <RecruiterModeProvider>
              <div className="flex h-dvh min-w-0 overflow-hidden">
                {/* Skip to main content for WCAG 2.1 AA keyboard accessibility */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:p-3 focus:text-primary-foreground"
                >
                  Skip to main content
                </a>

                {/* Sidebar with open linear navigation */}
                <AppSidebar />

                {/* Main Content Area */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                  <AppHeader />
                  <main id="main-content" tabIndex={-1} className="min-h-0 min-w-0 flex-1 overflow-y-auto outline-none">
                    {children}
                  </main>
                  <AppFooter />
                </div>
              </div>
            </RecruiterModeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

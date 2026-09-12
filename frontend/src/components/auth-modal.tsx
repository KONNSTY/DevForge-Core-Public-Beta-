"use client";

import React, { useState } from "react";
import { useAuth } from "./auth-context";
import { useLanguage } from "./language-context";
import { ShieldCheck, UserCheck, LogIn, UserPlus, LogOut, Flame } from "lucide-react";

export function AuthModalButton() {
  const { user, logout, login, register } = useAuth();
  const { t, locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = isRegister 
      ? await register(email, password, locale)
      : await login(email, password);

    setLoading(false);
    if (success) {
      setIsOpen(false);
      setEmail("");
      setPassword("");
    } else {
      setError(isRegister ? "Registration failed. Email might exist." : "Invalid email or password.");
    }
  };

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-xs font-bold">
          <Flame size={14} className="fill-orange-500" />
          <span>{user.streak || 1}d Streak</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border">
          <UserCheck size={13} className="text-emerald-500" />
          <span className="max-w-[120px] truncate">{user.email}</span>
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={t("logout")}
          aria-label={t("logout")}
        >
          <LogOut size={15} />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 transition-all"
      >
        <LogIn size={13} />
        <span>{t("login")}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-card border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <ShieldCheck size={22} />
              <h3 className="font-bold text-lg text-foreground">
                {isRegister ? t("register") : t("login")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("login_or_register")}
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t("email")}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@devforge.io"
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t("password")}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => { setIsRegister(!isRegister); setError(""); }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  {isRegister ? "Already have an account? Sign In" : "Need an account? Register"}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "..." : (isRegister ? t("register") : t("login"))}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

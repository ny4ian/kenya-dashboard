import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from "react";
import {
  Hexagon, Eye, EyeOff, User, Mail, Lock, ArrowRight, LogOut, Menu, X,
  Home as HomeIcon, Wallet as WalletIcon, Send as SendIcon, Smartphone,
  History as HistoryIcon, Search, Filter, ChevronDown, ChevronRight, Check,
  AlertCircle, QrCode, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Copy,
  ShieldCheck, Zap, Activity, Boxes, CircleDollarSign, TrendingUp, Inbox,
  Loader2, CheckCircle2, XCircle, ChevronLeft, RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

/* =============================================================================
   services/api.js — all backend endpoints, untouched from the original app.
   ========================================================================== */
const API = "https://chainpay-kenya-api.onrender.com";

const api = {
  login: (username, password) =>
    fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((r) => r.json()),

  register: (form) =>
    fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then((r) => r.json()),

  getUser: (username) => fetch(`${API}/user/${username}`).then((r) => r.json()),

  deposit: (username, amount, currency) =>
    fetch(`${API}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, amount, currency }),
    }).then((r) => r.json()),

  send: (from, toAccount, amount, currency) =>
    fetch(`${API}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, toAccount, amount, currency }),
    }).then((r) => r.json()),

  mpesaPay: (phone, amount, username) =>
    fetch(`${API}/mpesa/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount, reference: "ChainPay", username }),
    }).then((r) => r.json()),

  mpesaWithdraw: (username, phone, amount) =>
    fetch(`${API}/mpesa/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, phone, amount }),
    }).then((r) => r.json()),
};

/* =============================================================================
   utils/format.js
   ========================================================================== */
const fmtKES = (n) =>
  `KES ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const CONVERSIONS = { KES: 1, USD: 129.5, EUR: 140.2, GBP: 163.8 };

const TX_META = {
  DEPOSIT: { label: "Deposit", color: "emerald", Icon: ArrowDownLeft },
  TRANSFER: { label: "Transfer", color: "teal", Icon: ArrowLeftRight },
  "M-PESA DEPOSIT": { label: "M-Pesa Deposit", color: "green", Icon: ArrowDownLeft },
  "M-PESA WITHDRAW": { label: "M-Pesa Withdraw", color: "amber", Icon: ArrowUpRight },
};

/* =============================================================================
   hooks/useAuth.js — session state, preserves original localStorage flow
   ========================================================================== */
function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData, token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return { user, login, logout };
}

/* =============================================================================
   hooks/useWallet.js — wallet + transaction fetching, same GET /user/:username
   ========================================================================== */
function useWallet(user) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!user) return;
    setLoading(true);
    api.getUser(user.username).then((d) => {
      setWallet(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  return { wallet, loading, refresh };
}

/* =============================================================================
   Theme context — central design tokens
   ========================================================================== */
const ToastCtx = createContext(() => {});

/* =============================================================================
   components/ui — primitives
   ========================================================================== */

function GlassPanel({ className = "", children, glow = false, ...props }) {
  return (
    <div
      className={`relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${className}`}
      {...props}
    >
      {glow && (
        <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-40" style={{
          background: "linear-gradient(135deg, rgba(45,212,191,0.15), transparent 40%, rgba(129,140,248,0.12) 100%)"
        }} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

function GradientButton({ children, onClick, disabled, loading, variant = "primary", className = "", type = "button", icon: Icon }) {
  const variants = {
    primary: "from-teal-400 to-indigo-500 text-slate-950",
    success: "from-emerald-400 to-green-500 text-slate-950",
    warning: "from-amber-400 to-orange-500 text-slate-950",
    ghost: "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10",
  };
  const isGradient = variant !== "ghost";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group relative w-full overflow-hidden rounded-2xl px-5 py-4 font-semibold tracking-tight
        transition-all duration-300 ease-out active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isGradient ? `bg-gradient-to-r ${variants[variant]} shadow-lg shadow-teal-500/10 hover:shadow-teal-400/30 hover:brightness-110` : variants.ghost}
        ${className}`}
    >
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {Icon && <Icon className="h-4 w-4" />}
            {children}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </span>
    </button>
  );
}

function FloatingInput({ label, icon: Icon, type = "text", value, onChange, placeholder, rightSlot, onKeyDown, autoFocus }) {
  const [focused, setFocused] = useState(false);
  const active = focused || (value && value.length > 0);
  return (
    <div className="relative">
      <div className={`relative rounded-2xl border bg-slate-900/60 transition-colors duration-200
        ${focused ? "border-teal-400/60 ring-2 ring-teal-400/20" : "border-white/10"}`}>
        {Icon && (
          <Icon className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focused ? "text-teal-300" : "text-slate-500"}`} />
        )}
        <label className={`pointer-events-none absolute left-11 transition-all duration-200 ${
          active ? "top-2.5 text-[10px] tracking-wider text-teal-300/80" : "top-1/2 -translate-y-1/2 text-sm text-slate-500"
        } ${Icon ? "" : "left-4"}`}>
          {label}
        </label>
        <input
          type={type}
          value={value}
          autoFocus={autoFocus}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          className={`w-full bg-transparent py-4 pr-11 text-[15px] text-slate-100 outline-none placeholder:text-slate-600 ${Icon ? "pl-11" : "pl-4"} ${active ? "pt-6 pb-2" : ""}`}
        />
        {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
    </div>
  );
}

function Badge({ children, color = "teal" }) {
  const map = {
    teal: "bg-teal-400/10 text-teal-300 border-teal-400/20",
    emerald: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    green: "bg-green-400/10 text-green-300 border-green-400/20",
    amber: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    rose: "bg-rose-400/10 text-rose-300 border-rose-400/20",
    indigo: "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",
    slate: "bg-slate-400/10 text-slate-300 border-slate-400/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${map[color]}`}>
      {children}
    </span>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="relative flex gap-1 rounded-2xl border border-white/10 bg-slate-900/60 p-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300
              ${active ? `${opt.activeClass} text-slate-950 shadow-lg` : "text-slate-400 hover:text-slate-200"}`}
          >
            {opt.Icon && <opt.Icon className="h-4 w-4" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />;
}

function AnimatedNumber({ value, prefix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const to = Number(value) || 0;
    const start = performance.now();
    const duration = 700;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className="tabular-nums">
      {prefix}
      {display.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
    </span>
  );
}

function Fade({ show = true, className = "", children, delay = 0 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`transition-all duration-700 ease-out ${mounted && show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

/* Ambient floating particle backdrop for auth screens — canvas based, no extra deps */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf, w, h;
    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.5 + Math.random() * 1.8,
      vy: 0.00008 + Math.random() * 0.00018,
      vx: (Math.random() - 0.5) * 0.00012,
      hue: Math.random() > 0.5 ? "45,212,191" : "129,140,248",
      o: 0.15 + Math.random() * 0.35,
    }));
    const resize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />;
}

/* =============================================================================
   layouts/AuthLayout.jsx
   ========================================================================== */
function AuthShell({ children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <ParticleField />
      <div className="relative z-10 w-full max-w-[420px]">
        <Fade className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-500 shadow-lg shadow-teal-500/30">
            <Hexagon className="h-8 w-8 text-slate-950" strokeWidth={2.5} fill="rgba(5,9,20,0.15)" />
            <div className="absolute inset-0 animate-ping rounded-2xl bg-teal-400/20" style={{ animationDuration: "3s" }} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">CHAINPAY <span className="text-teal-300">KENYA</span></h1>
          <p className="mt-1.5 text-[13px] text-slate-500">Blockchain financial network</p>
        </Fade>
        {children}
        {footer}
      </div>
    </div>
  );
}

function LoginPage({ onLogin, goRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError("Please fill all fields"); return; }
    setError(""); setLoading(true);
    try {
      const data = await api.login(username, password);
      if (data.token) onLogin(data.user, data.token);
      else setError(data.error || "Login failed");
    } catch (e) { setError("Cannot connect to server"); }
    setLoading(false);
  };

  return (
    <AuthShell>
      <Fade delay={100}>
        <GlassPanel glow className="p-7">
          <h2 className="mb-6 text-xl font-bold text-white">Sign in</h2>
          <div className="space-y-4">
            <FloatingInput label="Username" icon={User} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" />
            <FloatingInput
              label="Password" icon={Lock} type={showPw ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              rightSlot={
                <button type="button" onClick={() => setShowPw((s) => !s)} className="text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <div className="mt-6">
            <GradientButton onClick={handleLogin} loading={loading}>Sign in</GradientButton>
          </div>

          <p className="mt-5 text-center text-[13px] text-slate-500">
            No account?{" "}
            <button onClick={goRegister} className="font-semibold text-teal-300 hover:text-teal-200">Register here</button>
          </p>
        </GlassPanel>
      </Fade>
      <Fade delay={250} className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-600">
        <ShieldCheck className="h-3.5 w-3.5" /> Secured by Hyperledger Fabric
      </Fade>
    </AuthShell>
  );
}

function PasswordStrength({ value }) {
  const score = useMemo(() => {
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Z]/.test(value)) s++;
    if (/[0-9]/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return s;
  }, [value]);
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-slate-700", "bg-rose-500", "bg-amber-500", "bg-teal-400", "bg-emerald-400"];
  if (!value) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-slate-500">{labels[score]}</p>
    </div>
  );
}

function RegisterPage({ onRegister, goLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) { setError("Please fill all fields"); return; }
    setError(""); setLoading(true);
    try {
      const data = await api.register(form);
      if (data.user) onRegister();
      else setError(data.error || "Failed");
    } catch (e) { setError("Cannot connect to server"); }
    setLoading(false);
  };

  return (
    <AuthShell>
      <Fade delay={100}>
        <GlassPanel glow className="p-7">
          <h2 className="mb-6 text-xl font-bold text-white">Create account</h2>
          <div className="space-y-4">
            <FloatingInput label="Username" icon={User} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Choose a username" />
            <FloatingInput label="Email" icon={Mail} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            <div>
              <FloatingInput
                label="Password" icon={Lock} type={showPw ? "text" : "password"}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a strong password"
                rightSlot={
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <PasswordStrength value={form.password} />
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <div className="mt-6">
            <GradientButton onClick={handleRegister} loading={loading}>Create account</GradientButton>
          </div>

          <p className="mt-5 text-center text-[13px] text-slate-500">
            Have an account?{" "}
            <button onClick={goLogin} className="font-semibold text-teal-300 hover:text-teal-200">Sign in here</button>
          </p>
        </GlassPanel>
      </Fade>
    </AuthShell>
  );
}

/* =============================================================================
   layouts/AppShell.jsx — sidebar (desktop) + bottom nav (mobile) + topbar
   ========================================================================== */
const NAV_ITEMS = [
  { key: "Home", label: "Home", Icon: HomeIcon },
  { key: "Wallet", label: "Wallet", Icon: WalletIcon },
  { key: "Send", label: "Send", Icon: SendIcon },
  { key: "MPesa", label: "M-Pesa", Icon: Smartphone },
  { key: "History", label: "History", Icon: HistoryIcon },
];

function Sidebar({ page, setPage, user, onLogout }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-slate-950/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 shadow-lg shadow-teal-500/20">
          <Hexagon className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[13px] font-bold tracking-wide text-white">CHAINPAY</p>
          <p className="text-[10px] tracking-wider text-teal-300/70">KENYA</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-2">
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${active ? "bg-gradient-to-r from-teal-400/15 to-indigo-500/10 text-teal-300" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"}`}
            >
              {active && <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-teal-400 to-indigo-500" />}
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.3 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-teal-400 text-xs font-bold text-slate-950">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-slate-200">{user?.username}</p>
            <p className="text-[11px] text-slate-500">Verified account</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-rose-400/90 transition-colors hover:bg-rose-500/10">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </aside>
  );
}

function MobileTopbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500">
            <Hexagon className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="text-[13px] font-bold tracking-wide text-white">CHAINPAY <span className="text-teal-300">KENYA</span></span>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-slate-300 hover:bg-white/5">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/[0.06] px-4 pb-4 pt-2">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-teal-400 text-xs font-bold text-slate-950">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <p className="text-[13px] font-medium text-slate-200">{user?.username}</p>
          </div>
          <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-rose-400/90 hover:bg-rose-500/10">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function BottomNav({ page, setPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-slate-950/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors"
            >
              {active && <span className="absolute -top-2 h-1 w-6 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500" />}
              <Icon className={`h-5 w-5 transition-colors ${active ? "text-teal-300" : "text-slate-500"}`} strokeWidth={active ? 2.4 : 1.8} />
              <span className={`text-[10px] font-medium transition-colors ${active ? "text-teal-300" : "text-slate-500"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* =============================================================================
   components/NetworkPulse.jsx — signature live blockchain heartbeat widget
   ========================================================================== */
function useLiveChain() {
  const [blockHeight, setBlockHeight] = useState(18423);
  const [tps, setTps] = useState(142);
  const [tpsHistory, setTpsHistory] = useState(() => Array.from({ length: 20 }, (_, i) => ({ t: i, v: 130 + Math.random() * 30 })));

  useEffect(() => {
    const i = setInterval(() => {
      setBlockHeight((h) => h + 1);
      setTps(() => {
        const v = Math.floor(130 + Math.random() * 40);
        setTpsHistory((prev) => [...prev.slice(1), { t: prev[prev.length - 1].t + 1, v }]);
        return v;
      });
    }, 4000);
    return () => clearInterval(i);
  }, []);

  return { blockHeight, tps, tpsHistory };
}

function NetworkBadge({ blockHeight }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-medium text-teal-300">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
      </span>
      Block #{blockHeight.toLocaleString()} · Live
    </span>
  );
}

/* =============================================================================
   pages/Home.jsx
   ========================================================================== */
function QuickAction({ Icon, label, onClick, gradient }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-2">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transition-all duration-300 group-hover:scale-105 group-active:scale-95`}>
        <Icon className="h-6 w-6 text-slate-950" strokeWidth={2.2} />
      </div>
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
    </button>
  );
}

function StatCard({ label, value, Icon, color, delay }) {
  const colorMap = {
    teal: "text-teal-300 bg-teal-400/10",
    blue: "text-blue-300 bg-blue-400/10",
    amber: "text-amber-300 bg-amber-400/10",
    emerald: "text-emerald-300 bg-emerald-400/10",
  };
  return (
    <Fade delay={delay}>
      <GlassPanel className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${colorMap[color]}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="mt-2 text-lg font-bold tabular-nums text-white">{value}</p>
      </GlassPanel>
    </Fade>
  );
}

function TxRow({ tx, i }) {
  const meta = TX_META[tx.type] || { label: tx.type, color: "teal", Icon: ArrowLeftRight };
  return (
    <Fade delay={i * 40}>
      <div className="flex items-center gap-3 border-b border-white/[0.05] px-1 py-3.5 last:border-0">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-${meta.color}-400/10 text-${meta.color}-300`}>
          <meta.Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-slate-200">{meta.label}</p>
          <p className="truncate text-[11px] text-slate-500">{tx.from} → {tx.to}</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-semibold tabular-nums text-white">{tx.kesAmount}</p>
          <p className="text-[10px] text-slate-600">{tx.time}</p>
        </div>
      </div>
    </Fade>
  );
}

function Home({ user, wallet, walletLoading, setPage }) {
  const { blockHeight, tps, tpsHistory } = useLiveChain();
  const recent = (wallet?.transactions || []).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
      {/* Balance hero */}
      <Fade>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 lg:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <NetworkBadge blockHeight={blockHeight} />
            <button onClick={() => setPage("Wallet")} className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-slate-400 hover:text-teal-300">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <h1 className="relative mt-4 text-xl font-bold tracking-tight text-white">Welcome back, {user?.username}</h1>

          <div className="relative mt-2 flex items-center gap-2">
            <span className="text-[12px] text-slate-500">Account</span>
            {walletLoading ? <Skeleton className="h-5 w-28" /> : (
              <button
                onClick={() => navigator.clipboard?.writeText(wallet?.accountNumber || "")}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[13px] font-semibold tracking-wider text-blue-300"
              >
                {wallet?.accountNumber || "—"} <Copy className="h-3 w-3 opacity-60" />
              </button>
            )}
          </div>

          <p className="relative mt-6 text-[11px] font-medium uppercase tracking-wider text-slate-500">Wallet balance</p>
          <div className="relative mt-1 flex items-end gap-3">
            {walletLoading ? (
              <Skeleton className="h-11 w-56" />
            ) : (
              <h2 className="text-4xl font-extrabold tracking-tight text-teal-300 lg:text-5xl">
                <AnimatedNumber value={wallet?.balanceKES || 0} prefix="KES " decimals={2} />
              </h2>
            )}
          </div>

          {/* quick actions */}
          <div className="relative mt-8 grid grid-cols-4 gap-2">
            <QuickAction Icon={SendIcon} label="Send" onClick={() => setPage("Send")} gradient="from-teal-400 to-teal-500" />
            <QuickAction Icon={ArrowDownLeft} label="Deposit" onClick={() => setPage("Wallet")} gradient="from-indigo-400 to-indigo-500" />
            <QuickAction Icon={ArrowUpRight} label="Withdraw" onClick={() => setPage("MPesa")} gradient="from-amber-400 to-orange-500" />
            <QuickAction Icon={QrCode} label="Receive" onClick={() => setPage("Wallet")} gradient="from-violet-400 to-purple-500" />
          </div>
        </div>
      </Fade>

      {/* stat grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="24h Volume" value="KES 2.4B" Icon={TrendingUp} color="teal" delay={80} />
        <StatCard label="TPS" value={tps} Icon={Zap} color="blue" delay={120} />
        <StatCard label="Block Height" value={`#${blockHeight.toLocaleString()}`} Icon={Boxes} color="amber" delay={160} />
        <StatCard label="Consensus" value="100%" Icon={ShieldCheck} color="emerald" delay={200} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* network activity chart */}
        <Fade delay={220} className="lg:col-span-3">
          <GlassPanel className="p-5">
            <div className="mb-1 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Network activity</p>
                <p className="text-[11px] text-slate-500">Transactions per second</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-400/10 text-indigo-300">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tpsHistory}>
                  <defs>
                    <linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                    labelFormatter={() => ""}
                    formatter={(v) => [`${Math.round(v)} tx/s`, "TPS"]}
                  />
                  <Area type="monotone" dataKey="v" stroke="#2dd4bf" strokeWidth={2} fill="url(#tpsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </Fade>

        {/* recent transactions preview */}
        <Fade delay={260} className="lg:col-span-2">
          <GlassPanel className="p-5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Recent activity</p>
              <button onClick={() => setPage("History")} className="flex items-center gap-1 text-[11px] font-medium text-teal-300 hover:text-teal-200">
                View all <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-2">
              {walletLoading ? (
                <div className="space-y-3 py-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : recent.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Inbox className="h-8 w-8 text-slate-600" />
                  <p className="text-[12px] text-slate-500">No transactions yet</p>
                </div>
              ) : (
                recent.map((tx, i) => <TxRow tx={tx} i={i} key={tx.txId || i} />)
              )}
            </div>
          </GlassPanel>
        </Fade>
      </div>

      {/* feature cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {[
          { title: "Immutable ledger", desc: "Every transaction is permanently recorded on Hyperledger Fabric.", Icon: Lock, color: "teal" },
          { title: "M-Pesa integration", desc: "Deposit and withdraw directly via the Safaricom Daraja API.", Icon: Smartphone, color: "emerald" },
          { title: "CPK account numbers", desc: "Send money securely using unique CPK account numbers.", Icon: Hexagon, color: "blue" },
        ].map((f, i) => (
          <Fade delay={300 + i * 60} key={f.title}>
            <GlassPanel className="flex items-start gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-${f.color}-400/10 text-${f.color}-300`}>
                <f.Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{f.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            </GlassPanel>
          </Fade>
        ))}
      </div>
    </div>
  );
}

/* =============================================================================
   pages/WalletPage.jsx
   ========================================================================== */
function PageHeader({ title, subtitle }) {
  return (
    <Fade className="mb-5">
      <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>
    </Fade>
  );
}

function CurrencySelect({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 pr-10 text-[15px] font-medium text-slate-100 outline-none focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
      >
        {Object.keys(CONVERSIONS).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function WalletPage({ user, wallet, refresh }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const preview = amount ? (parseFloat(amount) * CONVERSIONS[currency]).toFixed(2) : null;

  const deposit = async () => {
    if (!amount) { setMessage({ ok: false, text: "Enter an amount" }); return; }
    setLoading(true); setMessage(null);
    try {
      const data = await api.deposit(user.username, amount, currency);
      setMessage({ ok: !data.error, text: data.status || data.error });
      setAmount("");
      refresh();
    } catch { setMessage({ ok: false, text: "Cannot connect to server" }); }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">
      <PageHeader title="Wallet" subtitle="Deposit funds — automatically converted to KES" />

      <Fade delay={60}>
        <GlassPanel glow className="relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
          <p className="relative text-[11px] font-medium uppercase tracking-wider text-slate-500">Available balance</p>
          <h3 className="relative mt-1 text-3xl font-extrabold text-teal-300">
            <AnimatedNumber value={wallet?.balanceKES || 0} prefix="KES " decimals={2} />
          </h3>
          <p className="relative mt-2 text-[12px] text-slate-500">Account {wallet?.accountNumber}</p>
        </GlassPanel>
      </Fade>

      <Fade delay={120} className="mt-5">
        <GlassPanel className="p-6">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Amount</label>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <FloatingInput label="Amount" icon={CircleDollarSign} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 1000" />
            </div>
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>

          <div className={`mt-3 overflow-hidden transition-all duration-300 ${preview && currency !== "KES" ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="flex items-center gap-2 rounded-xl border border-teal-400/20 bg-teal-400/5 px-4 py-3">
              <ArrowLeftRight className="h-4 w-4 text-teal-300" />
              <p className="text-[13px] text-teal-200">≈ {fmtKES(preview)} will be credited</p>
            </div>
          </div>

          <div className="mt-5">
            <GradientButton onClick={deposit} loading={loading} icon={ArrowDownLeft}>Deposit funds</GradientButton>
          </div>

          {message && (
            <div className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] ${
              message.ok ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-rose-500/20 bg-rose-500/10 text-rose-300"
            }`}>
              {message.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              {message.text}
            </div>
          )}
        </GlassPanel>
      </Fade>

      <Fade delay={180} className="mt-5">
        <GlassPanel className="p-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">Exchange rates</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {Object.entries(CONVERSIONS).filter(([k]) => k !== "KES").map(([cur, rate]) => (
              <div key={cur} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <span className="text-[13px] font-medium text-slate-400">1 {cur}</span>
                <span className="text-[13px] font-semibold tabular-nums text-white">{fmtKES(rate)}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </Fade>
    </div>
  );
}

/* =============================================================================
   pages/SendPage.jsx
   ========================================================================== */
function SendPage({ user, wallet, refresh }) {
  const [form, setForm] = useState({ toAccount: "", amount: "", currency: "KES" });
  const [step, setStep] = useState("form"); // form | review | success
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const kesEquivalent = form.amount ? (parseFloat(form.amount) * CONVERSIONS[form.currency]).toFixed(2) : "0.00";
  const validAccount = /^[A-Za-z0-9]{4,}$/.test(form.toAccount);

  const goReview = () => {
    if (!form.toAccount || !form.amount) { setMessage({ ok: false, text: "Fill all fields" }); return; }
    if (!validAccount) { setMessage({ ok: false, text: "Enter a valid recipient account number" }); return; }
    setMessage(null);
    setStep("review");
  };

  const confirmSend = async () => {
    setLoading(true); setMessage(null);
    try {
      const data = await api.send(user.username, form.toAccount, form.amount, form.currency);
      if (data.error) {
        setMessage({ ok: false, text: data.error });
        setStep("form");
      } else {
        setMessage({ ok: true, text: data.status });
        refresh();
        setStep("success");
      }
    } catch { setMessage({ ok: false, text: "Cannot connect to server" }); setStep("form"); }
    setLoading(false);
  };

  const reset = () => {
    setForm({ toAccount: "", amount: "", currency: "KES" });
    setMessage(null);
    setStep("form");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">
      <PageHeader title="Send money" subtitle="Transfer instantly using a CPK account number" />

      {step === "success" ? (
        <Fade>
          <GlassPanel glow className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={1.8} />
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" style={{ animationDuration: "1.6s", animationIterationCount: 2 }} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Transfer complete</p>
              <p className="mt-1 text-[13px] text-slate-500">{fmtKES(kesEquivalent)} sent to {form.toAccount || "recipient"}</p>
            </div>
            <div className="w-full max-w-xs">
              <GradientButton onClick={reset}>Send another</GradientButton>
            </div>
          </GlassPanel>
        </Fade>
      ) : step === "review" ? (
        <Fade>
          <GlassPanel glow className="p-6">
            <p className="mb-4 text-sm font-semibold text-white">Review transfer</p>
            <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Recipient</span>
                <span className="text-[13px] font-semibold text-white">{form.toAccount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Amount</span>
                <span className="text-[13px] font-semibold text-white">{form.amount} {form.currency}</span>
              </div>
              {form.currency !== "KES" && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Converted (KES)</span>
                  <span className="text-[13px] font-semibold text-teal-300">{fmtKES(kesEquivalent)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span className="text-[12px] text-slate-500">Network fee</span>
                <Badge color="emerald">Sponsored · Free</Badge>
              </div>
            </div>

            {message && !message.ok && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" /> {message.text}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button onClick={() => setStep("form")} className="flex items-center gap-1.5 rounded-2xl border border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 hover:bg-white/5">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <div className="flex-1">
                <GradientButton onClick={confirmSend} loading={loading} icon={SendIcon}>Confirm & send</GradientButton>
              </div>
            </div>
          </GlassPanel>
        </Fade>
      ) : (
        <Fade>
          <GlassPanel className="p-6">
            <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span className="text-[12px] text-slate-500">Available balance</span>
              <span className="text-[13px] font-semibold tabular-nums text-white">{fmtKES(wallet?.balanceKES || 0)}</span>
            </div>

            <div className="space-y-4">
              <FloatingInput
                label="Recipient account number" icon={Hexagon}
                value={form.toAccount}
                onChange={(e) => setForm({ ...form, toAccount: e.target.value.toUpperCase() })}
                placeholder="e.g. CPK483920"
                rightSlot={form.toAccount && (validAccount ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-rose-400" />)}
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <FloatingInput label="Amount" icon={CircleDollarSign} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 500" />
                </div>
                <CurrencySelect value={form.currency} onChange={(c) => setForm({ ...form, currency: c })} />
              </div>
            </div>

            {form.currency !== "KES" && form.amount && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-teal-400/20 bg-teal-400/5 px-4 py-3">
                <ArrowLeftRight className="h-4 w-4 text-teal-300" />
                <p className="text-[13px] text-teal-200">≈ {fmtKES(kesEquivalent)}</p>
              </div>
            )}

            {message && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" /> {message.text}
              </div>
            )}

            <div className="mt-5">
              <GradientButton onClick={goReview} icon={SendIcon}>Review transfer</GradientButton>
            </div>
          </GlassPanel>
        </Fade>
      )}
    </div>
  );
}

/* =============================================================================
   pages/MPesaPage.jsx
   ========================================================================== */
function MPesaPage({ user, refresh }) {
  const [mode, setMode] = useState("deposit");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | processing | success | error

  const validPhone = /^2547\d{8}$/.test(phone) || /^2541\d{8}$/.test(phone);

  const run = async () => {
    if (!phone || !amount) { setMessage({ ok: false, text: "Fill all fields" }); return; }
    setLoading(true); setStatus("processing"); setMessage(null);
    try {
      if (mode === "deposit") {
        const data = await api.mpesaPay(phone, amount, user.username);
        const ok = !data.error;
        setMessage({ ok, text: data.result ? data.result.ResponseDescription : data.error });
        setStatus(ok ? "success" : "error");
      } else {
        const data = await api.mpesaWithdraw(user.username, phone, amount);
        const ok = !data.error;
        setMessage({ ok, text: data.status || data.error });
        setStatus(ok ? "success" : "error");
      }
      refresh();
    } catch {
      setMessage({ ok: false, text: "Cannot connect to server" });
      setStatus("error");
    }
    setLoading(false);
  };

  const reset = () => { setStatus("idle"); setMessage(null); setAmount(""); };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-900/30">
          <Smartphone className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">M-Pesa</h2>
          <p className="text-[13px] text-slate-500">Safaricom Daraja API</p>
        </div>
      </div>

      <Fade delay={60}>
        <SegmentedControl
          value={mode}
          onChange={(m) => { setMode(m); setMessage(null); setStatus("idle"); }}
          options={[
            { value: "deposit", label: "Deposit", Icon: ArrowDownLeft, activeClass: "bg-gradient-to-r from-green-400 to-green-500" },
            { value: "withdraw", label: "Withdraw", Icon: ArrowUpRight, activeClass: "bg-gradient-to-r from-amber-400 to-orange-500" },
          ]}
        />
      </Fade>

      <Fade delay={120} className="mt-5">
        <GlassPanel className="p-6">
          {status === "processing" ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-teal-400/30" />
                <Smartphone className="absolute h-6 w-6 text-teal-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Waiting for confirmation</p>
                <p className="mt-1 text-[12px] text-slate-500">Check your phone for the M-Pesa prompt</p>
              </div>
            </div>
          ) : status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{mode === "deposit" ? "Deposit initiated" : "Withdrawal complete"}</p>
                <p className="mt-1 text-[12px] text-slate-500">{message?.text}</p>
              </div>
              <div className="w-full max-w-xs"><GradientButton onClick={reset} variant="success">Do another</GradientButton></div>
            </div>
          ) : (
            <>
              <FloatingInput
                label="Phone number" icon={Smartphone}
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="254708374149"
                rightSlot={phone && (validPhone ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-rose-400" />)}
              />
              <div className="mt-4">
                <FloatingInput label="Amount (KES)" icon={CircleDollarSign} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100" />
              </div>

              {amount && (
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-500">You {mode === "deposit" ? "pay" : "receive"}</span>
                    <span className="font-semibold text-white">{fmtKES(amount)}</span>
                  </div>
                </div>
              )}

              {status === "error" && message && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {message.text}
                </div>
              )}
              {message && status === "idle" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {message.text}
                </div>
              )}

              <div className="mt-5">
                <GradientButton
                  onClick={run}
                  loading={loading}
                  variant={mode === "deposit" ? "success" : "warning"}
                  icon={mode === "deposit" ? ArrowDownLeft : ArrowUpRight}
                >
                  {mode === "deposit" ? "Send M-Pesa deposit" : "Withdraw to M-Pesa"}
                </GradientButton>
              </div>
            </>
          )}
        </GlassPanel>
      </Fade>
    </div>
  );
}

/* =============================================================================
   pages/HistoryPage.jsx
   ========================================================================== */
const FILTERS = ["All", "Deposit", "Transfer", "M-Pesa"];
const PAGE_SIZE = 8;

function HistoryPage({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setLoading(true);
    api.getUser(user.username).then((d) => {
      setTransactions(d.transactions || []);
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "M-Pesa" && tx.type?.includes("M-PESA")) ||
        tx.type === filter.toUpperCase();
      const q = query.toLowerCase();
      const matchesQuery = !q || tx.from?.toLowerCase().includes(q) || tx.to?.toLowerCase().includes(q) || tx.type?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [transactions, query, filter]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-8">
      <PageHeader title="Transaction history" subtitle={`${transactions.length} permanent records on the ledger`} />

      <Fade delay={60} className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by account or type"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3.5 pl-11 pr-4 text-[14px] text-slate-100 outline-none placeholder:text-slate-600 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setVisible(PAGE_SIZE); }}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                filter === f ? "bg-teal-400/15 text-teal-300" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Filter className="h-3 w-3" /> {f}
            </button>
          ))}
        </div>
      </Fade>

      <Fade delay={100}>
        <GlassPanel className="overflow-hidden">
          {loading ? (
            <div className="space-y-1 p-5">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : shown.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <Inbox className="h-10 w-10 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-300">No transactions found</p>
                <p className="mt-1 text-[12px] text-slate-500">Try a different search term or filter.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {shown.map((tx, i) => {
                const meta = TX_META[tx.type] || { label: tx.type, color: "teal", Icon: ArrowLeftRight };
                return (
                  <Fade delay={i * 30} key={tx.txId || i}>
                    <div className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-${meta.color}-400/10 text-${meta.color}-300`}>
                        <meta.Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[13.5px] font-medium text-slate-200">{meta.label}</p>
                          <Badge color={meta.color}>{tx.type}</Badge>
                        </div>
                        <p className="mt-0.5 truncate text-[11.5px] text-slate-500">{tx.from} → {tx.to}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13.5px] font-semibold tabular-nums text-white">{tx.kesAmount}</p>
                        <p className="mt-0.5 text-[10.5px] text-slate-600">{tx.time}</p>
                      </div>
                    </div>
                  </Fade>
                );
              })}
            </div>
          )}
        </GlassPanel>
      </Fade>

      {!loading && filtered.length > visible && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-[13px] font-medium text-slate-300 hover:bg-white/[0.06]"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

/* =============================================================================
   App.jsx — root
   ========================================================================== */
export default function App() {
  const [page, setPage] = useState("Home");
  const [authPage, setAuthPage] = useState("login");
  const { user, login, logout } = useAuth();
  const { wallet, loading: walletLoading, refresh } = useWallet(user);

  if (!user) {
    return authPage === "login" ? (
      <LoginPage onLogin={login} goRegister={() => setAuthPage("register")} />
    ) : (
      <RegisterPage onRegister={() => setAuthPage("login")} goLogin={() => setAuthPage("login")} />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-[Inter] text-slate-100" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} />

      <div className="flex min-h-screen flex-1 flex-col">
        <MobileTopbar user={user} onLogout={logout} />

        <main className="flex-1 pb-24 lg:pb-8">
          {page === "Home" && <Home user={user} wallet={wallet} walletLoading={walletLoading} setPage={setPage} />}
          {page === "Wallet" && <WalletPage user={user} wallet={wallet} refresh={refresh} />}
          {page === "Send" && <SendPage user={user} wallet={wallet} refresh={refresh} />}
          {page === "MPesa" && <MPesaPage user={user} refresh={refresh} />}
          {page === "History" && <HistoryPage user={user} />}
        </main>

        <BottomNav page={page} setPage={setPage} />
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";

const T = "#00f5c4";
const DARK = "#050d1a";
const CARD = "#0a1628";
const BORDER = "#0d2545";
const API = "https://chainpay-kenya-api.onrender.com";

const inputStyle = {
  width: "100%", padding: "13px 16px",
  background: "#060f20", border: "1px solid #0d2545",
  borderRadius: "10px", color: "white",
  fontFamily: "Times New Roman", fontSize: "14px",
  outline: "none", boxSizing: "border-box",
};

function LoginPage({ onLogin, goRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else { setError(data.error || "Login failed"); }
    } catch (e) { setError("Cannot connect to server"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Times New Roman", padding: "20px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ width: "60px", height: "60px", background: `linear-gradient(135deg, ${T}, #0099ff)`, borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 15px" }}>⬡</div>
          <h1 style={{ color: "white", margin: 0, fontSize: "22px", letterSpacing: "2px" }}>CHAINPAY KENYA</h1>
          <p style={{ color: "#4a6a8a", margin: "8px 0 0", fontSize: "13px" }}>Blockchain Financial Network</p>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "25px" }}>
          <h2 style={{ color: "white", margin: "0 0 20px", fontSize: "20px" }}>Sign In</h2>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>USERNAME</label>
            <input style={inputStyle} placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>PASSWORD</label>
            <input style={inputStyle} type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          {error && <div style={{ background: "#2a0a0a", border: "1px solid #5a1a1a", borderRadius: "8px", padding: "12px", marginBottom: "15px" }}><p style={{ color: "#ff6b6b", margin: 0, fontSize: "13px" }}>⚠ {error}</p></div>}
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px", marginBottom: "15px" }}>
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>
          <p style={{ color: "#4a6a8a", textAlign: "center", fontSize: "13px", margin: 0 }}>
            No account? <span onClick={goRegister} style={{ color: T, cursor: "pointer" }}>Register here</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onRegister, goLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) { setError("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.user) { onRegister(); } else { setError(data.error || "Failed"); }
    } catch (e) { setError("Cannot connect to server"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Times New Roman", padding: "20px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ width: "60px", height: "60px", background: `linear-gradient(135deg, ${T}, #0099ff)`, borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 15px" }}>⬡</div>
          <h1 style={{ color: "white", margin: 0, fontSize: "22px", letterSpacing: "2px" }}>CHAINPAY KENYA</h1>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "25px" }}>
          <h2 style={{ color: "white", margin: "0 0 20px", fontSize: "20px" }}>Create Account</h2>
          {[
            { label: "USERNAME", key: "username", type: "text", placeholder: "Choose a username" },
            { label: "EMAIL", key: "email", type: "email", placeholder: "Your email address" },
            { label: "PASSWORD", key: "password", type: "password", placeholder: "Create a strong password" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: "15px" }}>
              <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>{f.label}</label>
              <input style={inputStyle} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          {error && <div style={{ background: "#2a0a0a", border: "1px solid #5a1a1a", borderRadius: "8px", padding: "12px", marginBottom: "15px" }}><p style={{ color: "#ff6b6b", margin: 0, fontSize: "13px" }}>⚠ {error}</p></div>}
          <button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px", marginBottom: "15px" }}>
            {loading ? "CREATING..." : "CREATE ACCOUNT →"}
          </button>
          <p style={{ color: "#4a6a8a", textAlign: "center", fontSize: "13px", margin: 0 }}>
            Have an account? <span onClick={goLogin} style={{ color: T, cursor: "pointer" }}>Sign in here</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Nav({ page, setPage, user, onLogout }) {
  const links = ["Home", "Wallet", "Send", "MPesa", "History"];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ background: "#060e1c", borderBottom: `1px solid ${BORDER}`, padding: "0 20px", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: `linear-gradient(135deg, ${T}, #0099ff)`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>⬡</div>
          <span style={{ color: T, fontFamily: "Times New Roman", fontSize: "14px", fontWeight: "bold", letterSpacing: "1px" }}>CHAINPAY KENYA</span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer" }}>☰</button>
      </div>
      {menuOpen && (
        <div style={{ paddingBottom: "15px" }}>
          <p style={{ color: "#4a6a8a", fontSize: "11px", margin: "0 0 10px 10px" }}>👤 {user?.username}</p>
          {links.map(l => (
            <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", background: page === l ? `${T}15` : "transparent", color: page === l ? T : "#4a6a8a", border: "none", padding: "12px 10px", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "14px", borderRadius: "8px" }}>{l}</button>
          ))}
          <button onClick={onLogout} style={{ display: "block", width: "100%", textAlign: "left", background: "#1a0808", border: "none", color: "#ff6b6b", padding: "12px 10px", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "14px", borderRadius: "8px", marginTop: "5px" }}>LOGOUT</button>
        </div>
      )}
    </div>
  );
}

function Home({ user, wallet }) {
  const [blockHeight, setBlockHeight] = useState(18423);
  const [tps, setTps] = useState(142);
  useEffect(() => {
    const i = setInterval(() => { setBlockHeight(h => h + 1); setTps(Math.floor(130 + Math.random() * 40)); }, 4000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Times New Roman" }}>
      <div style={{ background: `linear-gradient(135deg, #060e1c, #0a1f3d)`, borderRadius: "16px", border: `1px solid ${BORDER}`, padding: "25px", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${T}, #0099ff, #8b5cf6)` }} />
        <div style={{ marginBottom: "5px" }}>
          <span style={{ background: `${T}15`, border: `1px solid ${T}40`, color: T, padding: "3px 12px", borderRadius: "20px", fontSize: "11px" }}>● BLOCK #{blockHeight.toLocaleString()} — LIVE</span>
        </div>
        <h1 style={{ color: "white", fontSize: "22px", margin: "10px 0 5px" }}>Welcome, {user?.username}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px", flexWrap: "wrap" }}>
          <span style={{ color: "#4a6a8a", fontSize: "12px" }}>Account:</span>
          <span style={{ color: "#60a5fa", fontSize: "14px", fontWeight: "bold", letterSpacing: "2px", background: "#060e1c", border: `1px solid ${BORDER}`, padding: "3px 10px", borderRadius: "8px" }}>{wallet?.accountNumber || "..."}</span>
        </div>
        <p style={{ color: "#4a6a8a", margin: "0 0 5px", fontSize: "11px", letterSpacing: "1px" }}>WALLET BALANCE</p>
        <h1 style={{ color: T, fontSize: "36px", margin: 0 }}>KES {(wallet?.balanceKES || 0).toLocaleString()}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "24h Volume", value: "KES 2.4B", color: T },
          { label: "TPS", value: tps, color: "#60a5fa" },
          { label: "Block Height", value: `#${blockHeight.toLocaleString()}`, color: "#f59e0b" },
          { label: "Consensus", value: "100%", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "15px" }}>
            <p style={{ color: "#4a6a8a", fontSize: "10px", margin: "0 0 5px", letterSpacing: "1px" }}>{s.label.toUpperCase()}</p>
            <p style={{ color: s.color, fontSize: "18px", fontWeight: "bold", margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
        {[
          { title: "Immutable Ledger", desc: "Every transaction is permanently recorded on Hyperledger Fabric.", icon: "🔒", color: T },
          { title: "M-Pesa Integration", desc: "Deposit and withdraw via Safaricom Daraja API.", icon: "📱", color: "#22c55e" },
          { title: "CPK Account Numbers", desc: "Send money securely using unique CPK account numbers.", icon: "⬡", color: "#60a5fa" },
        ].map(f => (
          <div key={f.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px", display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "24px" }}>{f.icon}</div>
            <div>
              <h3 style={{ color: f.color, margin: "0 0 6px", fontSize: "15px" }}>{f.title}</h3>
              <p style={{ color: "#4a6a8a", margin: 0, fontSize: "13px", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Wallet({ user, refresh }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const conversions = { KES: 1, USD: 129.50, EUR: 140.20, GBP: 163.80 };
  const preview = amount ? (parseFloat(amount) * conversions[currency]).toFixed(2) : null;

  const deposit = async () => {
    if (!amount) { setMessage("Enter an amount"); return; }
    setLoading(true);
    const res = await fetch(`${API}/deposit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user.username, amount, currency }) });
    const data = await res.json();
    setMessage(data.status || data.error);
    setAmount("");
    refresh();
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Times New Roman" }}>
      <h2 style={{ color: "white", marginBottom: "5px" }}>Deposit Funds</h2>
      <p style={{ color: "#4a6a8a", fontSize: "13px", marginBottom: "20px" }}>Automatically converted to KES</p>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px", marginBottom: "15px" }}>
        <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>AMOUNT</label>
        <input style={{ ...inputStyle, marginBottom: "15px" }} placeholder="e.g. 1000" value={amount} onChange={e => setAmount(e.target.value)} />
        <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>CURRENCY</label>
        <select style={{ ...inputStyle, marginBottom: "15px" }} value={currency} onChange={e => setCurrency(e.target.value)}>
          <option>KES</option><option>USD</option><option>EUR</option><option>GBP</option>
        </select>
        {preview && currency !== "KES" && (
          <div style={{ background: `${T}08`, border: `1px solid ${T}25`, borderRadius: "8px", padding: "10px", marginBottom: "15px" }}>
            <p style={{ color: T, margin: 0, fontSize: "13px" }}>≈ KES {parseFloat(preview).toLocaleString()}</p>
          </div>
        )}
        <button onClick={deposit} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px" }}>
          {loading ? "PROCESSING..." : "DEPOSIT →"}
        </button>
        {message && <div style={{ marginTop: "12px", background: "#0a2010", border: "1px solid #1a5030", borderRadius: "8px", padding: "10px" }}><p style={{ color: "#22c55e", margin: 0, fontSize: "13px" }}>✓ {message}</p></div>}
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px" }}>
        <p style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", margin: "0 0 12px" }}>EXCHANGE RATES</p>
        {Object.entries(conversions).filter(([k]) => k !== "KES").map(([cur, rate]) => (
          <div key={cur} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ color: "#4a6a8a", fontSize: "13px" }}>1 {cur}</span>
            <span style={{ color: "white", fontSize: "13px" }}>KES {rate.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Send({ user, refresh }) {
  const [form, setForm] = useState({ toAccount: "", amount: "", currency: "KES" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const send = async () => {
    if (!form.toAccount || !form.amount) { setMessage("Fill all fields"); setIsError(true); return; }
    setLoading(true);
    const res = await fetch(`${API}/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ from: user.username, toAccount: form.toAccount, amount: form.amount, currency: form.currency }) });
    const data = await res.json();
    setIsError(!!data.error);
    setMessage(data.status || data.error);
    if (!data.error) { setForm({ toAccount: "", amount: "", currency: "KES" }); refresh(); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Times New Roman" }}>
      <h2 style={{ color: "white", marginBottom: "5px" }}>Send Money</h2>
      <p style={{ color: "#4a6a8a", fontSize: "13px", marginBottom: "20px" }}>Transfer using CPK account number</p>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px" }}>
        <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>RECIPIENT ACCOUNT NUMBER</label>
        <input style={{ ...inputStyle, marginBottom: "15px" }} placeholder="e.g. CPK483920" value={form.toAccount} onChange={e => setForm({ ...form, toAccount: e.target.value.toUpperCase() })} />
        <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>AMOUNT</label>
        <input style={{ ...inputStyle, marginBottom: "15px" }} placeholder="e.g. 500" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>CURRENCY</label>
        <select style={{ ...inputStyle, marginBottom: "20px" }} value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
          <option>KES</option><option>USD</option><option>EUR</option><option>GBP</option>
        </select>
        <button onClick={send} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px" }}>
          {loading ? "SENDING..." : "SEND →"}
        </button>
        {message && <div style={{ marginTop: "12px", background: isError ? "#1a0808" : "#0a2010", border: `1px solid ${isError ? "#5a1a1a" : "#1a5030"}`, borderRadius: "8px", padding: "10px" }}><p style={{ color: isError ? "#ff6b6b" : "#22c55e", margin: 0, fontSize: "13px" }}>{isError ? "⚠" : "✓"} {message}</p></div>}
      </div>
    </div>
  );
}

function MPesa({ user, refresh }) {
  const [mode, setMode] = useState("deposit");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const deposit = async () => {
    setLoading(true);
    const res = await fetch(`${API}/mpesa/pay`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, amount, reference: "ChainPay", username: user.username }) });
    const data = await res.json();
    setMessage(data.result ? data.result.ResponseDescription : data.error);
    refresh();
    setLoading(false);
  };

  const withdraw = async () => {
    setLoading(true);
    const res = await fetch(`${API}/mpesa/withdraw`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user.username, phone, amount }) });
    const data = await res.json();
    setMessage(data.status || data.error);
    refresh();
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Times New Roman" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "5px" }}>
        <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📱</div>
        <h2 style={{ color: "white", margin: 0 }}>M-Pesa</h2>
      </div>
      <p style={{ color: "#4a6a8a", fontSize: "13px", marginBottom: "20px" }}>Safaricom Daraja API — Sandbox</p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
        {["deposit", "withdraw"].map(m => (
          <button key={m} onClick={() => { setMode(m); setMessage(""); }} style={{ flex: 1, padding: "12px", background: mode === m ? (m === "deposit" ? "#16a34a" : "#d97706") : CARD, color: mode === m ? "white" : "#4a6a8a", border: `1px solid ${mode === m ? "transparent" : BORDER}`, borderRadius: "10px", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "13px" }}>
            {m === "deposit" ? "📥 DEPOSIT" : "📤 WITHDRAW"}
          </button>
        ))}
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px" }}>
        <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>PHONE NUMBER</label>
        <input style={{ ...inputStyle, marginBottom: "15px" }} placeholder="254708374149" value={phone} onChange={e => setPhone(e.target.value)} />
        <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>AMOUNT (KES)</label>
        <input style={{ ...inputStyle, marginBottom: "20px" }} placeholder="e.g. 100" value={amount} onChange={e => setAmount(e.target.value)} />
        <button onClick={mode === "deposit" ? deposit : withdraw} disabled={loading} style={{ width: "100%", padding: "15px", background: mode === "deposit" ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #d97706, #b45309)", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px" }}>
          {loading ? "PROCESSING..." : mode === "deposit" ? "SEND M-PESA DEPOSIT →" : "WITHDRAW TO M-PESA →"}
        </button>
        {message && <div style={{ marginTop: "12px", background: "#0a2010", border: "1px solid #1a5030", borderRadius: "8px", padding: "10px" }}><p style={{ color: "#22c55e", margin: 0, fontSize: "13px" }}>✓ {message}</p></div>}
      </div>
    </div>
  );
}

function History({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API}/user/${user.username}`).then(r => r.json()).then(d => { setTransactions(d.transactions || []); setLoading(false); });
  }, [user]);

  const typeColor = { DEPOSIT: "#22c55e", TRANSFER: T, "M-PESA DEPOSIT": "#16a34a", "M-PESA WITHDRAW": "#d97706" };

  return (
    <div style={{ padding: "20px", fontFamily: "Times New Roman" }}>
      <h2 style={{ color: "white", marginBottom: "5px" }}>Transaction History</h2>
      <p style={{ color: "#4a6a8a", fontSize: "13px", marginBottom: "20px" }}>{transactions.length} permanent records</p>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "30px", textAlign: "center", color: "#4a6a8a" }}>Loading...</p>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
            <p style={{ color: "#4a6a8a" }}>No transactions yet</p>
          </div>
        ) : transactions.map((tx, i) => (
          <div key={tx.txId || i} style={{ padding: "15px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ background: `${typeColor[tx.type] || T}15`, color: typeColor[tx.type] || T, padding: "3px 10px", borderRadius: "20px", fontSize: "11px" }}>{tx.type}</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>{tx.kesAmount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#4a6a8a", fontSize: "11px" }}>{tx.from} → {tx.to}</span>
              <span style={{ color: "#2a4a6a", fontSize: "11px" }}>{tx.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("Home");
  const [user, setUser] = useState(() => { const s = localStorage.getItem("user"); return s ? JSON.parse(s) : null; });
  const [authPage, setAuthPage] = useState("login");
  const [wallet, setWallet] = useState(null);

  const refreshWallet = () => {
    if (user) fetch(`${API}/user/${user.username}`).then(r => r.json()).then(d => setWallet(d));
  };

  useEffect(() => { refreshWallet(); }, [user]);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setAuthPage("login"); };

  if (!user) {
    return authPage === "login"
      ? <LoginPage onLogin={handleLogin} goRegister={() => setAuthPage("register")} />
      : <RegisterPage onRegister={() => setAuthPage("login")} goLogin={() => setAuthPage("login")} />;
  }

  return (
    <div style={{ background: DARK, minHeight: "100vh" }}>
      <Nav page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      {page === "Home" && <Home user={user} wallet={wallet} />}
      {page === "Wallet" && <Wallet user={user} refresh={refreshWallet} />}
      {page === "Send" && <Send user={user} refresh={refreshWallet} />}
      {page === "MPesa" && <MPesa user={user} refresh={refreshWallet} />}
      {page === "History" && <History user={user} />}
    </div>
  );
}

export default App;
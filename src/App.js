import React, { useState, useEffect } from "react";

const T = "#00f5c4";
const DARK = "#050d1a";
const CARD = "#0a1628";
const BORDER = "#0d2545";
const API = "http://localhost:3001";

const glow = { boxShadow: "0 0 30px rgba(0,245,196,0.08)" };
const inputStyle = {
  width: "100%", padding: "13px 16px",
  background: "#060f20", border: "1px solid #0d2545",
  borderRadius: "10px", color: "white",
  fontFamily: "Times New Roman", fontSize: "14px",
  outline: "none", boxSizing: "border-box",
  transition: "border 0.2s"
};

function Badge({ text, color = T }) {
  return (
    <span style={{ background: `${color}15`, border: `1px solid ${color}40`, color, padding: "3px 12px", borderRadius: "20px", fontSize: "11px", letterSpacing: "1px", fontFamily: "Times New Roman" }}>
      {text}
    </span>
  );
}

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
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", fontFamily: "Times New Roman", overflow: "hidden" }}>
      {/* Left Panel */}
      <div style={{ flex: 1, background: `linear-gradient(135deg, #050d1a 0%, #0a1f3d 50%, #050d1a 100%)`, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px", background: `radial-gradient(circle, ${T}10, transparent)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "5%", width: "200px", height: "200px", background: "radial-gradient(circle, #0066ff10, transparent)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px" }}>
            <div style={{ width: "44px", height: "44px", background: `linear-gradient(135deg, ${T}, #0099ff)`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⬡</div>
            <span style={{ color: T, fontSize: "18px", fontWeight: "bold", letterSpacing: "2px" }}>CHAINPAY KENYA</span>
          </div>
          <h1 style={{ color: "white", fontSize: "42px", lineHeight: "1.2", margin: "0 0 20px", fontWeight: "bold" }}>
            Secure Financial<br />
            <span style={{ color: T }}>Blockchain</span><br />
            Transactions
          </h1>
          <p style={{ color: "#4a6a8a", fontSize: "15px", lineHeight: "1.8", maxWidth: "400px", margin: "0 0 40px" }}>
            A Hyperledger Fabric-powered platform for Kenya's financial sector. Send, receive, and track money with permanent blockchain records.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {["🔒 Immutable blockchain ledger", "📱 M-Pesa Daraja integration", "🌍 Multi-currency support (KES, USD, EUR, GBP)", "⬡ Unique CPK account numbers"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#4a6a8a", fontSize: "14px" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "#060e1c", borderLeft: `1px solid ${BORDER}` }}>
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "35px" }}>
            <h2 style={{ color: "white", fontSize: "26px", margin: "0 0 8px" }}>Welcome back</h2>
            <p style={{ color: "#4a6a8a", margin: 0, fontSize: "14px" }}>Sign in to your ChainPay account</p>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>USERNAME</label>
            <input style={inputStyle} placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>PASSWORD</label>
            <input style={inputStyle} type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          {error && (
            <div style={{ background: "#2a0a0a", border: "1px solid #5a1a1a", borderRadius: "8px", padding: "12px 16px", marginBottom: "18px" }}>
              <p style={{ color: "#ff6b6b", margin: 0, fontSize: "13px" }}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px", letterSpacing: "1px", marginBottom: "20px" }}>
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>

          <p style={{ color: "#4a6a8a", textAlign: "center", fontSize: "13px", margin: 0 }}>
            No account?{" "}
            <span onClick={goRegister} style={{ color: T, cursor: "pointer", textDecoration: "underline" }}>Create one here</span>
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
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", fontFamily: "Times New Roman", overflow: "hidden" }}>
      <div style={{ flex: 1, background: `linear-gradient(135deg, #050d1a 0%, #0a1f3d 50%, #050d1a 100%)`, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px", background: `radial-gradient(circle, ${T}10, transparent)`, borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px" }}>
            <div style={{ width: "44px", height: "44px", background: `linear-gradient(135deg, ${T}, #0099ff)`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⬡</div>
            <span style={{ color: T, fontSize: "18px", fontWeight: "bold", letterSpacing: "2px" }}>CHAINPAY KENYA</span>
          </div>
          <h1 style={{ color: "white", fontSize: "38px", lineHeight: "1.2", margin: "0 0 20px" }}>
            Join Kenya's<br />
            <span style={{ color: T }}>Blockchain</span><br />
            Financial Network
          </h1>
          <p style={{ color: "#4a6a8a", fontSize: "15px", lineHeight: "1.8", maxWidth: "400px" }}>
            Get your unique CPK account number and start sending money securely on the blockchain in minutes.
          </p>
        </div>
      </div>

      <div style={{ width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "#060e1c", borderLeft: `1px solid ${BORDER}` }}>
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "35px" }}>
            <h2 style={{ color: "white", fontSize: "26px", margin: "0 0 8px" }}>Create Account</h2>
            <p style={{ color: "#4a6a8a", margin: 0, fontSize: "14px" }}>Get your CPK account number instantly</p>
          </div>

          {[
            { label: "USERNAME", key: "username", type: "text", placeholder: "Choose a username" },
            { label: "EMAIL", key: "email", type: "email", placeholder: "Your email address" },
            { label: "PASSWORD", key: "password", type: "password", placeholder: "Create a strong password" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: "18px" }}>
              <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>{f.label}</label>
              <input style={inputStyle} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}

          {error && (
            <div style={{ background: "#2a0a0a", border: "1px solid #5a1a1a", borderRadius: "8px", padding: "12px 16px", marginBottom: "18px" }}>
              <p style={{ color: "#ff6b6b", margin: 0, fontSize: "13px" }}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px", letterSpacing: "1px", marginBottom: "20px" }}>
            {loading ? "CREATING..." : "CREATE ACCOUNT →"}
          </button>

          <p style={{ color: "#4a6a8a", textAlign: "center", fontSize: "13px", margin: 0 }}>
            Already have an account?{" "}
            <span onClick={goLogin} style={{ color: T, cursor: "pointer", textDecoration: "underline" }}>Sign in here</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Nav({ page, setPage, user, onLogout }) {
  const links = ["Home", "Wallet", "Send", "MPesa", "History"];
  return (
    <div style={{ background: "#060e1c", borderBottom: `1px solid ${BORDER}`, padding: "0 30px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "32px", height: "32px", background: `linear-gradient(135deg, ${T}, #0099ff)`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>⬡</div>
        <span style={{ color: T, fontFamily: "Times New Roman", fontSize: "15px", fontWeight: "bold", letterSpacing: "2px" }}>CHAINPAY KENYA</span>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {links.map(l => (
          <button key={l} onClick={() => setPage(l)} style={{ background: page === l ? `${T}15` : "transparent", color: page === l ? T : "#4a6a8a", border: page === l ? `1px solid ${T}40` : "1px solid transparent", padding: "7px 18px", borderRadius: "8px", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "13px", transition: "all 0.2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Badge text={`👤 ${user?.username}`} color="#4a6a8a" />
        <button onClick={onLogout} style={{ background: "#1a0808", border: "1px solid #3a1515", color: "#ff6b6b", padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "12px" }}>LOGOUT</button>
      </div>
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
    <div style={{ padding: "30px", fontFamily: "Times New Roman" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #060e1c 0%, #0a1f3d 60%, #060e1c 100%)`, borderRadius: "16px", border: `1px solid ${BORDER}`, padding: "50px", marginBottom: "25px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${T}, #0099ff, #8b5cf6)` }} />
        <div style={{ position: "absolute", top: "50%", right: "5%", transform: "translateY(-50%)", fontSize: "120px", opacity: 0.03 }}>⬡</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ marginBottom: "8px" }}><Badge text={`● BLOCK #${blockHeight.toLocaleString()} — LIVE`} /></div>
            <h1 style={{ color: "white", fontSize: "28px", margin: "8px 0 5px" }}>Welcome back, {user?.username}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ color: "#4a6a8a", fontSize: "13px" }}>Account Number:</span>
              <span style={{ color: "#60a5fa", fontSize: "16px", fontWeight: "bold", letterSpacing: "2px", background: "#060e1c", border: `1px solid ${BORDER}`, padding: "4px 14px", borderRadius: "8px" }}>{wallet?.accountNumber || "..."}</span>
            </div>
            <div>
              <p style={{ color: "#4a6a8a", margin: "0 0 5px", fontSize: "12px", letterSpacing: "1px" }}>WALLET BALANCE</p>
              <h1 style={{ color: T, fontSize: "52px", margin: 0, letterSpacing: "-1px" }}>KES {(wallet?.balanceKES || 0).toLocaleString()}</h1>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "200px" }}>
            {[
              { label: "TPS", value: tps, color: T },
              { label: "Network", value: "LIVE", color: "#22c55e" },
              { label: "Nodes", value: "5 / 5", color: "#60a5fa" },
            ].map(s => (
              <div key={s.label} style={{ background: "#050d1a", border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#4a6a8a", fontSize: "12px" }}>{s.label}</span>
                <span style={{ color: s.color, fontSize: "14px", fontWeight: "bold" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "25px" }}>
        {[
          { label: "24h Volume", value: "KES 2.4B", sub: "+12.3%", color: T },
          { label: "Transactions", value: "18,284", sub: "all time", color: "#60a5fa" },
          { label: "Block Height", value: `#${blockHeight.toLocaleString()}`, sub: "~4s blocks", color: "#f59e0b" },
          { label: "Consensus", value: "100%", sub: "all nodes", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px", position: "relative", overflow: "hidden", ...glow }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <p style={{ color: "#4a6a8a", fontSize: "11px", margin: "0 0 8px", letterSpacing: "1px" }}>{s.label.toUpperCase()}</p>
            <p style={{ color: s.color, fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" }}>{s.value}</p>
            <p style={{ color: "#2a4a6a", fontSize: "11px", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
        {[
          { title: "Immutable Ledger", desc: "Every transaction is permanently recorded on Hyperledger Fabric and cannot be altered by any party.", icon: "🔒", color: T },
          { title: "M-Pesa Integration", desc: "Deposit and withdraw directly via Safaricom Daraja API. Real-time KES mobile money transactions.", icon: "📱", color: "#22c55e" },
          { title: "CPK Account Numbers", desc: "Send money securely using unique CPK account numbers — no phone numbers or personal details needed.", icon: "⬡", color: "#60a5fa" },
        ].map(f => (
          <div key={f.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "25px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: 0, right: 0, fontSize: "60px", opacity: 0.04 }}>{f.icon}</div>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
            <h3 style={{ color: f.color, margin: "0 0 10px", fontSize: "16px" }}>{f.title}</h3>
            <p style={{ color: "#4a6a8a", margin: 0, lineHeight: "1.7", fontSize: "13px" }}>{f.desc}</p>
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

  const conversions = { KES: 1, USD: 129.50, EUR: 140.20, GBP: 163.80 };
  const preview = amount ? (parseFloat(amount) * conversions[currency]).toFixed(2) : null;

  return (
    <div style={{ padding: "30px", fontFamily: "Times New Roman", maxWidth: "520px", margin: "0 auto" }}>
      <h2 style={{ color: "white", marginBottom: "5px" }}>Deposit Funds</h2>
      <p style={{ color: "#4a6a8a", fontSize: "13px", marginBottom: "25px" }}>Deposit in any currency — automatically converted to KES at live rates</p>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "28px", ...glow }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "18px" }}>
          <div>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>AMOUNT</label>
            <input style={inputStyle} placeholder="e.g. 1000" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>CURRENCY</label>
            <select style={inputStyle} value={currency} onChange={e => setCurrency(e.target.value)}>
              <option>KES</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </div>
        </div>
        {preview && currency !== "KES" && (
          <div style={{ marginTop: "15px", background: `${T}08`, border: `1px solid ${T}25`, borderRadius: "8px", padding: "12px 16px" }}>
            <p style={{ color: T, margin: 0, fontSize: "13px" }}>≈ KES {parseFloat(preview).toLocaleString()} at 1 {currency} = KES {conversions[currency]}</p>
          </div>
        )}
        <button onClick={deposit} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px", marginTop: "20px" }}>
          {loading ? "PROCESSING..." : "DEPOSIT →"}
        </button>
        {message && <div style={{ marginTop: "15px", background: "#0a2010", border: "1px solid #1a5030", borderRadius: "8px", padding: "12px 16px" }}><p style={{ color: "#22c55e", margin: 0, fontSize: "13px" }}>✓ {message}</p></div>}
      </div>

      {/* Exchange rates */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px", marginTop: "15px" }}>
        <p style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", margin: "0 0 15px" }}>LIVE EXCHANGE RATES TO KES</p>
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
    <div style={{ padding: "30px", fontFamily: "Times New Roman", maxWidth: "520px", margin: "0 auto" }}>
      <h2 style={{ color: "white", marginBottom: "5px" }}>Send Money</h2>
      <p style={{ color: "#4a6a8a", fontSize: "13px", marginBottom: "25px" }}>Transfer funds using the recipient's CPK account number</p>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "28px", ...glow }}>
        <div style={{ marginBottom: "18px" }}>
          <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>RECIPIENT ACCOUNT NUMBER</label>
          <input style={inputStyle} placeholder="e.g. CPK483920" value={form.toAccount} onChange={e => setForm({ ...form, toAccount: e.target.value.toUpperCase() })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>AMOUNT</label>
            <input style={inputStyle} placeholder="e.g. 500" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>CURRENCY</label>
            <select style={inputStyle} value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
              <option>KES</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </div>
        </div>
        <button onClick={send} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T}, #0099ff)`, border: "none", borderRadius: "10px", color: DARK, fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px" }}>
          {loading ? "SENDING..." : "SEND →"}
        </button>
        {message && <div style={{ marginTop: "15px", background: isError ? "#1a0808" : "#0a2010", border: `1px solid ${isError ? "#5a1a1a" : "#1a5030"}`, borderRadius: "8px", padding: "12px 16px" }}><p style={{ color: isError ? "#ff6b6b" : "#22c55e", margin: 0, fontSize: "13px" }}>{isError ? "⚠" : "✓"} {message}</p></div>}
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
    <div style={{ padding: "30px", fontFamily: "Times New Roman", maxWidth: "520px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "5px" }}>
        <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📱</div>
        <h2 style={{ color: "white", margin: 0 }}>M-Pesa</h2>
      </div>
      <p style={{ color: "#4a6a8a", fontSize: "13px", marginBottom: "25px" }}>Powered by Safaricom Daraja API — Sandbox Mode</p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["deposit", "withdraw"].map(m => (
          <button key={m} onClick={() => { setMode(m); setMessage(""); }} style={{ flex: 1, padding: "12px", background: mode === m ? (m === "deposit" ? "#16a34a" : "#d97706") : CARD, color: mode === m ? "white" : "#4a6a8a", border: `1px solid ${mode === m ? "transparent" : BORDER}`, borderRadius: "10px", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "13px", fontWeight: mode === m ? "bold" : "normal" }}>
            {m === "deposit" ? "📥 DEPOSIT" : "📤 WITHDRAW"}
          </button>
        ))}
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "28px", ...glow }}>
        <div style={{ marginBottom: "18px" }}>
          <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>PHONE NUMBER</label>
          <input style={inputStyle} placeholder="254708374149" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div style={{ marginBottom: "22px" }}>
          <label style={{ color: "#4a6a8a", fontSize: "11px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>AMOUNT (KES)</label>
          <input style={inputStyle} placeholder="e.g. 100" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <button onClick={mode === "deposit" ? deposit : withdraw} disabled={loading} style={{ width: "100%", padding: "15px", background: mode === "deposit" ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #d97706, #b45309)", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", fontFamily: "Times New Roman", fontSize: "15px" }}>
          {loading ? "PROCESSING..." : mode === "deposit" ? "SEND M-PESA DEPOSIT →" : "WITHDRAW TO M-PESA →"}
        </button>
        {message && <div style={{ marginTop: "15px", background: "#0a2010", border: "1px solid #1a5030", borderRadius: "8px", padding: "12px 16px" }}><p style={{ color: "#22c55e", margin: 0, fontSize: "13px" }}>✓ {message}</p></div>}
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
    <div style={{ padding: "30px", fontFamily: "Times New Roman" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div>
          <h2 style={{ color: "white", margin: 0 }}>Transaction History</h2>
          <p style={{ color: "#4a6a8a", fontSize: "13px", margin: "5px 0 0" }}>Permanent blockchain record of all your transactions</p>
        </div>
        <Badge text={`${transactions.length} RECORDS`} />
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr", padding: "14px 20px", background: "#060e1c", borderBottom: `1px solid ${BORDER}` }}>
          {["TYPE", "FROM → TO", "AMOUNT", "TIME"].map(h => (
            <span key={h} style={{ color: "#2a4a6a", fontSize: "11px", letterSpacing: "1px" }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <p style={{ padding: "40px", textAlign: "center", color: "#4a6a8a" }}>Loading...</p>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
            <p style={{ color: "#4a6a8a" }}>No transactions yet</p>
          </div>
        ) : transactions.map((tx, i) => (
          <div key={tx.txId || i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, alignItems: "center" }}>
            <span style={{ background: `${typeColor[tx.type] || T}15`, color: typeColor[tx.type] || T, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", width: "fit-content" }}>{tx.type}</span>
            <span style={{ color: "#4a6a8a", fontSize: "12px" }}>{tx.from} → {tx.to}</span>
            <span style={{ color: "white", fontSize: "13px", fontWeight: "bold" }}>{tx.kesAmount}</span>
            <span style={{ color: "#2a4a6a", fontSize: "11px" }}>{tx.time}</span>
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
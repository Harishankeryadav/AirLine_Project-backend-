import { useState, useEffect, useMemo } from "react";
import { Plane, LogIn, UserPlus, Search, Ticket, ShieldCheck, LogOut, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Design direction: an airport departure-board aesthetic - ink background,
// amber signal accent, monospace for every flight number/time/price/code.
// Two type families only: Space Grotesk for UI text, IBM Plex Mono for data.
// Hairline rules instead of card shadows; sentence case everywhere.
// ---------------------------------------------------------------------------

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:8080");
  const [showSettings, setShowSettings] = useState(false);

  const [token, setToken] = useState(null);
  const user = useMemo(() => (token ? decodeJwtPayload(token) : null), [token]);

  const [tab, setTab] = useState("search");

  // ---- generic API helper -------------------------------------------------
  async function api(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (auth && token) headers["x-access-token"] = token;

    let res;
    try {
      res = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new Error(
        `Could not reach ${baseUrl}. Is the API gateway running, and does its CORS config allow this origin? (${e.message})`
      );
    }

    let data = null;
    try {
      data = await res.json();
    } catch {
      // some error paths might not return JSON
    }

    if (!res.ok || (data && data.success === false)) {
      throw new Error((data && data.message) || `Request failed with status ${res.status}`);
    }
    return data ? data.data : null;
  }

  return (
    <div style={{ minHeight: "100%", background: "var(--ink)", color: "var(--text)", fontFamily: "var(--sans)" }}>
      <style>{`
        ${FONT_IMPORT}
        :root {
          --ink: #11151b;
          --surface: #1a212b;
          --surface-2: #212936;
          --border: #2b333f;
          --text: #ece9e2;
          --text-muted: #8992a0;
          --amber: #f3a530;
          --amber-dim: #7a5a24;
          --teal: #3fb8a4;
          --coral: #e2574c;
          --sans: 'Space Grotesk', system-ui, sans-serif;
          --mono: 'IBM Plex Mono', 'SF Mono', monospace;
        }
        * { box-sizing: border-box; }
        input, select, textarea {
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--sans);
          font-size: 14px;
          padding: 9px 11px;
          border-radius: 4px;
          width: 100%;
          outline: none;
        }
        input:focus, select:focus, textarea:focus { border-color: var(--amber); }
        input::placeholder { color: var(--text-muted); }
        label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 5px; }
        button { font-family: var(--sans); cursor: pointer; }
        .btn-primary {
          background: var(--amber); color: #1a1205; border: none;
          font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 4px;
        }
        .btn-primary:disabled { background: var(--amber-dim); cursor: not-allowed; }
        .btn-ghost {
          background: transparent; color: var(--text); border: 1px solid var(--border);
          font-size: 14px; padding: 9px 16px; border-radius: 4px;
        }
        .btn-ghost:hover { border-color: var(--text-muted); }
        .mono { font-family: var(--mono); }
        .field-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 14px; }
        .panel { border: 1px solid var(--border); border-radius: 6px; padding: 20px; background: var(--surface); }
        .hairline-row { border-bottom: 1px solid var(--border); padding: 14px 0; }
        .hairline-row:last-child { border-bottom: none; }
        a { color: var(--amber); }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 60px" }}>
        <TopBar
          user={user}
          onSignOut={() => setToken(null)}
          baseUrl={baseUrl}
          setBaseUrl={setBaseUrl}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />

        <NavTabs tab={tab} setTab={setTab} signedIn={!!token} />

        <div style={{ marginTop: 28 }}>
          {tab === "auth" && <AuthPanel api={api} onToken={setToken} onDone={() => setTab("search")} />}
          {tab === "search" && <SearchPanel api={api} signedIn={!!token} userId={user?.id} onNeedAuth={() => setTab("auth")} />}
          {tab === "mybooking" && <BookingLookupPanel api={api} />}
          {tab === "admin" && <AdminPanel api={api} signedIn={!!token} onNeedAuth={() => setTab("auth")} />}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function TopBar({ user, onSignOut, baseUrl, setBaseUrl, showSettings, setShowSettings }) {
  return (
    <div style={{ borderBottom: "2px solid var(--amber)", padding: "20px 0", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Plane size={22} color="var(--amber)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 17 }}>Airline ops console</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Talking to the Spring Boot gateway you just built</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {user && (
          <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "right" }}>
            Signed in as<br />
            <span className="mono" style={{ color: "var(--text)" }}>{user.email}</span>
          </div>
        )}
        {user && (
          <button className="btn-ghost" onClick={onSignOut} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LogOut size={14} /> Sign out
          </button>
        )}
        <button className="btn-ghost" onClick={() => setShowSettings((s) => !s)}>
          Gateway: <span className="mono">{baseUrl.replace(/^https?:\/\//, "")}</span>
        </button>
      </div>
      {showSettings && (
        <div style={{ position: "absolute", right: 20, top: 90, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 16, width: 320, zIndex: 10 }}>
          <label>Gateway base URL</label>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="http://localhost:8080" />
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            Change this if your api-gateway runs somewhere other than localhost:8080.
          </div>
        </div>
      )}
    </div>
  );
}

function NavTabs({ tab, setTab, signedIn }) {
  const items = [
    { id: "search", label: "Search & book", icon: Search },
    { id: "mybooking", label: "Look up a booking", icon: Ticket },
    { id: "admin", label: "Admin tools", icon: ShieldCheck },
    { id: "auth", label: signedIn ? "Account" : "Sign in / sign up", icon: signedIn ? ShieldCheck : LogIn },
  ];
  return (
    <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border)" }}>
      {items.map((it) => {
        const active = tab === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            style={{
              background: "none", border: "none", padding: "12px 2px 10px",
              color: active ? "var(--text)" : "var(--text-muted)",
              borderBottom: active ? "2px solid var(--amber)" : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: active ? 600 : 400,
              transition: "border-color 120ms ease",
            }}
          >
            <Icon size={15} /> {it.label}
          </button>
        );
      })}
    </div>
  );
}

function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--coral)", fontSize: 13, marginTop: 10 }}>
      <AlertCircle size={15} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
}

function SuccessNote({ message }) {
  if (!message) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--teal)", fontSize: 13, marginTop: 10 }}>
      <CheckCircle2 size={15} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AUTH: signup / signin against auth-service
// ---------------------------------------------------------------------------
function AuthPanel({ api, onToken, onDone }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "signup") {
        await api("/authservice/api/v1/signup", { method: "POST", body: { email, password } });
        setSuccess("Account created. Switch to sign in to get your token.");
        setMode("signin");
      } else {
        const data = await api("/authservice/api/v1/signin", { method: "POST", body: { email, password } });
        onToken(data.token);
        onDone();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 420 }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <TabLink active={mode === "signin"} onClick={() => setMode("signin")} label="Sign in" />
        <TabLink active={mode === "signup"} onClick={() => setMode("signup")} label="Create account" />
      </div>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 14 }}>
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 3 characters" />
        </div>
        <button className="btn-primary" disabled={loading} style={{ width: "100%", display: "flex", justifyContent: "center", gap: 8 }}>
          {loading && <Loader2 size={15} className="spin" style={{ animation: "spin 0.8s linear infinite" }} />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <ErrorNote message={error} />
      <SuccessNote message={success} />
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.6 }}>
        New accounts are created with the CUSTOMER role by auth-service's seeder.
        Your token is kept only in this page's memory - refreshing the page signs you out.
      </div>
    </div>
  );
}

function TabLink({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", padding: 0, fontSize: 14,
        color: active ? "var(--amber)" : "var(--text-muted)", fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// SEARCH & BOOK: flights-service search, booking-service create
// ---------------------------------------------------------------------------
function SearchPanel({ api, signedIn, userId, onNeedAuth }) {
  const [departureAirportId, setDepartureAirportId] = useState("");
  const [arrivalAirportId, setArrivalAirportId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    api("/flightsservice/api/v1/airports").then(setAirports).catch(() => {});
  }, []);

  async function search(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (departureAirportId) params.set("departureAirportId", departureAirportId);
      if (arrivalAirportId) params.set("arrivalAirportId", arrivalAirportId);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      const data = await api(`/flightsservice/api/v1/flights?${params.toString()}`);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <form onSubmit={search}>
          <div className="field-row">
            <div>
              <label>Departure airport</label>
              <select value={departureAirportId} onChange={(e) => setDepartureAirportId(e.target.value)}>
                <option value="">Any</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}{a.city ? ` (${a.city.name})` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Arrival airport</label>
              <select value={arrivalAirportId} onChange={(e) => setArrivalAirportId(e.target.value)}>
                <option value="">Any</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}{a.city ? ` (${a.city.name})` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Min price</label>
              <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="optional" />
            </div>
            <div>
              <label>Max price</label>
              <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="optional" />
            </div>
          </div>
          {airports.length === 0 && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
              No airports found yet - create a city and an airport in Admin tools first.
            </div>
          )}
          <button className="btn-primary" disabled={loading}>{loading ? "Searching..." : "Search flights"}</button>
        </form>
        <ErrorNote message={error} />
      </div>

      {results && (
        <div className="panel">
          {results.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 14 }}>No flights matched those filters.</div>
          ) : (
            results.map((f) => <FlightRow key={f.id} flight={f} api={api} signedIn={signedIn} userId={userId} onNeedAuth={onNeedAuth} />)
          )}
        </div>
      )}
    </div>
  );
}

function FlightRow({ flight, api, signedIn, userId, onNeedAuth }) {
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  async function book() {
    if (!signedIn) {
      onNeedAuth();
      return;
    }
    setBooking(true);
    setError(null);
    try {
      const data = await api("/bookingservice/api/v1/bookings", {
        method: "POST",
        auth: true,
        body: { flightId: flight.id, userId: userId, noOfSeats: Number(seats) },
      });
      setConfirmed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="hairline-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <div>
        <div className="mono" style={{ fontSize: 15, fontWeight: 500 }}>{flight.flightNumber}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          <span className="mono">{formatDateTime(flight.departureTime)}</span> &rarr; <span className="mono">{formatDateTime(flight.arrivalTime)}</span>
        </div>
      </div>
      <div className="mono" style={{ fontSize: 16, color: "var(--amber)" }}>${flight.price}</div>
      <div className="mono" style={{ fontSize: 13, color: "var(--text-muted)" }}>{flight.totalSeats} seats left</div>

      {confirmed ? (
        <div style={{ fontSize: 13, color: "var(--teal)" }}>
          Booked - status <span className="mono">{confirmed.status}</span>, booking id <span className="mono">{confirmed.id}</span>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            style={{ width: 64 }}
          />
          <button className="btn-primary" onClick={book} disabled={booking}>
            {booking ? "Booking..." : signedIn ? "Book" : "Sign in to book"}
          </button>
        </div>
      )}
      <ErrorNote message={error} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// BOOKING LOOKUP: GET /bookings/{id}
// ---------------------------------------------------------------------------
function BookingLookupPanel({ api }) {
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function lookup(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api(`/bookingservice/api/v1/bookings/${bookingId}`, { auth: true });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 460 }}>
      <form onSubmit={lookup} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
        <input value={bookingId} onChange={(e) => setBookingId(e.target.value)} placeholder="Booking ID" />
        <button className="btn-primary" disabled={loading}>{loading ? "Looking up..." : "Look up"}</button>
      </form>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
        There's no "list my bookings" endpoint in booking-service yet - only lookup by ID - so this mirrors exactly
        what the backend currently supports.
      </div>
      <ErrorNote message={error} />
      {result && (
        <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.8 }}>
          <Row label="Booking ID" value={result.id} />
          <Row label="Flight ID" value={result.flightId} />
          <Row label="Seats" value={result.noOfSeats} />
          <Row label="Total cost" value={`$${result.totalCost}`} />
          <Row
            label="Status"
            value={result.status}
            color={result.status === "Booked" ? "var(--teal)" : result.status === "Cancelled" ? "var(--coral)" : "var(--amber)"}
          />
        </div>
      )}
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", padding: "6px 0" }}>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="mono" style={{ color: color || "var(--text)" }}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ADMIN: create city, airport, flight (flights-service) + schedule a reminder
// ---------------------------------------------------------------------------
function AdminPanel({ api, signedIn, onNeedAuth }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
        None of these writes are role-restricted on the backend yet (the original Node project wasn't either) -
        they're open to any signed-in user. Add an isAdmin check server-side before this goes anywhere real.
      </div>
      <CreateCityForm api={api} />
      <CreateAirportForm api={api} />
      <CreateFlightForm api={api} />
      <ScheduleReminderForm api={api} />
    </div>
  );
}

function FormShell({ title, subtitle, onSubmit, loading, error, success, children, submitLabel }) {
  return (
    <div className="panel">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>{subtitle}</div>
      <form onSubmit={onSubmit}>
        {children}
        <button className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </form>
      <ErrorNote message={error} />
      <SuccessNote message={success} />
    </div>
  );
}

function CreateCityForm({ api }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await api("/flightsservice/api/v1/city", { method: "POST", body: { name } });
      setSuccess(`Created city "${data.name}" with id ${data.id}`);
      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell title="Create a city" subtitle="POST /flightsservice/api/v1/city" onSubmit={submit} loading={loading} error={error} success={success} submitLabel="Create city">
      <div style={{ marginBottom: 14 }}>
        <label>City name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Delhi" />
      </div>
    </FormShell>
  );
}

function CreateAirportForm({ api }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    api("/flightsservice/api/v1/city").then(setCities).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await api("/flightsservice/api/v1/airports", {
        method: "POST",
        body: { name, address, cityId: Number(cityId) },
      });
      setSuccess(`Created airport "${data.name}" with id ${data.id}`);
      setName("");
      setAddress("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell title="Create an airport" subtitle="POST /flightsservice/api/v1/airports" onSubmit={submit} loading={loading} error={error} success={success} submitLabel="Create airport">
      <div className="field-row">
        <div>
          <label>Airport name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Indira Gandhi Intl" />
        </div>
        <div>
          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="optional" />
        </div>
        <div>
          <label>City</label>
          <select required value={cityId} onChange={(e) => setCityId(e.target.value)}>
            <option value="">Select a city...</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name} (id {c.id})</option>
            ))}
          </select>
        </div>
      </div>
      {cities.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
          No cities found yet - create one above first.
        </div>
      )}
    </FormShell>
  );
}

function CreateFlightForm({ api }) {
  const [form, setForm] = useState({
    flightNumber: "", airplaneId: "", departureAirportId: "", arrivalAirportId: "",
    departureTime: "", arrivalTime: "", price: "", boardingGate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    api("/flightsservice/api/v1/airports").then(setAirports).catch(() => {});
  }, []);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await api("/flightsservice/api/v1/flights", {
        method: "POST",
        body: {
          flightNumber: form.flightNumber,
          airplaneId: Number(form.airplaneId),
          departureAirportId: Number(form.departureAirportId),
          arrivalAirportId: Number(form.arrivalAirportId),
          departureTime: new Date(form.departureTime).toISOString(),
          arrivalTime: new Date(form.arrivalTime).toISOString(),
          price: Number(form.price),
          boardingGate: form.boardingGate || null,
        },
      });
      setSuccess(`Created flight "${data.flightNumber}" with id ${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      title="Create a flight"
      subtitle="POST /flightsservice/api/v1/flights - needs an airplaneId that already exists in the database (no airplane-creation endpoint was built yet)"
      onSubmit={submit} loading={loading} error={error} success={success} submitLabel="Create flight"
    >
      <div className="field-row">
        <div><label>Flight number</label><input required value={form.flightNumber} onChange={set("flightNumber")} placeholder="AI202" /></div>
        <div><label>Airplane ID</label><input required value={form.airplaneId} onChange={set("airplaneId")} placeholder="must already exist" /></div>
        <div><label>Price</label><input required value={form.price} onChange={set("price")} placeholder="4500" /></div>
        <div><label>Boarding gate</label><input value={form.boardingGate} onChange={set("boardingGate")} placeholder="optional" /></div>
      </div>
      <div className="field-row">
        <div>
          <label>Departure airport</label>
          <select required value={form.departureAirportId} onChange={set("departureAirportId")}>
            <option value="">Select...</option>
            {airports.map((a) => (
              <option key={a.id} value={a.id}>{a.name}{a.city ? ` (${a.city.name})` : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Arrival airport</label>
          <select required value={form.arrivalAirportId} onChange={set("arrivalAirportId")}>
            <option value="">Select...</option>
            {airports.map((a) => (
              <option key={a.id} value={a.id}>{a.name}{a.city ? ` (${a.city.name})` : ""}</option>
            ))}
          </select>
        </div>
        <div><label>Departure time</label><input required type="datetime-local" value={form.departureTime} onChange={set("departureTime")} /></div>
        <div><label>Arrival time</label><input required type="datetime-local" value={form.arrivalTime} onChange={set("arrivalTime")} /></div>
      </div>
      {airports.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
          No airports found yet - create one in the form above first.
        </div>
      )}
    </FormShell>
  );
}

function ScheduleReminderForm({ api }) {
  const [form, setForm] = useState({ subject: "", content: "", recipientEmail: "", notificationTime: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await api("/reminderservice/api/v1/tickets", {
        method: "POST",
        body: { ...form, notificationTime: new Date(form.notificationTime).toISOString() },
      });
      setSuccess(`Reminder ticket #${data.id} scheduled - reminder-service's cron sweep sends it every 2 minutes once due.`);
      setForm({ subject: "", content: "", recipientEmail: "", notificationTime: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      title="Schedule a one-off reminder"
      subtitle="POST /reminderservice/api/v1/tickets - this is independent of the automatic booking-confirmation emails"
      onSubmit={submit} loading={loading} error={error} success={success} submitLabel="Schedule reminder"
    >
      <div className="field-row">
        <div><label>Subject</label><input required value={form.subject} onChange={set("subject")} placeholder="Check-in reminder" /></div>
        <div><label>Recipient email</label><input required type="email" value={form.recipientEmail} onChange={set("recipientEmail")} /></div>
        <div><label>Send at</label><input required type="datetime-local" value={form.notificationTime} onChange={set("notificationTime")} /></div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label>Message</label>
        <textarea required rows={3} value={form.content} onChange={set("content")} placeholder="Your flight departs in 24 hours..." />
      </div>
    </FormShell>
  );
}

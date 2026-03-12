import { useEffect, useState } from "react";
import ProductForm from "./components/ProductForm";
import ImageModule from "./components/ImageModule";
import ResultPanel from "./components/ResultPanel";
import HistoryPanel from "./components/HistoryPanel";
import DashboardPage from "./pages/DashboardPage";
import { computePricing, generateListingContent, initialForm } from "./utils/helpers";
import { supabase } from "./lib/supabase";

const API_URL = "https://vinted-listing-api.onrender.com/api/listings";

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Compte créé. Vérifie ton email pour confirmer.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message || "Erreur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authPageStyle}>
      <div style={authCardStyle}>
        <h1>Vinted Listing Pro</h1>
        <p>Connecte-toi ou crée un compte pour accéder à l'application.</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading
              ? "Chargement..."
              : mode === "signup"
              ? "Créer un compte"
              : "Se connecter"}
          </button>
        </form>

        {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}

        <button
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setMessage("");
          }}
          style={switchButtonStyle}
        >
          {mode === "signup"
            ? "Déjà un compte ? Se connecter"
            : "Pas de compte ? Créer un compte"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({ brand: "", category: "" });
  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [generated, setGenerated] = useState(null);
  const [pricing, setPricing] = useState(computePricing(0, 0));
  const [settings, setSettings] = useState({ brightness: 104, contrast: 105, sharpness: 8 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadHistory = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setHistory(data);
  };

  useEffect(() => {
    if (session) loadHistory();
  }, [session]);

  useEffect(() => {
    setGenerated(generateListingContent(form));
    setPricing(computePricing(form.buyPrice, form.targetPrice));
  }, [form]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onCopy = async (content) => {
    await navigator.clipboard.writeText(content);
  };

  const onSave = async () => {
    const payload = {
      ...form,
      generated,
      status: "draft",
      images: images.map((img, idx) => ({ ...img, isMain: idx === mainIndex })),
      user_email: session?.user?.email || null,
      user_id: session?.user?.id || null,
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await loadHistory();
  };

  const onStatusChange = async (id, status) => {
    await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadHistory();
  };

  const onDownloadImages = () => {
    images.forEach((image, index) => {
      const link = document.createElement("a");
      link.href = image.preview || image.url;
      link.download = `vinted-image-${index + 1}.jpg`;
      link.click();
    });
  };

  const filteredHistory = history.filter((item) => {
    const brandOk = !filters.brand || (item.brand || "").toLowerCase().includes(filters.brand.toLowerCase());
    const categoryOk =
      !filters.category || (item.category || "").toLowerCase().includes(filters.category.toLowerCase());
    const userOk = !session?.user?.id || item.user_id === session.user.id || !item.user_id;
    return brandOk && categoryOk && userOk;
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!authReady) {
    return (
      <div style={authPageStyle}>
        <div style={authCardStyle}>Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell">
      <div style={topBarStyle}>
        <div>
          <strong>Connecté :</strong> {session.user.email}
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Déconnexion
        </button>
      </div>

      <DashboardPage history={filteredHistory} />

      <div className="grid-layout">
        <ProductForm form={form} onChange={onChange} pricing={pricing} />
        <ImageModule
          images={images}
          setImages={setImages}
          mainIndex={mainIndex}
          setMainIndex={setMainIndex}
          settings={settings}
          setSettings={setSettings}
          onDownloadImages={onDownloadImages}
        />
        <ResultPanel generated={generated} onCopy={onCopy} onSave={onSave} pricing={pricing} />
        <HistoryPanel
          history={filteredHistory}
          filters={filters}
          setFilters={setFilters}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}

const authPageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "#0f172a",
};

const authCardStyle = {
  width: "100%",
  maxWidth: 420,
  background: "#111827",
  color: "white",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #374151",
  background: "#1f2937",
  color: "white",
};

const buttonStyle = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "#7c3aed",
  color: "white",
  fontWeight: 600,
};

const switchButtonStyle = {
  marginTop: 12,
  background: "transparent",
  border: "none",
  color: "#c4b5fd",
  cursor: "pointer",
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  gap: 12,
};

const logoutButtonStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "#111827",
  color: "white",
};
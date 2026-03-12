import { useEffect, useState } from 'react';
import ProductForm from './components/ProductForm';
import ImageModule from './components/ImageModule';
import ResultPanel from './components/ResultPanel';
import HistoryPanel from './components/HistoryPanel';
import DashboardPage from './pages/DashboardPage';
import { computePricing, generateListingContent, initialForm } from './utils/helpers';

const API_URL = "https://vinted-listing-api.onrender.com/api/listings";

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({ brand: '', category: '' });
  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [generated, setGenerated] = useState(null);
  const [pricing, setPricing] = useState(computePricing(0, 0));
  const [settings, setSettings] = useState({ brightness: 104, contrast: 105, sharpness: 8 });

  const loadHistory = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

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
      status: 'draft',
      images: images.map((img, idx) => ({ ...img, isMain: idx === mainIndex }))
    };
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    await loadHistory();
  };

  const onStatusChange = async (id, status) => {
    await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    await loadHistory();
  };

  const onDownloadImages = () => {
    images.forEach((image, index) => {
      const link = document.createElement('a');
      link.href = image.enhancedUrl;
      link.download = `vinted-enhanced-${index + 1}.jpg`;
      link.click();
    });
  };

  return (
    <main className="app-shell">
      <header>
        <h1>Vinted Listing Pro</h1>
        <p>Créez des annonces pro, transparentes et prêtes à publier en moins de 3 minutes.</p>
      </header>
      <DashboardPage history={history} />
      <ProductForm form={form} onChange={onChange} />
      <ImageModule
        images={images}
        setImages={setImages}
        mainIndex={mainIndex}
        setMainIndex={setMainIndex}
        settings={settings}
        setSettings={setSettings}
      />
      <ResultPanel
        generated={generated}
        pricing={pricing}
        onCopy={onCopy}
        onSave={onSave}
        onDownloadImages={onDownloadImages}
      />
      <HistoryPanel
        history={history}
        filters={filters}
        setFilters={setFilters}
        onStatusChange={onStatusChange}
      />
    </main>
  );
}

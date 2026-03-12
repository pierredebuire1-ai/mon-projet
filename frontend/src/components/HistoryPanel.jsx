export default function HistoryPanel({ history, filters, setFilters, onStatusChange }) {
  const filtered = history.filter((item) => {
    const byBrand = !filters.brand || item.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const byCategory = !filters.category || item.category.toLowerCase().includes(filters.category.toLowerCase());
    return byBrand && byCategory;
  });

  return (
    <section className="card">
      <h2>Historique local</h2>
      <div className="filter-row">
        <input placeholder="Filtre marque" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} />
        <input placeholder="Filtre catégorie" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
      </div>
      <div className="history-grid">
        {filtered.map((item) => (
          <article key={item.id} className="history-card">
            <h3>{item.brand} - {item.itemType}</h3>
            <p>{item.category} / {item.subCategory} · Taille {item.size}</p>
            <p>Prix cible: {item.targetPrice}€</p>
            <select value={item.status || 'draft'} onChange={(e) => onStatusChange(item.id, e.target.value)}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="sold">Vendu</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  );
}

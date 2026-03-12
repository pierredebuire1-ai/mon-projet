export default function DashboardPage({ history }) {
  const draft = history.filter((item) => item.status === 'draft').length;
  const published = history.filter((item) => item.status === 'published').length;
  const sold = history.filter((item) => item.status === 'sold').length;

  return (
    <section className="dashboard-grid">
      <article className="stat-card"><span>Brouillons</span><strong>{draft}</strong></article>
      <article className="stat-card"><span>Publiées</span><strong>{published}</strong></article>
      <article className="stat-card"><span>Vendues</span><strong>{sold}</strong></article>
      <article className="stat-card"><span>Total fiches</span><strong>{history.length}</strong></article>
    </section>
  );
}

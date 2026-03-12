const fields = [
  ['brand', 'Marque'],
  ['category', 'Catégorie'],
  ['subCategory', 'Sous-catégorie'],
  ['itemType', "Type d'article"],
  ['size', 'Taille'],
  ['color', 'Couleur'],
  ['material', 'Matière'],
  ['condition', 'État'],
  ['defects', 'Défauts éventuels'],
  ['style', 'Style'],
  ['season', 'Saison'],
  ['buyPrice', "Prix d'achat"],
  ['targetPrice', 'Prix souhaité'],
  ['notes', 'Notes personnelles']
];

export default function ProductForm({ form, onChange }) {
  return (
    <section className="card">
      <h2>Nouvelle fiche produit</h2>
      <div className="form-grid">
        {fields.map(([name, label]) => (
          <label key={name}>
            {label}
            {name === 'notes' || name === 'defects' ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={onChange}
                rows={3}
                placeholder={label}
              />
            ) : (
              <input
                name={name}
                type={name.includes('Price') ? 'number' : 'text'}
                value={form[name]}
                onChange={onChange}
                placeholder={label}
              />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}

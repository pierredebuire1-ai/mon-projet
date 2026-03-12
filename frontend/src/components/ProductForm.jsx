const conditionOptions = [
  "Neuf avec étiquette",
  "Neuf sans étiquette",
  "Très bon état",
  "Bon état",
  "État satisfaisant",
];

const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "Unique"];

const colorOptions = [
  "Noir",
  "Blanc",
  "Gris",
  "Beige",
  "Marron",
  "Bleu",
  "Bleu marine",
  "Rouge",
  "Rose",
  "Vert",
  "Jaune",
  "Orange",
  "Violet",
  "Multicolore",
];

const seasonOptions = [
  "Printemps",
  "Été",
  "Automne",
  "Hiver",
  "Toutes saisons",
];

const fields = [
  ["brand", "Marque"],
  ["category", "Catégorie"],
  ["subCategory", "Sous-catégorie"],
  ["itemType", "Type d'article"],
  ["size", "Taille"],
  ["color", "Couleur"],
  ["material", "Matière"],
  ["condition", "État"],
  ["defects", "Défauts éventuels"],
  ["style", "Style"],
  ["season", "Saison"],
  ["buyPrice", "Prix d'achat"],
  ["targetPrice", "Prix souhaité"],
  ["notes", "Notes personnelles"],
];

export default function ProductForm({ form, onChange, pricing }) {
  return (
    <section className="card">
      <h2>Nouvelle fiche produit</h2>

      <div className="form-grid">
        {fields.map(([name, label]) => (
          <label key={name}>
            {label}

            {name === "notes" || name === "defects" ? (
              <textarea
                name={name}
                value={form[name] || ""}
                onChange={onChange}
                rows={3}
                placeholder={label}
              />
            ) : name === "size" ? (
              <select name={name} value={form[name] || ""} onChange={onChange}>
                <option value="">Taille</option>
                {sizeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : name === "color" ? (
              <select name={name} value={form[name] || ""} onChange={onChange}>
                <option value="">Couleur</option>
                {colorOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : name === "condition" ? (
              <select name={name} value={form[name] || ""} onChange={onChange}>
                <option value="">État</option>
                {conditionOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : name === "season" ? (
              <select name={name} value={form[name] || ""} onChange={onChange}>
                <option value="">Saison</option>
                {seasonOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : name === "buyPrice" || name === "targetPrice" ? (
              <input
                type="number"
                name={name}
                value={form[name] || ""}
                onChange={onChange}
                placeholder={label}
                min="0"
                step="0.01"
              />
            ) : (
              <input
                type="text"
                name={name}
                value={form[name] || ""}
                onChange={onChange}
                placeholder={label}
              />
            )}
          </label>
        ))}
      </div>

      {pricing ? (
        <div className="pricing-box" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Aperçu prix</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            <div className="stat-card">
              <span>Prix d'achat</span>
              <strong>{pricing.buyPrice ?? 0} €</strong>
            </div>
            <div className="stat-card">
              <span>Prix souhaité</span>
              <strong>{pricing.targetPrice ?? 0} €</strong>
            </div>
            <div className="stat-card">
              <span>Bénéfice estimé</span>
              <strong>{pricing.estimatedProfit ?? 0} €</strong>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
export default function ResultPanel({ generated, pricing, onCopy, onSave, onDownloadImages }) {
  if (!generated) return null;

  const fullAd = `${generated.title}\n\n${generated.descriptionPremium}\n\nMots-clés: ${generated.keywords.join(', ')}`;

  return (
    <section className="card">
      <h2>Résultat annonce générée</h2>
      <p><strong>Titre:</strong> {generated.title}</p>
      <p><strong>Description simple:</strong> {generated.descriptionSimple}</p>
      <p><strong>Description premium:</strong> {generated.descriptionPremium}</p>
      <p><strong>Mots-clés:</strong> {generated.keywords.join(', ')}</p>
      <ul>
        {generated.transparencyChecklist.map((item) => <li key={item}>{item}</li>)}
      </ul>

      <div className="pricing-box">
        <h3>Module prix / marge</h3>
        <p>Prix bas conseillé: {pricing.low}€</p>
        <p>Prix recommandé: {pricing.recommended}€</p>
        <p>Prix ambitieux: {pricing.ambitious}€</p>
        <p>Marge brute estimée: {pricing.grossMargin}€</p>
        <p>Bénéfice estimé: {pricing.estimatedProfit}€</p>
      </div>

      <div className="cta-row">
        <button className="button" onClick={() => onCopy(generated.title)}>Copier le titre</button>
        <button className="button" onClick={() => onCopy(generated.descriptionPremium)}>Copier la description</button>
        <button className="button" onClick={() => onCopy(fullAd)}>Copier l'annonce complète</button>
        <button className="button primary" onClick={onSave}>Sauvegarder la fiche</button>
        <button className="button" onClick={onDownloadImages}>Télécharger images améliorées</button>
      </div>
    </section>
  );
}

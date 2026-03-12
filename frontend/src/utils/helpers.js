export const initialForm = {
  brand: '',
  category: '',
  subCategory: '',
  itemType: '',
  size: '',
  color: '',
  material: '',
  condition: '',
  defects: '',
  style: '',
  season: '',
  buyPrice: '',
  targetPrice: '',
  notes: ''
};

export const generateListingContent = (form) => {
  const title = `${form.brand || 'Marque'} ${form.itemType || 'article'} ${form.color || ''} ${form.size ? `T${form.size}` : ''} - ${form.condition || 'Bon état'}`.replace(/\s+/g, ' ').trim();

  const descriptionSimple = `${form.itemType || 'Article'} ${form.brand || ''} ${form.color ? `couleur ${form.color}` : ''} en ${form.condition || 'bon état'}. ${form.defects ? `Défaut signalé: ${form.defects}.` : ''}`.trim();

  const descriptionPremium = [
    `${form.itemType || 'Pièce'} ${form.brand || ''} ${form.size ? `taille ${form.size}` : ''}, idéale pour un style ${form.style || 'polyvalent'}.`,
    form.material ? `Matière ${form.material}, agréable à porter.` : '',
    form.season ? `Parfait pour la saison ${form.season}.` : '',
    `État: ${form.condition || 'à préciser'}.`,
    form.defects ? `Transparence: ${form.defects}.` : 'Aucun défaut majeur observé.'
  ].filter(Boolean).join(' ');

  const keywords = [form.brand, form.itemType, form.category, form.color, form.style, form.size]
    .filter(Boolean)
    .map((entry) => entry.toLowerCase());

  const transparencyChecklist = [
    `Confirmer état réel: ${form.condition || 'à compléter'}`,
    form.defects ? `Mentionner les défauts: ${form.defects}` : 'Préciser s’il existe des défauts',
    'Ajouter une photo zoomée des zones sensibles',
    'Ne pas retoucher pour cacher l’usure'
  ];

  return { title, descriptionSimple, descriptionPremium, keywords, transparencyChecklist };
};

export const computePricing = (buyPrice, targetPrice) => {
  const cost = Number(buyPrice || 0);
  const desired = Number(targetPrice || 0);
  const low = Math.max(desired * 0.85, cost * 1.2);
  const recommended = Math.max(desired, cost * 1.5);
  const ambitious = Math.max(desired * 1.15, cost * 1.8);
  const grossMargin = recommended - cost;
  const estimatedProfit = grossMargin - recommended * 0.08;

  return {
    low: low.toFixed(2),
    recommended: recommended.toFixed(2),
    ambitious: ambitious.toFixed(2),
    grossMargin: grossMargin.toFixed(2),
    estimatedProfit: estimatedProfit.toFixed(2)
  };
};

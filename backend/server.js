import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'src/data/listings.json');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const readListings = async () => {
  const data = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeListings = async (listings) => {
  await fs.writeFile(DB_FILE, JSON.stringify(listings, null, 2));
};

app.get('/api/listings', async (_, res) => {
  try {
    const listings = await readListings();
    res.json(listings);
  } catch {
    res.status(500).json({ message: 'Erreur lecture historique' });
  }
});

app.post('/api/listings', async (req, res) => {
  try {
    const listings = await readListings();
    const payload = req.body;
    const listing = {
      ...payload,
      id: payload.id || `listing-${Date.now()}`,
      createdAt: payload.createdAt || new Date().toISOString()
    };
    const existingIndex = listings.findIndex((item) => item.id === listing.id);
    if (existingIndex >= 0) listings[existingIndex] = listing;
    else listings.unshift(listing);
    await writeListings(listings);
    res.status(201).json(listing);
  } catch {
    res.status(500).json({ message: 'Erreur sauvegarde fiche' });
  }
});

app.patch('/api/listings/:id/status', async (req, res) => {
  try {
    const listings = await readListings();
    const index = listings.findIndex((item) => item.id === req.params.id);
    if (index < 0) return res.status(404).json({ message: 'Fiche introuvable' });
    listings[index].status = req.body.status;
    await writeListings(listings);
    res.json(listings[index]);
  } catch {
    res.status(500).json({ message: 'Erreur mise à jour statut' });
  }
});

app.listen(PORT, () => {
  console.log(`API Vinted Listing Pro démarrée sur http://localhost:${PORT}`);
});

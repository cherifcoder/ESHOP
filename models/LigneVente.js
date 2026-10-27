const mongoose = require('mongoose');

const LigneVenteSchema = new mongoose.Schema({
  vente: { type: mongoose.Schema.Types.ObjectId, ref: 'Vente', required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  designation: { type: String, required: true },
  quantite: { type: Number, required: true, min: 1 },
  prixUnitaire: { type: Number, required: true, min: 0 },
  prixAchatUnitaire: { type: Number, required: true, min: 0 },
  montantLigne: { type: Number, required: true, min: 0 },
  margeLigne: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('LigneVente', LigneVenteSchema);

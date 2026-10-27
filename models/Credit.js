const mongoose = require('mongoose');

const CreditSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  vente: { type: mongoose.Schema.Types.ObjectId, ref: 'Vente', required: true },
  montantInitial: { type: Number, required: true, min: 0 },
  montantRestant: { type: Number, required: true, min: 0 },
  montantPaye: { type: Number, default: 0, min: 0 },
  statut: { type: String, enum: ['OUVERT', 'PARTIEL', 'SOLDE', 'ANNULE'], default: 'OUVERT' },
  dateEcheance: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Credit', CreditSchema);

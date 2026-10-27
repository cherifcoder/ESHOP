const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  telephone: { type: String, required: true, trim: true, unique: true },
  email: { type: String, trim: true, lowercase: true },
  adresse: { type: String, trim: true },
  ville: { type: String, trim: true },
  soldeCredit: { type: Number, default: 0, min: 0 },
  plafondCredit: { type: Number, default: 0, min: 0 },
  autoriserCredit: { type: Boolean, default: true },
  actif: { type: Boolean, default: true },
  notes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ClientSchema.virtual('nomComplet').get(function() {
  return this.prenom + ' ' + this.nom;
});

ClientSchema.set('toJSON', { virtuals: true });
ClientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Client', ClientSchema);

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, trim: true },
  designation: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  categorie: { type: String, trim: true },
  marque: { type: String, trim: true },
  prixAchat: { type: Number, required: true, min: 0 },
  prixVente: { type: Number, required: true, min: 0 },
  stockActuel: { type: Number, required: true, min: 0, default: 0 },
  stockMin: { type: Number, min: 0, default: 5 },
  unite: { type: String, default: 'Unité' },
  images: [{ type: String }],
  actif: { type: Boolean, default: true },
  fournisseur: { type: String, trim: true },
  emplacement: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ArticleSchema.virtual('marge').get(function() {
  return this.prixVente - this.prixAchat;
});

ArticleSchema.virtual('alerteStock').get(function() {
  return this.stockActuel <= this.stockMin;
});

ArticleSchema.set('toJSON', { virtuals: true });
ArticleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Article', ArticleSchema);

const express = require('express');
const router = express.Router();
const Vente = require('../models/Vente');
const LigneVente = require('../models/LigneVente');
const Article = require('../models/Article');
const Client = require('../models/Client');
const Credit = require('../models/Credit');
const MouvementStock = require('../models/MouvementStock');
const { isAuthenticated } = require('../middlewares/auth');
const { logAction } = require('../middlewares/logger');
const { generateInvoiceNumber } = require('../utils/helpers');
const { genererFacture } = require('../utils/facture');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const ventes = await Vente.find().sort({ dateVente: -1 }).populate('client').populate('vendeur');
    res.render('ventes/index', { title: 'Historique des Ventes', ventes, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

router.get('/nouvelle', isAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find({ actif: true, stockActuel: { $gt: 0 } });
    const clients = await Client.find({ actif: true });
    res.render('ventes/nouvelle', { title: 'Nouvelle Vente', articles, clients, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

router.post('/nouvelle', isAuthenticated, logAction('VENTES', 'NOUVELLE_VENTE'), async (req, res) => {
  try {
    const { clientId, typeVente, modePaiement, lignes, remise } = req.body;
    
    if (!lignes || lignes.length === 0) {
      return res.redirect('/ventes/nouvelle');
    }
    
    if (typeVente === 'CREDIT' && clientId) {
      const client = await Client.findById(clientId);
      if (client && client.autoriserCredit === false) {
        return res.redirect('/ventes/nouvelle');
      }
      let sousTotal = 0;
      for (let l of lignes) {
        const article = await Article.findById(l.articleId);
        if (article) sousTotal += article.prixVente * l.quantite;
      }
      const remiseMontant = parseFloat(remise) || 0;
      const total = sousTotal - remiseMontant;
      if (client && client.plafondCredit && (client.soldeCredit + total) > client.plafondCredit) {
        return res.redirect('/ventes/nouvelle');
      }
    }
    
    let sousTotal = 0;
    const lignesData = [];
    
    for (let l of lignes) {
      const article = await Article.findById(l.articleId);
      if (!article || article.stockActuel < l.quantite) {
        return res.redirect('/ventes/nouvelle');
      }
      
      const montantLigne = article.prixVente * l.quantite;
      const margeLigne = (article.prixVente - article.prixAchat) * l.quantite;
      sousTotal += montantLigne;
      
      lignesData.push({
        article: article._id,
        designation: article.designation,
        quantite: parseInt(l.quantite),
        prixUnitaire: article.prixVente,
        prixAchatUnitaire: article.prixAchat,
        montantLigne,
        margeLigne
      });
    }
    
    const remiseMontant = parseFloat(remise) || 0;
    const total = sousTotal - remiseMontant;
    const numeroFacture = generateInvoiceNumber();
    
    const vente = await Vente.create({
      numeroFacture,
      client: clientId || null,
      vendeur: req.session.user.id,
      typeVente,
      sousTotal,
      remise: remiseMontant,
      total,
      montantPaye: typeVente === 'COMPTANT' ? total : 0,
      resteAPayer: typeVente === 'CREDIT' ? total : 0,
      modePaiement,
      statut: 'VALIDEE'
    });
    
    for (let ld of lignesData) {
      const ligneVente = await LigneVente.create({
        vente: vente._id,
        ...ld
      });
      vente.lignes.push(ligneVente._id);
      
      const article = await Article.findById(ld.article);
      const stockAvant = article.stockActuel;
      article.stockActuel -= ld.quantite;
      await article.save();
      
      await MouvementStock.create({
        article: article._id,
        typeMouvement: 'SORTIE',
        quantite: ld.quantite,
        stockAvant,
        stockApres: article.stockActuel,
        motif: 'Vente',
        reference: numeroFacture,
        effectuePar: req.session.user.id,
        vente: vente._id
      });
    }
    
    await vente.save();
    
    if (typeVente === 'CREDIT' && clientId) {
      const client = await Client.findById(clientId);
      await Credit.create({
        client: clientId,
        vente: vente._id,
        montantInitial: total,
        montantRestant: total,
        montantPaye: 0,
        statut: 'OUVERT'
      });
      if (client) {
        client.soldeCredit += total;
        await client.save();
      }
    }
    
    res.redirect(`/ventes/facture/${vente._id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/ventes/nouvelle');
  }
});

router.get('/facture/:id', isAuthenticated, async (req, res) => {
  try {
    const vente = await Vente.findById(req.params.id).populate('client').populate('vendeur');
    const lignes = await LigneVente.find({ vente: vente._id });
    res.render('ventes/facture', { title: 'Facture', vente, lignes, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/ventes');
  }
});

router.get('/facture/pdf/:id', isAuthenticated, async (req, res) => {
  try {
    const vente = await Vente.findById(req.params.id).populate('client').populate('vendeur');
    const lignes = await LigneVente.find({ vente: vente._id });
    const result = await genererFacture(vente, vente.client, lignes, vente.vendeur);
    res.download(result.filepath, result.filename);
  } catch (err) {
    console.error(err);
    res.redirect('/ventes');
  }
});

module.exports = router;

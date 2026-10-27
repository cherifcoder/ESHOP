require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    const exists = await User.findOne({ username: 'admin' });
    if (exists) {
      console.log('⚠️  Admin déjà existant');
      process.exit();
    }
    await User.create({
      nom: 'SUPER',
      prenom: 'ADMIN',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      email: 'admin@boutique.local',
      actif: true
    });
    console.log('✅ Admin créé avec succès!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
};

seedAdmin();

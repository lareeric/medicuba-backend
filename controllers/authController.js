const pool    = require('../config/db');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const inscription = async (req, res) => {
  const { prenom, email, mot_de_passe, annee_etudes } = req.body;

  try {
    const existeDeja = await pool.query(
      'SELECT id FROM utilisateurs WHERE email = $1', [email]
    );
    if (existeDeja.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    const result = await pool.query(
      `INSERT INTO utilisateurs (prenom, email, mot_de_passe_hash, annee_etudes)
       VALUES ($1, $2, $3, $4) RETURNING id, prenom, email, annee_etudes`,
      [prenom, email, hash, annee_etudes]
    );

    const utilisateur = result.rows[0];
    const token = jwt.sign(
      { id: utilisateur.id, prenom: utilisateur.prenom },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, utilisateur });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const connexion = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1', [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const utilisateur = result.rows[0];
    const valide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe_hash);

    if (!valide) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: utilisateur.id, prenom: utilisateur.prenom },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      utilisateur: {
        id:            utilisateur.id,
        prenom:        utilisateur.prenom,
        email:         utilisateur.email,
        annee_etudes:  utilisateur.annee_etudes
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { inscription, connexion };
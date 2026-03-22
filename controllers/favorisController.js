const pool = require('../config/db');

const getFavoris = async (req, res) => {
  const utilisateur_id = req.utilisateur.id;
  try {
    const result = await pool.query(
      `SELECT f.*, c.titre_es, c.titre_fr, c.matiere, c.duree_minutes, c.annee
       FROM favoris f
       JOIN cours c ON f.cours_id = c.id
       WHERE f.utilisateur_id = $1
       ORDER BY f.ajoute_le DESC`,
      [utilisateur_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const ajouterFavori = async (req, res) => {
  const utilisateur_id = req.utilisateur.id;
  const { cours_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO favoris (utilisateur_id, cours_id)
       VALUES ($1, $2)
       ON CONFLICT (utilisateur_id, cours_id) DO NOTHING
       RETURNING *`,
      [utilisateur_id, cours_id]
    );
    res.status(201).json(result.rows[0] || { message: 'Déjà en favori' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const supprimerFavori = async (req, res) => {
  const { id } = req.params;
  const utilisateur_id = req.utilisateur.id;
  try {
    await pool.query(
      'DELETE FROM favoris WHERE id = $1 AND utilisateur_id = $2',
      [id, utilisateur_id]
    );
    res.json({ message: 'Favori supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { getFavoris, ajouterFavori, supprimerFavori };
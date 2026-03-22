const pool = require('../config/db');

const getNotes = async (req, res) => {
  const utilisateur_id = req.utilisateur.id;
  try {
    const result = await pool.query(
      `SELECT n.*, c.titre_es, c.titre_fr, c.matiere
       FROM notes n
       JOIN cours c ON n.cours_id = c.id
       WHERE n.utilisateur_id = $1
       ORDER BY n.cree_le DESC`,
      [utilisateur_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const ajouterNote = async (req, res) => {
  const utilisateur_id = req.utilisateur.id;
  const { cours_id, contenu } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO notes (utilisateur_id, cours_id, contenu)
       VALUES ($1, $2, $3) RETURNING *`,
      [utilisateur_id, cours_id, contenu]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const supprimerNote = async (req, res) => {
  const { id } = req.params;
  const utilisateur_id = req.utilisateur.id;
  try {
    await pool.query(
      'DELETE FROM notes WHERE id = $1 AND utilisateur_id = $2',
      [id, utilisateur_id]
    );
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { getNotes, ajouterNote, supprimerNote };
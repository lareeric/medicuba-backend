const pool = require('../config/db');

const getGlossaire = async (req, res) => {
  const { recherche, matiere, annee } = req.query;

  try {
    let query = 'SELECT * FROM glossaire WHERE 1=1';
    const params = [];

    if (recherche) {
      params.push(`%${recherche}%`);
      query += ` AND (terme_es ILIKE $${params.length} OR terme_fr ILIKE $${params.length} OR terme_en ILIKE $${params.length})`;
    }

    if (matiere) {
      params.push(matiere);
      query += ` AND matiere = $${params.length}`;
    }

    if (annee) {
      params.push(annee);
      query += ` AND annee = $${params.length}`;
    }

    query += ' ORDER BY terme_es ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const getTermeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM glossaire WHERE id = $1', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Terme introuvable' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { getGlossaire, getTermeById };
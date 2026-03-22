const pool = require('../config/db');

const getCours = async (req, res) => {
  const { annee, matiere } = req.query;

  try {
    let query = 'SELECT * FROM cours WHERE 1=1';
    const params = [];

    if (annee) {
      params.push(annee);
      query += ` AND annee = $${params.length}`;
    }

    if (matiere) {
      params.push(matiere);
      query += ` AND matiere = $${params.length}`;
    }

    query += ' ORDER BY matiere, titre_es';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const getCoursById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM cours WHERE id = $1', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { getCours, getCoursById };
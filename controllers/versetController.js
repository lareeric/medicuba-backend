const pool = require('../config/db');

const getVersetDuJour = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM versets WHERE date_affichage = CURRENT_DATE'
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aucun verset pour aujourd\'hui' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { getVersetDuJour };
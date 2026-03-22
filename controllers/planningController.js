const pool = require('../config/db');

const getPlanning = async (req, res) => {
  const utilisateur_id = req.utilisateur.id;
  try {
    const result = await pool.query(
      `SELECT p.*, c.titre_es, c.titre_fr, c.matiere, c.duree_minutes
       FROM planning p
       JOIN cours c ON p.cours_id = c.id
       WHERE p.utilisateur_id = $1
       AND p.date_prevue >= CURRENT_DATE
       ORDER BY p.date_prevue ASC, p.heure_debut ASC`,
      [utilisateur_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const genererPlanning = async (req, res) => {
  const utilisateur_id = req.utilisateur.id;
  const { jours = 7 } = req.body;

  try {
    // Récupère l'année de l'utilisateur
    const userRes = await pool.query(
      'SELECT annee_etudes FROM utilisateurs WHERE id = $1',
      [utilisateur_id]
    );
    const annee = userRes.rows[0].annee_etudes;

    // Récupère tous les cours de l'année
    const coursRes = await pool.query(
      'SELECT * FROM cours WHERE annee = $1 ORDER BY matiere',
      [annee]
    );
    const cours = coursRes.rows;

    if (cours.length === 0) {
      return res.status(404).json({ message: 'Aucun cours disponible' });
    }

    // Supprime l'ancien planning futur
    await pool.query(
      `DELETE FROM planning
       WHERE utilisateur_id = $1 AND date_prevue >= CURRENT_DATE`,
      [utilisateur_id]
    );

    // Génère le planning sur X jours
    const heures = ['08:00', '10:00', '14:00', '16:00'];
    const insertions = [];

    for (let jour = 0; jour < jours; jour++) {
      const date = new Date();
      date.setDate(date.getDate() + jour);
      const dateStr = date.toISOString().split('T')[0];

      // 2 cours par jour max
      const coursJour = [
        cours[( jour * 2      ) % cours.length],
        cours[( jour * 2 + 1  ) % cours.length],
      ];

      for (let i = 0; i < coursJour.length; i++) {
        insertions.push(pool.query(
          `INSERT INTO planning (utilisateur_id, cours_id, date_prevue, heure_debut, heure_fin)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            utilisateur_id,
            coursJour[i].id,
            dateStr,
            heures[i * 2],
            heures[i * 2 + 1],
          ]
        ));
      }
    }

    await Promise.all(insertions);

    // Retourne le nouveau planning
    const planningRes = await pool.query(
      `SELECT p.*, c.titre_es, c.titre_fr, c.matiere, c.duree_minutes
       FROM planning p
       JOIN cours c ON p.cours_id = c.id
       WHERE p.utilisateur_id = $1
       AND p.date_prevue >= CURRENT_DATE
       ORDER BY p.date_prevue ASC, p.heure_debut ASC`,
      [utilisateur_id]
    );

    res.status(201).json(planningRes.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const marquerEffectue = async (req, res) => {
  const { id } = req.params;
  const utilisateur_id = req.utilisateur.id;
  try {
    await pool.query(
      `UPDATE planning SET effectue = TRUE
       WHERE id = $1 AND utilisateur_id = $2`,
      [id, utilisateur_id]
    );
    res.json({ message: 'Marqué comme effectué' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const annulerEffectue = async (req, res) => {
  const { id } = req.params;
  const utilisateur_id = req.utilisateur.id;
  try {
    await pool.query(
      `UPDATE planning SET effectue = FALSE
       WHERE id = $1 AND utilisateur_id = $2`,
      [id, utilisateur_id]
    );
    res.json({ message: 'Marqué comme non effectué' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { getPlanning, genererPlanning, marquerEffectue, annulerEffectue };
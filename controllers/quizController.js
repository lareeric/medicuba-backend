const pool = require('../config/db');

const getQuizByCours = async (req, res) => {
  const { cours_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM quiz WHERE cours_id = $1 ORDER BY RANDOM()',
      [cours_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

const soumettrReponse = async (req, res) => {
  const { quiz_id, reponse } = req.body;
  const utilisateur_id = req.utilisateur.id;

  try {
    const quizRes = await pool.query(
      'SELECT * FROM quiz WHERE id = $1', [quiz_id]
    );

    if (quizRes.rows.length === 0) {
      return res.status(404).json({ message: 'Quiz introuvable' });
    }

    const quiz    = quizRes.rows[0];
    const reussi  = reponse === quiz.bonne_reponse;
    const score   = reussi ? 100 : 0;

    await pool.query(
      `INSERT INTO resultats_quiz (utilisateur_id, quiz_id, reussi, score)
       VALUES ($1, $2, $3, $4)`,
      [utilisateur_id, quiz_id, reussi, score]
    );

    res.json({
      reussi,
      bonne_reponse:  quiz.bonne_reponse,
      explication_fr: quiz.explication_fr,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

module.exports = { getQuizByCours, soumettrReponse };
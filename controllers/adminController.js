const pool = require('../config/db');
const getStats = async (req, res) => {
try {
const [users, cours, quiz, notes, favoris, planning] = await Promise.all([
pool.query('SELECT COUNT(*) FROM utilisateurs'),
pool.query('SELECT COUNT(*) FROM cours'),
pool.query('SELECT COUNT(*) FROM resultats_quiz'),
pool.query('SELECT COUNT(*) FROM notes'),
pool.query('SELECT COUNT(*) FROM favoris'),
pool.query('SELECT COUNT(*) FROM planning WHERE effectue = true'),
]);
res.json({
utilisateurs: parseInt(users.rows[0].count),
cours: parseInt(cours.rows[0].count),
quiz_passes: parseInt(quiz.rows[0].count),
notes: parseInt(notes.rows[0].count),
favoris: parseInt(favoris.rows[0].count),
taches_faites: parseInt(planning.rows[0].count),
});
} catch (err) {
res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
}
};
const getUtilisateurs = async (req, res) => {
try {
const result = await pool.query(
'SELECT id, prenom, email, annee_etudes, is_admin, cree_le FROM utilisateurs ORDER BY cree_le DESC'
);
res.json(result.rows);
} catch (err) {
res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
}
};
const supprimerUtilisateur = async (req, res) => {
const { id } = req.params;
try {
await pool.query('DELETE FROM utilisateurs WHERE id = $1', [id]);
res.json({ message: 'Utilisateur supprime' });
} catch (err) {
res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
}
};
const getVersets = async (req, res) => {
try {
const result = await pool.query('SELECT * FROM versets ORDER BY date_affichage ASC');
res.json(result.rows);
} catch (err) {
res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
}
};
const ajouterVerset = async (req, res) => {
const { reference, texte_es, texte_fr, date_affichage } = req.body;
try {
const result = await pool.query(
'INSERT INTO versets (reference, texte_es, texte_fr, date_affichage) VALUES ($1,$2,$3,$4) RETURNING *',
[reference, texte_es, texte_fr, date_affichage]
);
res.status(201).json(result.rows[0]);
} catch (err) {
res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
}
};
const modifierVerset = async (req, res) => {
const { id } = req.params;
const { reference, texte_es, texte_fr, date_affichage } = req.body;
try {
await pool.query(
'UPDATE versets SET reference=$1, texte_es=$2, texte_fr=$3, date_affichage=$4 WHERE id=$5',
[reference, texte_es, texte_fr, date_affichage, id]
);
res.json({ message: 'Verset modifie' });
} catch (err) {
res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
}
};
const supprimerVerset = async (req, res) => {
const { id } = req.params;
try {
await pool.query('DELETE FROM versets WHERE id = $1', [id]);
res.json({ message: 'Verset supprime' });
} catch (err) {
res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
}
};
module.exports = {
getStats, getUtilisateurs, supprimerUtilisateur,
getVersets, ajouterVerset, modifierVerset, supprimerVerset
};
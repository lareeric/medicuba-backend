const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
getStats, getUtilisateurs, supprimerUtilisateur,
getVersets, ajouterVerset, modifierVerset, supprimerVerset
} = require('../controllers/adminController');
router.get('/stats', auth, admin, getStats);
router.get('/utilisateurs', auth, admin, getUtilisateurs);
router.delete('/utilisateurs/:id', auth, admin, supprimerUtilisateur);
router.get('/versets', auth, admin, getVersets);
router.post('/versets', auth, admin, ajouterVerset);
router.put('/versets/:id', auth, admin, modifierVerset);
router.delete('/versets/:id', auth, admin, supprimerVerset);
module.exports = router;
const express = require('express');
const router  = express.Router();
const { getFavoris, ajouterFavori, supprimerFavori } = require('../controllers/favorisController');
const auth = require('../middleware/auth');

router.get('/',        auth, getFavoris);
router.post('/',       auth, ajouterFavori);
router.delete('/:id',  auth, supprimerFavori);

module.exports = router;
const express = require('express');
const router  = express.Router();
const { getNotes, ajouterNote, supprimerNote } = require('../controllers/notesController');
const auth = require('../middleware/auth');

router.get('/',        auth, getNotes);
router.post('/',       auth, ajouterNote);
router.delete('/:id',  auth, supprimerNote);

module.exports = router;
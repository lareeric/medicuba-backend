const express = require('express');
const router  = express.Router();
const { getGlossaire, getTermeById } = require('../controllers/glossaireController');
const auth = require('../middleware/auth');

router.get('/',    auth, getGlossaire);
router.get('/:id', auth, getTermeById);

module.exports = router;
const express = require('express');
const router  = express.Router();
const { getQuizByCours, soumettrReponse } = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.get('/cours/:cours_id', auth, getQuizByCours);
router.post('/soumettre',      auth, soumettrReponse);

module.exports = router;
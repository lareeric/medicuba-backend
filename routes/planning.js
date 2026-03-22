const express = require('express');
const router  = express.Router();
const { getPlanning, genererPlanning, marquerEffectue, annulerEffectue } = require('../controllers/planningController');
const auth = require('../middleware/auth');

router.get('/',               auth, getPlanning);
router.post('/generer',       auth, genererPlanning);
router.patch('/:id/effectue', auth, marquerEffectue);
router.patch('/:id/annuler',  auth, annulerEffectue);

module.exports = router;
const express = require('express');
const router  = express.Router();
const { getVersetDuJour } = require('../controllers/versetController');
const auth = require('../middleware/auth');

router.get('/aujourd-hui', auth, getVersetDuJour);

module.exports = router;
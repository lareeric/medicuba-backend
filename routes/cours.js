const express = require('express');
const router  = express.Router();
const { getCours, getCoursById } = require('../controllers/coursController');
const auth = require('../middleware/auth');

router.get('/',    auth, getCours);
router.get('/:id', auth, getCoursById);

module.exports = router;
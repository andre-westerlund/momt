var express = require('express');
var router = express.Router();
var NumberController = require('../controllers/NumberController.js');
var auth = require('../middleware/auth');
/*
 * GET
 */
router.get('/', auth.isAuthenticated, NumberController.list);

/*
 * GET
 */
router.get('/:number', NumberController.show);

/*
 * POST
 */
router.post('/',auth.isAuthenticated, NumberController.create);

/*
 * DELETE
 */
router.delete('/:id',auth.isAuthenticated, NumberController.remove);

module.exports = router;

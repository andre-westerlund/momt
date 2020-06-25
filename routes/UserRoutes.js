var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');
var passport = require("passport");
var auth = require('../middleware/auth');
/*
 * GET
 */
router.get('/',auth.isAdmin, UserController.list);

/*
 * GET
 */
router.get('/:id',auth.isAdmin, UserController.show);

/*
 * POST
 */
router.post('/',auth.isAdmin, UserController.create);

/*
 * PUT
 */
router.put('/:id',auth.isAdmin, UserController.update);

/*
 * DELETE
 */
router.delete('/:id',auth.isAdmin, UserController.remove);

/*
 * LOGIN
 */
router.post('/auth/login',
    passport.authenticate('local', { failureRedirect: "/login", successRedirect: "/"}),
    UserController.login);

/*
 * LOGOUT
 */
router.post('/auth/logout', auth.isAuthenticated, UserController.logout);

module.exports = router;

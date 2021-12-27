const express = require('express');
const router = express.Router();
const passport = require('passport');
const
    {
        _feRegister,
        _feLogin,
        _feLogout
    } = require('../../controllers/users');
const
    {
        validateUser,
    } = require('../utils/middleware');

router.get('/register', _feRegister);
router.post('/register', validateUser, _feRegister);
router.get('/login', _feLogin);
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), _feLogin);
router.get('/logout', _feLogout);

module.exports = router;
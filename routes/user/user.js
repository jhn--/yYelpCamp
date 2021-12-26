const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const User = require('../../models/user');

// joi
const userSchema = require('../../joiSchemas/joi_user');
// joi

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(element => element["message"]).join(',');
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const _feRegister = catchAsync( async (req, res) => {
    switch (req.method) {
        case "POST":
            // console.log(req.body.user);
            const { email, username, password } = req.body.user;
            res.send(`${email} ${username} ${password}`);
            break;
        default:
            res.render('register.ejs');
    }
})

router.get('/register', _feRegister);
router.post('/register', validateUser, _feRegister);

module.exports = router;
const express = require('express');
const router = express.Router();
const
    {
        isLoggedIn,
        isAuthor,
        validateCampground
    } = require('../utils/middleware');
const
    {
        _feListCampgrounds,
        _feShowCampground,
        _feNewCampground,
        _feDeleteCampground,
        _feEditCampground 
    } = require('../../controllers/campgrounds');


router.get('/', _feListCampgrounds)

router.route('/new') // fancy way
    .get(isLoggedIn, _feNewCampground)
    .post(isLoggedIn, validateCampground, _feNewCampground)
// router.get('/new', isLoggedIn, _feNewCampground)
// router.post('/new', isLoggedIn, validateCampground, _feNewCampground)

router.route('/:id')
    .get(_feShowCampground)
    .delete(isLoggedIn, isAuthor, _feDeleteCampground)
// router.get('/:id', _feShowCampground)
// router.delete('/:id', isLoggedIn, isAuthor, _feDeleteCampground)

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, _feEditCampground)
    .put(isLoggedIn, isAuthor, validateCampground, _feEditCampground)
// router.get('/:id/edit', isLoggedIn, isAuthor, _feEditCampground)
// router.put('/:id/edit', isLoggedIn, isAuthor, validateCampground, _feEditCampground)

module.exports = router;
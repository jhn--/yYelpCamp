const _feIndex = (req, res) => {
     res.render('index.ejs')
}

const _fe404 = (req, res) => {
    res.status(404).render('404.ejs')
}

const _feRoutes = {
    _feIndex: _feIndex,
    _fe404:_fe404
}

module.exports = _feRoutes;
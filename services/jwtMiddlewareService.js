const jwt = require('jsonwebtoken');

const jwtMiddlewareService = (req, res, next) => {
    try {

        let token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).send({auth: false, message: 'No token provided.'});
        }
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
            }
            req.email = decoded.email;
            next();
        });

    } catch (err) {
        res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
    }
}

module.exports = jwtMiddlewareService;

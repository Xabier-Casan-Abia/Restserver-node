const jwt = require('jsonwebtoken');


// =====================
// Token Verification
// =====================

let tokenVerification = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

};

// =====================
// Token Verification
// =====================

let admin_roleVerification = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Unauthorised accion'
            }
        })
    }

};

module.exports = { tokenVerification, admin_roleVerification }
require("../config/firebase-config.js")
const { getAuth } =  require("firebase-admin/auth")

class Middleware {
    async decodeToken(req, res, next) {
        const token = req.headers.authorization.split(" ")[1];

        getAuth().verifyIdToken(token).then((decoded) => {
            console.log(decoded);
            if (decoded) {
                return next();
            }
        }).catch((error) => {
            return res.json({message: "un authorize ", error})
        });
    }
}

module.exports = {middleware: new Middleware()};
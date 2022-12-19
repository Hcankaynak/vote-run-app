const admin = require('firebase-admin/app')
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.cert(serviceAccount)
});
module.exports = admin
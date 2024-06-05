const key_db = require('../config/cc-c241-ps246-firebase-adminsdk-jl7du-a56aaeb9d0.json')
const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert(key_db)
})

const db = admin.firestore();
module.exports = db
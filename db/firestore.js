const key_db = require('../config/cc-c241-ps246-firebase-adminsdk-jl7du-a56aaeb9d0.json');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

admin.initializeApp({
    credential: admin.credential.cert(key_db),
    storageBucket: 'cc-c241-ps246.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Fungsi untuk menguji koneksi Firestore dengan menulis dan membaca data
const testConnection = async () => {
    try {
        // Menulis data ke koleksi 'testCollection'
        await db.collection('testCollection').doc('testDocument').set({
            testField: 'testValue'
        });
        console.log('Data written successfully');

        // Membaca data dari koleksi 'testCollection'
        const doc = await db.collection('testCollection').doc('testDocument').get();
        if (doc.exists) {
            console.log('Firestore connected and data read successfully:', doc.data());
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error connecting to Firestore:', error);
    }
};

// Panggil fungsi pengujian koneksi
testConnection();

module.exports = { db, bucket };


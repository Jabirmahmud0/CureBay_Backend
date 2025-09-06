"use strict";
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();
try {
    const serviceAccount = require(path.resolve(__dirname, '../config/firebase-service-account.json'));
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://curebay-21207-default-rtdb.firebaseio.com'
        });
        console.log('Firebase Admin initialized with service account');
    }
}
catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    // Fallback for development
    if (!admin.apps.length) {
        admin.initializeApp();
    }
}
module.exports = admin;

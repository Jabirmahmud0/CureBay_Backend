const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

try {
  // In development mode, we can initialize Firebase Admin without service account
  if (isDevelopment) {
    console.log('Running in development mode - initializing Firebase Admin without service account');
    if (!admin.apps.length) {
      console.log('Initializing Firebase Admin with default app (development mode)...');
      const app = admin.initializeApp({
        projectId: 'curebay-21207'
      });
      app.isDevelopmentMode = true;
      console.log('Firebase Admin initialized in development mode');
      console.log('Firebase app name:', app.name);
    }
  } else {
    // In production, we need the service account
    // Determine the correct path for the service account file
    let serviceAccountPath;
    
    // When running from dist, the service account file is still in src/config
    // We need to find the correct path relative to where we're running from
    const isRunningFromDist = __dirname.includes(path.join('dist', 'utils'));
    
    if (isRunningFromDist) {
      // Running from dist/utils, need to go up 3 levels to project root, then to backend/src/config
      serviceAccountPath = path.resolve(__dirname, '../../../backend/src/config/firebase-service-account.json');
    } else {
      // Running from src/utils, need to go up 1 level to src, then to config
      serviceAccountPath = path.resolve(__dirname, '../config/firebase-service-account.json');
    }
    
    console.log('Attempting to load Firebase service account from:', serviceAccountPath);
    console.log('Running from dist:', isRunningFromDist);
    console.log('Service account path exists:', fs.existsSync(serviceAccountPath));
    
    // Check if file exists
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
    }
    
    const serviceAccount = require(serviceAccountPath);
    console.log('Firebase service account loaded successfully');
    console.log('Service account project ID:', serviceAccount.project_id);
    console.log('Service account client email:', serviceAccount.client_email);
    
    if (!admin.apps.length) {
      console.log('Initializing Firebase Admin with service account...');
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://curebay-21207-default-rtdb.firebaseio.com'
      });
      console.log('Firebase Admin initialized with service account');
      console.log('Firebase app name:', app.name);
      console.log('Firebase app options:', app.options && app.options.credential ? 'Credential present' : 'No credential');
      
      // Test if the app is properly initialized
      try {
        const auth = admin.auth();
        console.log('Firebase Auth instance created successfully');
      } catch (authError) {
        console.error('Failed to create Firebase Auth instance:', authError);
      }
    } else {
      console.log('Firebase Admin already initialized');
      console.log('Number of apps:', admin.apps.length);
      console.log('Default app name:', admin.app().name);
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  console.error('Error stack:', error.stack);
  // Fallback for development
  if (!admin.apps.length) {
    console.log('Initializing Firebase Admin with default app (fallback)...');
    const app = admin.initializeApp({
      projectId: 'curebay-21207'
    });
    app.isDevelopmentMode = true;
    console.log('Firebase Admin initialized with fallback');
    console.log('Firebase app name:', app.name);
  }
}

// Add a helper function to check if we're in development mode
admin.isDevelopmentMode = () => {
  return admin.apps.length > 0 && admin.app().isDevelopmentMode;
};

module.exports = admin;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteDriver = functions.https.onCall(async (data, context) => {
    const driverId = data.driverId;

    // Restrict to managers only – you can customize
    // For simplicity, we allow any authenticated user.
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in.');
    }

    // Optional: check that the caller is the manager by email
    // const callerEmail = context.auth.token.email;
    // if (!managerEmails.includes(callerEmail)) throw ...

    try {
        await admin.auth().deleteUser(driverId);
        await admin.firestore().doc(`drivers/${driverId}`).delete();
        await admin.firestore().doc(`locations/${driverId}`).delete();
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

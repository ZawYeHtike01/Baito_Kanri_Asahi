import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const deleteStudentAccount = functions.https.onCall(async (data, context) => {
  // Only admin can delete
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Not an admin');
  }

  const uid = data.uid;

  try {
    // Delete from Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Delete Firestore documents
    await admin.firestore().doc(`users/${uid}`).delete();
    await admin.firestore().doc(`shifts/${uid}`).delete();
    await admin.firestore().doc(`worksname/${uid}`).delete();

    return { success: true };
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError('internal', 'Failed to delete user');
  }
});

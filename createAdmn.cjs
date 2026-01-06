const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const uid = "5hZIMmFcxtOQ72wV2w3FtyeCz903";

async function makeAdmin() {
  await admin.auth().setCustomUserClaims(uid, {
    admin: true,
  });

  console.log("✅ Admin created");
  process.exit(0);
}

makeAdmin();

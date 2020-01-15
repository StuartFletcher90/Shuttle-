const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");
const { db } = require("./util/admin");

const {
  getAllShuttles,
  postOneShuttle,
  getShuttle,
  commentOnShuttle,
  likeShuttle,
  unlikeShuttle,
  deleteShuttle
} = require("./handlers/shuttles");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");

//? Shuttle Routes <-===->
app.get("/shuttle", getAllShuttles);
app.post("/shuttle", FBAuth, postOneShuttle);
app.get("/shuttle/:shuttleId", getShuttle);
app.get("/shuttle/:shuttleId/like", FBAuth, likeShuttle);
app.get("/shuttle/:shuttleId/unlike", FBAuth, unlikeShuttle);
app.delete("/shuttle/:shuttleId", FBAuth, deleteShuttle);
app.post("/shuttle/:shuttleId/comment", FBAuth, commentOnShuttle);

//? Users Routes <-===->
app.post("/signup", signup);
app.post("/login", login);
app.post("/users/image", FBAuth, uploadImage);
app.post("/users", FBAuth, addUserDetails);
app.get("/users", FBAuth, getAuthenticatedUser);
app.get("/users/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.region("us-central1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/shuttle/${snapshot.data().shuttleId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            shuttleId: doc.id
          });
        }
      })
      .catch(err => console.error(err));
  });
exports.deleteNotificationOnUnlike = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    db.doc(`/shuttle/${snapshot.data().shuttleId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            shuttleId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document(`/users/{userId}`)
  .onUpdate(change => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      let batch = db.batch();
      return db
        .collection("shuttle")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const shuttle = db.doc(`/shuttle/${doc.id}`);
            batch.updaye(shuttle, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onShuttleDelete = functions
  .region("us-central1")
  .firestore.document("/shuttle/{shuttleId}")
  .onDelete((snapshot, context) => {
    const shuttleId = context.params.shuttleId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("shuttleId", "==", shuttleId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("shuttleId", "==", shuttleId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("shuttleId", "==", shuttleId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => console.error(err));
  });

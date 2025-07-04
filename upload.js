const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

auth.onAuthStateChanged(user => {
  if (!user) window.location.href = "login.html";
});

async function uploadVideo() {
  const videoFile = document.getElementById("videoFile").files[0];
  const thumbnailFile = document.getElementById("thumbnailFile").files[0];
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!videoFile || !thumbnailFile || !title) {
    alert("يرجى تعبئة جميع الحقول");
    return;
  }

  const user = firebase.auth().currentUser;
  const timestamp = Date.now();

  try {
    // رفع الفيديو
    const videoRef = storage.ref(`videos/${timestamp}_${videoFile.name}`);
    const videoSnap = await videoRef.put(videoFile);
    const videoURL = await videoSnap.ref.getDownloadURL();

    // رفع الصورة المصغرة
    const thumbRef = storage.ref(`thumbnails/${timestamp}_${thumbnailFile.name}`);
    const thumbSnap = await thumbRef.put(thumbnailFile);
    const thumbnailURL = await thumbSnap.ref.getDownloadURL();

    // حفظ البيانات في Firestore
    await db.collection("videos").add({
      title,
      description,
      videoURL,
      thumbnailURL,
      uploader: user.email || "مستخدم مجهول",
      views: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("تم رفع الفيديو بنجاح!");
    window.location.href = "index.html";
  } catch (err) {
    console.error("خطأ في الرفع:", err);
    alert("حدث خطأ أثناء رفع الفيديو: " + err.message);
  }
}

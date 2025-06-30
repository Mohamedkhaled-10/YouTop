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
  const progressBar = document.getElementById("uploadProgress");

  if (!videoFile || !thumbnailFile || !title) {
    alert("يرجى تعبئة جميع الحقول");
    return;
  }

  const user = firebase.auth().currentUser;
  const videoId = Date.now();

  try {
    progressBar.style.display = "block";
    progressBar.value = 0;

    // رفع الفيديو مع متابعة النسبة
    const videoRef = storage.ref(`videos/${videoId}_${videoFile.name}`);
    const videoUploadTask = videoRef.put(videoFile);

    const videoURL = await new Promise((resolve, reject) => {
      videoUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
          progressBar.value = progress;
        },
        reject,
        async () => {
          const url = await videoUploadTask.snapshot.ref.getDownloadURL();
          resolve(url);
        }
      );
    });

    // رفع الصورة المصغرة مع متابعة النسبة
    const thumbRef = storage.ref(`thumbnails/${videoId}_${thumbnailFile.name}`);
    const thumbUploadTask = thumbRef.put(thumbnailFile);

    const thumbnailURL = await new Promise((resolve, reject) => {
      thumbUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = 50 + (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
          progressBar.value = progress;
        },
        reject,
        async () => {
          const url = await thumbUploadTask.snapshot.ref.getDownloadURL();
          resolve(url);
        }
      );
    });

    // حفظ بيانات الفيديو
    await db.collection("videos").add({
      title,
      description,
      videoURL,
      thumbnailURL,
      uploader: user.email || "مستخدم مجهول",
      views: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ تم رفع الفيديو بنجاح!");
    window.location.href = "index.html";
  } catch (err) {
    alert("❌ حدث خطأ أثناء الرفع: " + err.message);
    progressBar.style.display = "none";
  }
}

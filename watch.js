const db = firebase.firestore();

// جلب ID الفيديو من الرابط
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");

if (!videoId) {
  alert("فيديو غير موجود");
  window.location.href = "index.html";
}

// جلب بيانات الفيديو وعرضها
db.collection("videos").doc(videoId).get().then(doc => {
  if (!doc.exists) {
    alert("الفيديو غير موجود");
    window.location.href = "index.html";
    return;
  }

  const data = doc.data();

  // تحديث عدد المشاهدات
const videoRef = db.collection("videos").doc(videoId);

db.runTransaction(async (transaction) => {
  const doc = await transaction.get(videoRef);
  if (!doc.exists) throw "فيديو غير موجود";

  const data = doc.data();
  const newViews = (data.views || 0) + 1;

  transaction.update(videoRef, { views: newViews });

  // عرض البيانات
  document.getElementById("videoPlayer").src = data.videoURL;
  document.getElementById("videoTitle").textContent = data.title;
  document.getElementById("uploader").textContent = data.uploader || "مجهول";
  document.getElementById("views").textContent = newViews;
  document.getElementById("videoDescription").textContent = data.description || "";
});


// جلب فيديوهات مقترحة
const suggestionContainer = document.getElementById("suggestions");

db.collection("videos").limit(5).get().then(snapshot => {
  snapshot.forEach(doc => {
    if (doc.id === videoId) return; // تجاهل الفيديو الحالي
    const data = doc.data();

    const div = document.createElement("div");
    div.className = "video-suggestion";
    div.innerHTML = `
      <img src="${data.thumbnailURL}" alt="صورة مصغرة">
      <div>
        <h4>${data.title}</h4>
        <p>${data.uploader || "مستخدم"}</p>
      </div>
    `;
    div.onclick = () => {
      window.location.href = `watch.html?id=${doc.id}`;
    };
    suggestionContainer.appendChild(div);
  });
});

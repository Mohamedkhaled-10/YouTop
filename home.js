const db = firebase.firestore();
const auth = firebase.auth();

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  }
});

function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// تحميل الفيديوهات من قاعدة البيانات
const videoList = document.getElementById("video-list");

db.collection("videos").get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <img src="${data.thumbnailURL}" alt="صورة مصغرة">
      <div class="video-info">
        <h4>${data.title}</h4>
        <p>${data.uploader || "مستخدم مجهول"} - ${data.views || 0} مشاهدة</p>
      </div>
    `;
    card.onclick = () => {
      window.location.href = `watch.html?id=${doc.id}`;
    };

    videoList.appendChild(card);
  });
});

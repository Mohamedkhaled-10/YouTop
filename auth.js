let isLogin = true;

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit-btn");
const toggleForm = document.getElementById("toggle-form");
const formTitle = document.getElementById("form-title");

submitBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("يرجى ملء جميع الحقول");
    return;
  }

  if (isLogin) {
    // تسجيل الدخول
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("تم تسجيل الدخول بنجاح");
        window.location.href = "index.html";
      })
      .catch(err => alert("خطأ: " + err.message));
  } else {
    // إنشاء حساب
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert("تم إنشاء الحساب بنجاح");
        window.location.href = "index.html";
      })
      .catch(err => alert("خطأ: " + err.message));
  }
});

toggleForm.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "تسجيل الدخول" : "إنشاء حساب";
  submitBtn.textContent = isLogin ? "دخول" : "تسجيل";
  toggleForm.textContent = isLogin ? "ليس لديك حساب؟ أنشئ واحدًا" : "هل لديك حساب؟ سجل الدخول";
});

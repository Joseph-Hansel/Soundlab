const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  // Signup logic
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (localStorage.getItem(`user_${username}`)) {
      alert('User already exists.');
    } else {
      localStorage.setItem(`user_${username}`, JSON.stringify({ password }));
      alert('Signup successful! Please log in.');
      signupForm.reset();
    }
  });

  // Login logic
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const userData = JSON.parse(localStorage.getItem(`user_${username}`));

    if (userData && userData.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', username);
      alert('Login successful!');
      window.location.href = './homepage.html';
    } else {
      alert('Invalid login credentials.');
    }
  });

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = './accountpage.html';
}
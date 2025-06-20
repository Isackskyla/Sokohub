// auth.js
import { auth, firebaseApp } from './firebase-config.js'; // Import auth and app from config
import { sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { showPage, hideModal } from './ui-handlers.js'; // Assume these are in ui-handlers.js

export function handleAuthError(error, context) {
  let message = error.message;
  const errorMap = {
    'auth/email-already-in-use': 'Email already in use',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/wrong-password': 'Incorrect password',
    'auth/user-not-found': 'User not found',
    'auth/too-many-requests': 'Too many attempts. Try again later'
  };
  if (error.code in errorMap) {
    message = errorMap[error.code];
  }
  alert(`❌ ${context === 'signup' ? 'Signup' : 'Login'} error: ${message}`);
}

export async function signupUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    alert("✅ Account created! Please check your email to verify your account. You will be signed out until verified.");
    hideModal('signupModal');
    await signOut(auth);
  } catch (error) {
    handleAuthError(error, 'signup');
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      const resend = confirm('✉️ Your email is not verified. Would you like us to resend the verification email?');
      if (resend) {
        await sendEmailVerification(user);
        alert(`📨 Verification email sent to ${email}. Please check your inbox (and spam folder).`);
      }
      await signOut(auth); // Sign them out if not verified
      return;
    }
    alert("✅ Login successful! Welcome back.");
    hideModal('loginModal');
  } catch (error) {
    handleAuthError(error, 'login');
  }
}

export function logoutUser() {
  signOut(auth).then(() => {
    // Optionally alert the user or redirect
    alert("You have been logged out.");
    showPage('home-content'); // Redirect to home after logout
  }).catch((error) => {
    console.error("Error logging out:", error);
    alert("Error logging out. Please try again.");
  });
}

export function setupAuthChangeListener() {
  onAuthStateChanged(auth, (user) => {
    const authSection = document.getElementById('authSection');
    const profileSection = document.getElementById('profileSection');
    const userEmailSpan = document.getElementById('userEmail');

    const authMenuItems = document.querySelectorAll('.menu-item[data-auth-required]');
    const guestMenuItems = document.querySelectorAll('.menu-item[data-guest-only]');

    if (user) {
      authSection.style.display = 'none';
      profileSection.style.display = 'block';
      userEmailSpan.textContent = user.email;

      authMenuItems.forEach(item => item.classList.remove('hidden'));
      guestMenuItems.forEach(item => item.classList.add('hidden'));
    } else {
      authSection.style.display = 'block';
      profileSection.style.display = 'none';

      authMenuItems.forEach(item => item.classList.add('hidden'));
      guestMenuItems.forEach(item => item.classList.remove('hidden'));

      showPage('home-content'); // Ensure home is shown if logged out
    }
  });
}


// settings.js

export function saveMpesaNumber() {
  const mpesaNumber = document.getElementById('mpesa-number').value;
  if (!/^254[0-9]{9}$/.test(mpesaNumber)) {
    alert("Please enter a valid M-Pesa number (e.g., 2547XXXXXXXX).");
    return;
  }
  localStorage.setItem('mpesaNumber', mpesaNumber);
  alert("M-Pesa number saved successfully!");
}

export function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

export function shareReferral() {
  const code = document.getElementById('referral-code').textContent; // Assuming you have an element with this ID
  if (navigator.share) {
    navigator.share({
      title: 'Join Sokohub',
      text: `Hey, check out Sokohub for great commodity deals! Use my referral code: ${code} for a discount on your first order.`,
      url: window.location.href // Or your app's main URL
    }).then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    alert(`You can share your referral code: ${code}. (Web Share API not supported on this browser)`);
    // Fallback: Copy to clipboard or prompt user to share manually
  }
}

// Global window functions for HTML onclick
window.saveMpesaNumber = saveMpesaNumber;
window.toggleDarkMode = toggleDarkMode;
window.shareReferral = shareReferral;


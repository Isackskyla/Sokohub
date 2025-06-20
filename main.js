// main.js (This will be linked in your index.html)

// Import core modules
import { setupAuthChangeListener, loginUser, signupUser, logoutUser } from './auth.js';
import { showPage, showLoginModal, showSignupModal, toggleMenu, hideModal } from './ui-handlers.js';
import { renderAllCommoditySections, populateFilters, applyFilters, updatePriceOptions, showAllCommoditiesView } from './home.js';
import { renderOrders } from './orders.js';
import { renderNotifications } from './notifications.js';
import { showBulkOrderModal } from './bulk-order-modal.js';
import { showTraderRegisterModal } from './trader-registration-modal.js';
import { saveMpesaNumber, toggleDarkMode, shareReferral } from './settings.js'; // Import settings functions
import { auth } from './firebase-config.js'; // Import auth object for checks

document.addEventListener('DOMContentLoaded', function() {
    // Expose global functions for HTML onclick attributes (where necessary)
    window.logout = logoutUser;
    // showLoginModal, showSignupModal, hideModal, showPage are already exposed in ui-handlers

    // DOM Elements for authentication forms
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    // Authentication Form Handlers
    signupPassword.addEventListener('input', checkPasswordMatch);
    signupConfirmPassword.addEventListener('input', checkPasswordMatch);

    function checkPasswordMatch() {
        const password = signupPassword.value;
        const confirmPassword = signupConfirmPassword.value;
        if (confirmPassword === "") {
            signupConfirmPassword.classList.remove('password-mismatch');
            return;
        }
        if (password !== confirmPassword) {
            signupConfirmPassword.classList.add('password-mismatch');
        } else {
            signupConfirmPassword.classList.remove('password-mismatch');
        }
    }

    document.getElementById("signupForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        const email = signupEmail.value;
        const password = signupPassword.value;
        const confirm = signupConfirmPassword.value;

        if (password.length < 6) {
            alert("❌ Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirm) {
            alert("❌ Passwords do not match.");
            return;
        }
        await signupUser(email, password);
    });

    document.getElementById("loginForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;
        await loginUser(email, password);
    });

    // Main UI Event Listeners
    document.getElementById('menuIcon').addEventListener('click', toggleMenu);
    document.getElementById('overlay').addEventListener('click', () => {
        toggleMenu(); // Closes menu
        hideModal('loginModal'); // Closes all modals (you can refine this to close specific ones)
        hideModal('signupModal');
        hideModal('trader-modal');
        hideModal('bulk-order-modal');
        hideModal('trader-register-modal');
    });

    document.getElementById('userIcon').addEventListener('click', () => {
      if (auth.currentUser) {
        showPage('settings-content');
      } else {
        showLoginModal();
      }
    });

    // Menu item clicks (using imported showPage and modal functions)
    document.getElementById('loginMenuItem').addEventListener('click', (e) => { e.preventDefault(); showLoginModal(); });
    document.getElementById('signupMenuItem').addEventListener('click', (e) => { e.preventDefault(); showSignupModal(); });
    document.getElementById('homeMenuItem').addEventListener('click', (e) => { e.preventDefault(); showPage('home-content'); });
    document.getElementById('ordersMenuItem').addEventListener('click', (e) => { e.preventDefault(); showPage('orders-content'); });
    document.getElementById('bulkOrderMenuItem').addEventListener('click', (e) => { e.preventDefault(); showBulkOrderModal(); });
    document.getElementById('registerTraderMenuItem').addEventListener('click', (e) => { e.preventDefault(); showTraderRegisterModal(); });
    document.getElementById('notificationsMenuItem').addEventListener('click', (e) => { e.preventDefault(); showPage('notifications-content'); });
    document.getElementById('settingsMenuItem').addEventListener('click', (e) => { e.preventDefault(); showPage('settings-content'); });
    document.getElementById('helpMenuItem').addEventListener('click', (e) => { e.preventDefault(); showPage('help-content'); });
    document.getElementById('aboutMenuItem').addEventListener('click', (e) => { e.preventDefault(); showPage('about-content'); });

    // Filter Event Listeners (from home.js)
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('commoditySelect').addEventListener('change', () => {
        updatePriceOptions(document.getElementById('commoditySelect').value);
        applyFilters();
    });
    document.getElementById('marketSelect').addEventListener('change', applyFilters);
    document.getElementById('priceSelect').addEventListener('change', applyFilters);
    document.getElementById('back-button').addEventListener('click', showAllCommoditiesView);

    // History API for back/forward browser buttons
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            showPage(event.state.page);
            if (event.state.commodity) {
                // This would be showSingleCommodityView(event.state.commodity) if you re-export it from home.js
                // For simplicity here, just ensuring home filters are applied.
                showAllCommoditiesView();
            } else {
                showAllCommoditiesView();
            }
        } else {
            showPage('home-content');
            showAllCommoditiesView();
        }
    });

    // Initialize the application
    setupAuthChangeListener(); // Start listening for auth state changes
    renderAllCommoditySections(); // Render home page commodities
    populateFilters(); // Populate filters on load
    showPage('home-content'); // Show home content initially
    renderOrders(); // Initial render of orders
    renderNotifications(); // Initial render of notifications
});


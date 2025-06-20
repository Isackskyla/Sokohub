// ui-handlers.js

let isMenuOpen = false;
let currentCommodityView = null; // Manage state of the current commodity view

const allMenuPages = document.querySelectorAll('.content > div:not(#trader-modal):not(#bulk-order-modal):not(#trader-register-modal)');
const allModals = document.querySelectorAll('.modal');
const overlay = document.getElementById('overlay');
const sideMenu = document.getElementById('sideMenu');
const filterContainer = document.getElementById('filter-container');
const backButton = document.getElementById('back-button');

import { renderOrders } from './orders.js'; // Import to refresh orders
import { renderNotifications } from './notifications.js'; // Import to refresh notifications
import { applyFilters, showAllCommoditiesView, showSingleCommodityView } from './home.js'; // Import home view functions

export function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  if (isMenuOpen) {
    sideMenu.classList.add('open');
    overlay.classList.add('active');
  } else {
    sideMenu.classList.remove('open');
    // Only remove overlay if no modals are open
    const loginOpen = document.getElementById('loginModal').style.display === 'flex';
    const signupOpen = document.getElementById('signupModal').style.display === 'flex';
    const traderModalOpen = document.getElementById('trader-modal').style.display === 'flex';
    const bulkOrderModalOpen = document.getElementById('bulk-order-modal').style.display === 'flex';
    const traderRegisterModalOpen = document.getElementById('trader-register-modal').style.display === 'flex';

    if (!loginOpen && !signupOpen && !traderModalOpen && !bulkOrderModalOpen && !traderRegisterModalOpen) {
      overlay.classList.remove('active');
    }
  }
}

export function hideAllModals() {
  allModals.forEach(modal => {
    modal.style.display = 'none';
    modal.classList.remove('active');
  });
  document.getElementById('trader-modal').style.display = 'none';
  document.getElementById('bulk-order-modal').style.display = 'none';
  document.getElementById('trader-register-modal').style.display = 'none';
}

export function hideModal(id) {
    document.getElementById(id).style.display = "none";
    const loginOpen = document.getElementById('loginModal').style.display === 'flex';
    const signupOpen = document.getElementById('signupModal').style.display === 'flex';
    const menuOpen = document.getElementById('sideMenu').classList.contains('open');
    const traderModalOpen = document.getElementById('trader-modal').style.display === 'flex';
    const bulkOrderModalOpen = document.getElementById('bulk-order-modal').style.display === 'flex';
    const traderRegisterModalOpen = document.getElementById('trader-register-modal').style.display === 'flex';

    if (!loginOpen && !signupOpen && !menuOpen && !traderModalOpen && !bulkOrderModalOpen && !traderRegisterModalOpen) {
      document.getElementById('overlay').classList.remove('active');
    }
}


export function showLoginModal() {
  hideModal('signupModal');
  document.getElementById("loginModal").style.display = "flex";
  overlay.classList.add('active');
  if (sideMenu.classList.contains('open')) {
    sideMenu.classList.remove('open');
  }
}

export function showSignupModal() {
  hideModal('loginModal');
  document.getElementById("signupModal").style.display = "flex";
  overlay.classList.add('active');
  if (sideMenu.classList.contains('open')) {
    sideMenu.classList.remove('open');
  }
}

export function showPage(pageId) {
  allMenuPages.forEach(page => {
    page.style.display = 'none';
  });
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = 'block';
  }

  if (pageId === 'home-content') {
    filterContainer.style.display = 'block';
    if (currentCommodityView) {
      showAllCommoditiesView(); // Ensure filters are applied if returning from single view
    } else {
      applyFilters();
    }
  } else {
    filterContainer.style.display = 'none';
    backButton.style.display = 'none';
    currentCommodityView = null;
  }
  toggleMenu();
  history.pushState({
    page: pageId,
    commodity: currentCommodityView
  }, '', `#${pageId}`);

  // Special case for orders page: re-render orders when navigating to it
  if (pageId === 'orders-content') {
      renderOrders();
  }
  // Special case for notifications page: re-render notifications when navigating to it
  if (pageId === 'notifications-content') {
      renderNotifications();
  }
}

// Global window functions for direct HTML calls
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.hideModal = hideModal;
window.showPage = showPage; // Expose for menu items


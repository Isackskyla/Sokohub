// utils.js

import { marketToCountyMap } from './data.js';

/**
 * Generates a random alphanumeric order ID.
 * @returns {string} The generated order ID (e.g., "RDS-XYZ123").
 */
export function generateOrderId() {
    const prefix = "SH"; // Sokohub
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 random chars
    const timestampPart = Date.now().toString().slice(-4); // Last 4 digits of timestamp
    return `${prefix}-${randomPart}-${timestampPart}`;
}

/**
 * Helper function to get readable county name.
 * @param {string} countyKey - The county key (e.g., "Mombasa County").
 * @returns {string} The readable county name (e.g., "Mombasa").
 */
export function getReadableCountyName(countyKey) {
    return countyKey.replace(' County', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Helper function to get county from market name.
 * @param {string} marketName - The market name.
 * @returns {string|null} The county name or null if not found.
 */
export function getCountyFromMarket(marketName) {
    return marketToCountyMap[marketName.toLowerCase()] || null;
}

/**
 * Adds a highlight animation to an element.
 * @param {string} id - The ID of the element to highlight.
 */
export function animateChange(id) {
  const el = document.getElementById(id);
  el.classList.add("highlight");
  setTimeout(() => el.classList.remove("highlight"), 300);
}

// Local Storage for Orders and Notifications
export function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    orders.push(order);
    localStorage.setItem('userOrders', JSON.stringify(orders));
}

export function getOrders() {
    return JSON.parse(localStorage.getItem('userOrders')) || [];
}

export function saveNotification(message) {
    let notifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    notifications.unshift({
        message: message,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
}

export function getNotifications() {
    return JSON.parse(localStorage.getItem('userNotifications')) || [];
}


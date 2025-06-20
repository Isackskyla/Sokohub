// notifications.js
import { getNotifications } from './utils.js';

export function renderNotifications() {
    const notificationsContainer = document.getElementById('notifications-list');
    notificationsContainer.innerHTML = '';
    const notifications = getNotifications();

    if (notifications.length === 0) {
        notificationsContainer.innerHTML = '<p>No new notifications.</p>';
        return;
    }

    notifications.forEach(notification => {
        const notificationCard = document.createElement('div');
        notificationCard.className = 'notification-card';
        notificationCard.innerHTML = `
            <p>${notification.message}</p>
            <span class="timestamp">${notification.timestamp}</span>
        `;
        notificationsContainer.appendChild(notificationCard);
    });
}


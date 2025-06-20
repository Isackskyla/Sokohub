// orders.js
import { getOrders } from './utils.js';
import { getReadableCountyName } from './utils.js';

export function renderOrders() {
    const ordersContainer = document.getElementById('orders-list');
    ordersContainer.innerHTML = '';
    const orders = getOrders();

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders placed yet.</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        let orderHtml = `<h4>Order on ${order.timestamp}</h4>`;
        orderHtml += `<p><strong>Order ID:</strong> ${order.orderId}</p>`;
        if (order.type === "individual") {
            orderHtml += `<p><strong>Trader:</strong> ${order.trader} (${order.market})</p>`;
        } else if (order.type === "bulk") {
            orderHtml += `<p><strong>Order Type:</strong> Bulk Order</p>`;
        }
        orderHtml += `
            <p><strong>Commodity:</strong> ${order.commodity.charAt(0).toUpperCase() + order.commodity.slice(1)}</p>
            <p><strong>Quantity:</strong> ${order.quantity} x ${order.unit}</p>
            <p><strong>Unit Price:</strong> Ksh ${order.pricePerUnit.toFixed(2)}</p>
            `;
        orderHtml += `<p><strong>Destination:</strong> ${getReadableCountyName(order.buyerCounty)}`;

        if (order.deliveryDestinationTown && order.deliveryDestinationTown !== 'all') {
           orderHtml += ` - ${order.deliveryDestinationTown.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`;
           if (order.deliveryDestinationPlace && order.deliveryDestinationPlace !== 'all') {
               orderHtml += ` (${order.deliveryDestinationPlace})`;
           }
        }
        orderHtml += `</p>`;
        orderHtml += `<p><strong>Delivery Fee:</strong> Ksh ${order.deliveryFee.toFixed(2)}</p>`;
        orderHtml += `<p class="total">Total Cost: Ksh ${order.totalCost.toFixed(2)}</p>`;
        orderCard.innerHTML = orderHtml;
        ordersContainer.appendChild(orderCard);
    });
}


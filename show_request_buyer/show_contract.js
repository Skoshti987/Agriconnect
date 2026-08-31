// Buyer Request Status Tracker Script
const buyerUser = AgriConnect.requireAuth('buyer');

document.addEventListener('DOMContentLoaded', function() {
    renderBuyerRequests();

    const searchInput = document.querySelector('.input-group input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filter = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#buyer-requests-tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
});

function renderBuyerRequests() {
    const tbody = document.getElementById('buyer-requests-tbody');
    if (!tbody || !buyerUser) return;

    const requests = AgriConnect.getBuyerRequests(buyerUser.id);
    tbody.innerHTML = '';

    if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">You have not submitted any purchase requests yet. <a href="../buyer_home/buyervegetable/buyervegetable.html">Browse Catalog</a></td></tr>`;
        return;
    }

    requests.forEach(req => {
        const tr = document.createElement('tr');

        let statusBadge = '';
        if (req.status === 'PENDING') {
            statusBadge = `<span class="status pending" style="background:#fff3cd; color:#856404; padding:6px 12px; border-radius:12px; font-weight:bold;">PENDING</span>`;
        } else if (req.status === 'ACCEPTED') {
            statusBadge = `<span class="status delivered" style="background:#d4edda; color:#155724; padding:6px 12px; border-radius:12px; font-weight:bold;">ACCEPTED</span> <a href="../contracts/buyer_contract.html" style="margin-left:8px; font-size:12px; color:#2196F3;">View Contract</a>`;
        } else {
            statusBadge = `<span class="status cancelled" style="background:#f8d7da; color:#721c24; padding:6px 12px; border-radius:12px; font-weight:bold;">REJECTED</span>`;
        }

        tr.innerHTML = `
            <td><strong>#${req.id}</strong></td>
            <td><img src="images/profile_male.png" alt="seller" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:8px;">${req.sellerName}</td>
            <td>${req.productName}</td>
            <td>${req.quantity} ${req.unit || 'kg'}</td>
            <td><strong>₹${req.totalPrice.toFixed(2)}</strong></td>
            <td>${req.requestDate}</td>
            <td>${statusBadge}</td>
        `;

        tbody.appendChild(tr);
    });
}
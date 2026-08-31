// Seller Incoming Requests Handler
const sellerUser = AgriConnect.requireAuth('seller');

document.addEventListener('DOMContentLoaded', function() {
    renderSellerRequests();

    const searchInput = document.querySelector('.input-group input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filter = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#seller-requests-tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
});

function renderSellerRequests() {
    const tbody = document.getElementById('seller-requests-tbody');
    if (!tbody || !sellerUser) return;

    const requests = AgriConnect.getSellerRequests(sellerUser.id);
    tbody.innerHTML = '';

    if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">No buyer requests received yet.</td></tr>`;
        return;
    }

    requests.forEach(req => {
        const tr = document.createElement('tr');

        let statusMarkup = '';
        if (req.status === 'PENDING') {
            statusMarkup = `
                <button onclick="handleRequestAction('${req.id}', 'ACCEPTED')" style="background:#4CAF50; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-right:5px;">Accept</button>
                <button onclick="handleRequestAction('${req.id}', 'REJECTED')" style="background:#f44336; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Reject</button>
            `;
        } else if (req.status === 'ACCEPTED') {
            statusMarkup = `<span class="status delivered" style="background:#d4edda; color:#155724; padding:5px 10px; border-radius:12px; font-weight:bold;">ACCEPTED</span> <a href="../contracts/seller_contract.html" style="margin-left:8px; font-size:12px; color:#2196F3;">View Contract</a>`;
        } else {
            statusMarkup = `<span class="status cancelled" style="background:#f8d7da; color:#721c24; padding:5px 10px; border-radius:12px; font-weight:bold;">REJECTED</span>`;
        }

        tr.innerHTML = `
            <td><strong>#${req.id}</strong></td>
            <td><img src="images/profile_male.png" alt="user" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:8px;">${req.buyerName}</td>
            <td>${req.productName}</td>
            <td>${req.quantity} ${req.unit || 'kg'}</td>
            <td><strong>₹${req.totalPrice.toFixed(2)}</strong></td>
            <td>${req.requestDate}</td>
            <td>${statusMarkup}</td>
        `;

        tbody.appendChild(tr);
    });
}

function handleRequestAction(requestId, action) {
    const confirmMsg = action === 'ACCEPTED' ? 'Accept this purchase request and generate a formal contract?' : 'Reject this purchase request?';
    if (confirm(confirmMsg)) {
        const res = AgriConnect.updateRequestStatus(requestId, action);
        if (res.success) {
            alert(`Request status updated to ${action}.` + (action === 'ACCEPTED' ? ' Digital Contract generated!' : ''));
            renderSellerRequests();
        } else {
            alert(res.message);
        }
    }
}
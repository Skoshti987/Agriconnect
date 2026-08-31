// Buyer Contract Display & PDF Export
const buyer = AgriConnect.requireAuth('buyer');

document.addEventListener('DOMContentLoaded', function() {
    renderBuyerContracts();
});

function renderBuyerContracts() {
    const container = document.getElementById('buyer-contracts-list');
    if (!container || !buyer) return;

    const contracts = AgriConnect.getUserContracts(buyer.id, 'buyer');
    container.innerHTML = '';

    if (contracts.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; font-size:16px;">No contracts found. Contracts are generated once a seller accepts your purchase request. <a href="../show_request_buyer/show_contract.html">Track your requests here</a>.</p>';
        return;
    }

    contracts.forEach(cnt => {
        const div = document.createElement('div');
        div.style.cssText = 'border:2px solid #055032; border-radius:10px; padding:20px; margin-bottom:20px; background:#fff; box-shadow:0 3px 6px rgba(0,0,0,0.1); text-align:left;';

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ddd; padding-bottom:10px;">
                <h3 style="margin:0; color:#055032;">Contract #${cnt.id}</h3>
                <span style="background:#d4edda; color:#155724; padding:4px 12px; border-radius:12px; font-weight:bold; font-size:13px;">${cnt.status}</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; margin:15px 0;">
                <div style="flex:1; min-width:200px;">
                    <p><strong>Buyer Name:</strong> ${cnt.buyerName}</p>
                    <p><strong>Seller Name:</strong> ${cnt.sellerName}</p>
                    <p><strong>Product Ordered:</strong> ${cnt.productName}</p>
                </div>
                <div style="flex:1; min-width:200px;">
                    <p><strong>Quantity:</strong> ${cnt.quantity} ${cnt.unit || 'kg'}</p>
                    <p><strong>Unit Price:</strong> ₹${cnt.pricePerUnit}</p>
                    <p><strong>Total Price:</strong> <span style="font-size:18px; color:#2e7d32; font-weight:bold;">₹${cnt.totalPrice.toFixed(2)}</span></p>
                </div>
            </div>
            <p style="font-size:13px; color:#555; background:#f9f9f9; padding:10px; border-radius:5px;"><strong>Agreement Terms:</strong> ${cnt.terms}</p>
            <p style="font-size:12px; color:#888;">Issue Date: ${cnt.createdDate}</p>
            <button onclick="downloadBuyerContractPDF('${cnt.id}')" style="background:#055032; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; margin-top:10px;">Download Copy (PDF)</button>
        `;

        container.appendChild(div);
    });
}

function downloadBuyerContractPDF(contractId) {
    const contracts = AgriConnect.getContracts();
    const cnt = contracts.find(c => c.id === contractId);
    if (!cnt) return;

    if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(5, 80, 50);
        doc.text("AgriConnect - Digital Purchase Agreement", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Contract ID: ${cnt.id}`, 20, 35);
        doc.text(`Date: ${cnt.createdDate}`, 20, 42);

        doc.text("----------------------------------------------------------------------------------", 20, 48);

        doc.text(`Buyer Name: ${cnt.buyerName}`, 20, 60);
        doc.text(`Seller Name: ${cnt.sellerName}`, 20, 70);
        doc.text(`Product Ordered: ${cnt.productName}`, 20, 80);
        doc.text(`Quantity: ${cnt.quantity} ${cnt.unit || 'kg'}`, 20, 90);
        doc.text(`Price per Unit: Rs. ${cnt.pricePerUnit}`, 20, 100);
        doc.setFontSize(14);
        doc.text(`Total Agreed Price: Rs. ${cnt.totalPrice.toFixed(2)}`, 20, 115);

        doc.setFontSize(10);
        doc.text("Terms & Conditions:", 20, 130);
        doc.text(cnt.terms, 20, 138, { maxWidth: 170 });

        doc.text("----------------------------------------------------------------------------------", 20, 160);
        doc.text("Authorized by AgriConnect Digital Escrow & Contract Management System", 20, 170);

        doc.save(`AgriConnect_Buyer_Contract_${cnt.id}.pdf`);
    } else {
        window.print();
    }
}

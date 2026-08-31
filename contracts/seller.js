document.addEventListener('DOMContentLoaded', loadContractFromBuyer);
document.getElementById('acceptContractButton').addEventListener('click', acceptContract);

function loadContractFromBuyer() {
    const contractData = JSON.parse(localStorage.getItem("buyerContract"));
    if (contractData) {
        const contractDisplay = `
            <h3>Contract Details</h3>
            <p><strong>Buyer:</strong> ${contractData.buyerName}</p>
            <p><strong>Seller:</strong> ${contractData.sellerName}</p>
            <p><strong>Crop Category:</strong> ${contractData.cropCategory}</p>
            <p><strong>Crop:</strong> ${contractData.amount} units of ${contractData.cropType}</p>
            <p><strong>Price per Unit:</strong> ₹${contractData.price}</p>
            <p><strong>Delivery Date:</strong> ${contractData.deliveryDate}</p>
            <p><strong>Payment Due:</strong> ${contractData.paymentDue} days after delivery</p>
            <p><strong>Contract Period:</strong> ${contractData.contractPeriod} ${contractData.periodUnit}</p>
        `;

        document.getElementById('contractDisplay').innerHTML = contractDisplay;
        document.getElementById('acceptContractButton').style.display = 'inline-block';
        document.getElementById('downloadContractSeller').style.display = 'inline-block'; // Show download button for seller
    } else {
        alert("No contract found from the buyer.");
    }
}

function acceptContract() {
    alert("You have accepted the contract.");
    localStorage.setItem("contractAccepted", JSON.stringify(true));
}

document.getElementById('downloadContractSeller').addEventListener('click', downloadContractAsPDFSeller);

function downloadContractAsPDFSeller() {
    const contractData = JSON.parse(localStorage.getItem("buyerContract"));
    if (contractData) {
        const { buyerName, sellerName, cropCategory, cropType, amount, price, deliveryDate, paymentDue, contractPeriod, periodUnit } = contractData;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Contract Details", 20, 10);
        doc.text(`Buyer: ${buyerName}`, 20, 20);
        doc.text(`Seller: ${sellerName}`, 20, 30);
        doc.text(`Crop Category: ${cropCategory}`, 20, 40);
        doc.text(`Crop Type: ${cropType}`, 20, 50);
        doc.text(`Amount: ${amount} units`, 20, 60);
        doc.text(`Price per Unit: $${price}`, 20, 70);
        doc.text(`Delivery Date: ${deliveryDate}`, 20, 80);
        doc.text(`Payment Due: ${paymentDue} days after delivery`, 20, 90);
        doc.text(`Contract Period: ${contractPeriod} ${periodUnit}`, 20, 100);

        doc.save("contract.pdf");
    } else {
        alert("No contract available to download.");
    }
}

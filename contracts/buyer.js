// Event listener for the "Send Contract" button
document.getElementById('sendContractButton').addEventListener('click', sendContractToSeller);

// Crop options data
const cropOptions = {
    vegetable: { "Tomato": 45, "Cucumber": 50, "Carrot": 37},
    fruit: { "Apple": 50, "Banana": 30, "Grapes": 80 }
};

// Load crop options based on selected category
function loadCropOptions() {
    const category = document.getElementById('cropCategory').value;
    const cropTypeSelect = document.getElementById('cropType');
    cropTypeSelect.innerHTML = '<option value="">Select Specific Crop</option>';

    if (cropOptions[category]) {
        Object.keys(cropOptions[category]).forEach(crop => {
            const option = document.createElement('option');
            option.value = crop;
            option.text = crop;
            cropTypeSelect.add(option);
        });
    }
}

// Set crop pricing based on selected crop type
function setCropPricing() {
    const category = document.getElementById('cropCategory').value;
    const cropType = document.getElementById('cropType').value;
    const priceInput = document.getElementById('price');

    if (category && cropType && cropOptions[category][cropType] !== undefined) {
        priceInput.value = cropOptions[category][cropType];
        priceInput.readOnly = true;
    } else {
        priceInput.value = "";
        priceInput.readOnly = false;
    }
}

// Function to send contract details to the seller
function sendContractToSeller() {
    const contractData = {
        buyerName: document.getElementById("buyerName").value,
        sellerName: document.getElementById("sellerName").value,
        cropCategory: document.getElementById('cropCategory').value,
        cropType: document.getElementById("cropType").value,
        amount: parseFloat(document.getElementById("amount").value),
        price: parseFloat(document.getElementById("price").value),
        deliveryDate: document.getElementById("deliveryDate").value,
        paymentDue: parseInt(document.getElementById("paymentDue").value, 10),
        contractPeriod: parseInt(document.getElementById("contractPeriod").value, 10),
        periodUnit: document.getElementById("periodUnit").value
    };

    // Save contract data to local storage
    localStorage.setItem("buyerContract", JSON.stringify(contractData));
    alert("Contract has been sent to the seller!");
    document.getElementById("downloadContract").style.display = "block"; // Show the download button
}

// Event listener for the "Download Contract" button
document.getElementById('downloadContract').addEventListener('click', downloadContractAsPDF);

// Function to download contract details as a PDF
function downloadContractAsPDF() {
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

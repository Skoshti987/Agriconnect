# AgriConnect - Direct & B2B Agriculture Marketplace

AgriConnect is a comprehensive B2B and direct-to-consumer e-commerce platform that connects farmers (sellers) directly with commercial retail buyers and individual consumers.

---

## 🌟 Key Features

### For Sellers / Farmers
- **Seller Authentication**: Secure sign in and registration with support for location and payment preferences (UPI, GST, IFSC).
- **Product Management**: Add vegetables and agricultural produce with custom price per unit and stock quantity.
- **Request Management**: Receive incoming purchase requests from buyers with options to **Accept** or **Reject**.
- **Automated Digital Contracts**: Automatically generates a formal purchase agreement upon request acceptance.
- **PDF Export**: Download official contracts as PDF documents.

### For Buyers
- **Buyer Authentication**: Role-restricted sign in for Individual and Mass Buyers.
- **Produce Catalog**: Real-time browsing of fresh produce listed directly by verified local farmers.
- **Request Submission**: Interactive quantity selector with total price preview and stock limit validation.
- **Real-Time Request Tracker**: Monitor status of submitted requests (`PENDING`, `ACCEPTED`, `REJECTED`).
- **Buyer Contracts**: Access and download active contracts once accepted by sellers.

---

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), FontAwesome, Remix Icons
- **Engine & State Persistence**: AgriConnect Application Engine (`js/app-engine.js`), LocalStorage / IndexedDB persistence API
- **Backend**: Node.js & Express (`server.js`) / Optional PHP engine (`login.php`)
- **Database**: MySQL / MariaDB relational database support (`database/schema.sql`)
- **PDF Generation**: jsPDF

---

## 📁 Project Structure

```
Contrafarm-mp--main/
├── index.html                   # Platform Landing Page
├── server.js                    # Node.js Express Application Server
├── package.json                 # Node.js Dependencies & Scripts
├── login.php                    # Secure PHP Authentication Handler
├── .env.example                 # Environment Variables Configuration Template
├── database/
│   └── schema.sql               # Production MySQL Database Schema
├── js/
│   └── app-engine.js            # Core App Engine (Auth, Products, Requests, Contracts)
├── logpage/
│   ├── seller.html              # Seller Login & Registration
│   └── buyer.html               # Buyer Login & Registration
├── seller_home/
│   └── Seller_page.html         # Seller Portal Dashboard
├── buyer_home/
│   └── buyerHome.html           # Buyer Portal Dashboard
├── Seller Page of vegetables/
│   └── Firstpage.html           # Add & Manage Seller Vegetables
├── vegetable_section_buyer/
│   └── buyervegetable.html      # Buyer Fresh Produce Catalog
├── show_request/
│   └── show_contract.html       # Seller Incoming Request Manager
├── show_request_buyer/
│   └── show_contract.html       # Buyer Submitted Request Tracker
└── contracts/
    ├── seller_contract.html     # Seller Active Contracts
    └── buyer_contract.html      # Buyer Active Contracts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- Web Browser (Chrome, Firefox, Edge, Safari)

### Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Skoshti987/Agriconnect.git
   cd Agriconnect
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the application server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to `http://localhost:8000`

---

## 🔑 Default Test Credentials

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Seller (Farmer)** | `farmer_john` or `john@contrafarm.com` | `password123` |
| **Buyer** | `buyer_sarah` or `sarah@freshmart.com` | `password123` |

---

## 🛡️ Security Best Practices
- **Route Protection**: Unauthenticated users cannot access dashboard or portal routes.
- **Input Validation**: Backend and frontend validation for positive quantities, non-empty fields, and stock limits.
- **SQL Injection & XSS Protection**: Prepared statements used in PHP endpoints and sanitized DOM creation.

---

## 📦 Deployment Instructions

### Option 1: Node.js (Render / Heroku / Vercel)
Set the environment variable `PORT` if required, and deploy using build command `npm install` and start command `npm start`.

### Option 2: Traditional LAMP Stack (Apache / Nginx + PHP + MySQL)
1. Import `database/schema.sql` into your MySQL database server.
2. Update database connection settings in `login.php` or set environment variables (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`).
3. Deploy files to your web server root directory (`public_html` or `www`).

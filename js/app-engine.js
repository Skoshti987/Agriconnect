/**
 * AgriConnect - Core Application Engine & Data Persistence Layer
 * Manages Users, Authentication, Products, Requests, Contracts & Route Protection
 */

(function (window) {
    'use strict';

    const STORAGE_KEYS = {
        USERS: 'agriconnect_users',
        CURRENT_USER: 'agriconnect_current_user',
        PRODUCTS: 'agriconnect_products',
        REQUESTS: 'agriconnect_requests',
        CONTRACTS: 'agriconnect_contracts'
    };

    // Helper functions for LocalStorage
    function getItem(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error reading key:', key, e);
            return defaultValue;
        }
    }

    function setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving key:', key, e);
        }
    }

    // Initialize Default Seed Data
    function seedInitialData() {
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            const seedUsers = [
                {
                    id: 'usr_seller_1',
                    username: 'farmer_john',
                    email: 'john@contrafarm.com',
                    password: 'password123',
                    role: 'seller',
                    name: 'John Doe (Green Valley Farm)',
                    location: 'Kolhapur, Maharashtra',
                    paymentType: 'UPI',
                    paymentDetail: 'john@upi'
                },
                {
                    id: 'usr_buyer_1',
                    username: 'buyer_sarah',
                    email: 'sarah@freshmart.com',
                    password: 'password123',
                    role: 'buyer',
                    name: 'Sarah Jenkins (FreshMart Retail)',
                    location: 'Pune, Maharashtra',
                    buyerType: 'Mass Buyer'
                }
            ];
            setItem(STORAGE_KEYS.USERS, seedUsers);
        }

        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            const seedProducts = [
                {
                    id: 'prod_1',
                    sellerId: 'usr_seller_1',
                    sellerName: 'John Doe',
                    name: 'Fresh Organic Tomatoes',
                    category: 'Vegetables',
                    quantity: 500,
                    unit: 'kg',
                    price: 35,
                    image: '../vegetable_section_buyer/tomato.jpg',
                    location: 'Kolhapur',
                    description: 'Farm fresh red ripe organic tomatoes harvested daily.'
                },
                {
                    id: 'prod_2',
                    sellerId: 'usr_seller_1',
                    sellerName: 'John Doe',
                    name: 'Fresh Farm Carrots',
                    category: 'Vegetables',
                    quantity: 350,
                    unit: 'kg',
                    price: 45,
                    image: '../vegetable_section_buyer/carrot.jpg',
                    location: 'Kolhapur',
                    description: 'Crisp sweet organic orange carrots.'
                },
                {
                    id: 'prod_3',
                    sellerId: 'usr_seller_1',
                    sellerName: 'John Doe',
                    name: 'Green Cucumbers',
                    category: 'Vegetables',
                    quantity: 400,
                    unit: 'kg',
                    price: 25,
                    image: '../vegetable_section_buyer/cucumber.jpg',
                    location: 'Kolhapur',
                    description: 'Hydrating fresh cucumbers ideal for salads and wholesale.'
                }
            ];
            setItem(STORAGE_KEYS.PRODUCTS, seedProducts);
        }

        if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
            const seedRequests = [
                {
                    id: 'req_101',
                    buyerId: 'usr_buyer_1',
                    buyerName: 'Sarah Jenkins',
                    sellerId: 'usr_seller_1',
                    sellerName: 'John Doe',
                    productId: 'prod_1',
                    productName: 'Fresh Organic Tomatoes',
                    quantity: 100,
                    unit: 'kg',
                    pricePerUnit: 35,
                    totalPrice: 3500,
                    status: 'PENDING',
                    requestDate: new Date().toLocaleDateString()
                }
            ];
            setItem(STORAGE_KEYS.REQUESTS, seedRequests);
        }

        if (!localStorage.getItem(STORAGE_KEYS.CONTRACTS)) {
            setItem(STORAGE_KEYS.CONTRACTS, []);
        }
    }

    seedInitialData();

    // Core Engine API
    const AgriConnect = {
        // --- Authentication ---
        registerUser: function (userData) {
            const users = getItem(STORAGE_KEYS.USERS, []);
            const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase() || u.username.toLowerCase() === userData.username.toLowerCase());
            if (existing) {
                return { success: false, message: 'User with this email or username already exists.' };
            }
            userData.id = 'usr_' + Date.now();
            users.push(userData);
            setItem(STORAGE_KEYS.USERS, users);
            // Auto login
            this.setCurrentUser(userData);
            return { success: true, user: userData };
        },

        loginUser: function (usernameOrEmail, password, expectedRole) {
            const users = getItem(STORAGE_KEYS.USERS, []);
            const user = users.find(u => 
                (u.email.toLowerCase() === usernameOrEmail.toLowerCase() || u.username.toLowerCase() === usernameOrEmail.toLowerCase()) &&
                u.password === password
            );

            if (!user) {
                return { success: false, message: 'Invalid username/email or password.' };
            }

            if (expectedRole && user.role !== expectedRole) {
                return { success: false, message: `Access denied. Account role is '${user.role}', expected '${expectedRole}'.` };
            }

            this.setCurrentUser(user);
            return { success: true, user: user };
        },

        getCurrentUser: function () {
            return getItem(STORAGE_KEYS.CURRENT_USER, null);
        },

        setCurrentUser: function (user) {
            const safeUser = { ...user };
            delete safeUser.password;
            setItem(STORAGE_KEYS.CURRENT_USER, safeUser);
        },

        logout: function () {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            window.location.href = '../index.html';
        },

        requireAuth: function (requiredRole) {
            const user = this.getCurrentUser();
            if (!user) {
                alert('Please sign in to access this page.');
                window.location.href = requiredRole === 'seller' ? '../logpage/seller.html' : '../logpage/buyer.html';
                return null;
            }
            if (requiredRole && user.role !== requiredRole) {
                alert(`Access restricted to ${requiredRole}s only.`);
                window.location.href = user.role === 'seller' ? '../seller_home/Seller_page.html' : '../buyer_home/buyerHome.html';
                return null;
            }
            return user;
        },

        // --- Products ---
        getProducts: function () {
            return getItem(STORAGE_KEYS.PRODUCTS, []);
        },

        getSellerProducts: function (sellerId) {
            const products = this.getProducts();
            return products.filter(p => p.sellerId === sellerId);
        },

        addProduct: function (productData) {
            const user = this.getCurrentUser();
            if (!user || user.role !== 'seller') {
                return { success: false, message: 'Unauthorized. Seller access required.' };
            }

            const products = this.getProducts();
            const newProduct = {
                id: 'prod_' + Date.now(),
                sellerId: user.id,
                sellerName: user.name || user.username,
                name: productData.name,
                category: productData.category || 'Vegetables',
                quantity: parseFloat(productData.quantity),
                unit: productData.unit || 'kg',
                price: parseFloat(productData.price),
                image: productData.image || '../vegetable_section_buyer/tomato.jpg',
                location: productData.location || user.location || 'Local Farm',
                description: productData.description || ''
            };

            products.unshift(newProduct);
            setItem(STORAGE_KEYS.PRODUCTS, products);
            return { success: true, product: newProduct };
        },

        deleteProduct: function (productId) {
            let products = this.getProducts();
            products = products.filter(p => p.id !== productId);
            setItem(STORAGE_KEYS.PRODUCTS, products);
            return { success: true };
        },

        // --- Requests ---
        getRequests: function () {
            return getItem(STORAGE_KEYS.REQUESTS, []);
        },

        getBuyerRequests: function (buyerId) {
            return this.getRequests().filter(r => r.buyerId === buyerId);
        },

        getSellerRequests: function (sellerId) {
            return this.getRequests().filter(r => r.sellerId === sellerId);
        },

        createRequest: function (productId, quantity) {
            const user = this.getCurrentUser();
            if (!user || user.role !== 'buyer') {
                return { success: false, message: 'Unauthorized. Buyer access required.' };
            }

            const products = this.getProducts();
            const product = products.find(p => p.id === productId);
            if (!product) {
                return { success: false, message: 'Product not found.' };
            }

            const reqQty = parseFloat(quantity);
            if (isNaN(reqQty) || reqQty <= 0) {
                return { success: false, message: 'Please enter a valid positive quantity.' };
            }

            if (reqQty > product.quantity) {
                return { success: false, message: `Requested quantity exceeds available stock (${product.quantity} ${product.unit}).` };
            }

            const requests = this.getRequests();
            const newRequest = {
                id: 'req_' + Date.now(),
                buyerId: user.id,
                buyerName: user.name || user.username,
                sellerId: product.sellerId,
                sellerName: product.sellerName,
                productId: product.id,
                productName: product.name,
                quantity: reqQty,
                unit: product.unit || 'kg',
                pricePerUnit: product.price,
                totalPrice: reqQty * product.price,
                status: 'PENDING',
                requestDate: new Date().toLocaleDateString()
            };

            requests.unshift(newRequest);
            setItem(STORAGE_KEYS.REQUESTS, requests);
            return { success: true, request: newRequest };
        },

        updateRequestStatus: function (requestId, newStatus) {
            const user = this.getCurrentUser();
            if (!user) return { success: false, message: 'Unauthorized.' };

            const requests = this.getRequests();
            const reqIndex = requests.findIndex(r => r.id === requestId);
            if (reqIndex === -1) {
                return { success: false, message: 'Request not found.' };
            }

            const req = requests[reqIndex];
            req.status = newStatus;
            requests[reqIndex] = req;
            setItem(STORAGE_KEYS.REQUESTS, requests);

            // If ACCEPTED, generate a Contract
            if (newStatus === 'ACCEPTED') {
                this.generateContract(req);
            }

            return { success: true, request: req };
        },

        // --- Contracts ---
        getContracts: function () {
            return getItem(STORAGE_KEYS.CONTRACTS, []);
        },

        getUserContracts: function (userId, role) {
            const contracts = this.getContracts();
            if (role === 'seller') {
                return contracts.filter(c => c.sellerId === userId);
            } else {
                return contracts.filter(c => c.buyerId === userId);
            }
        },

        generateContract: function (request) {
            const contracts = this.getContracts();
            const existing = contracts.find(c => c.requestId === request.id);
            if (existing) return existing;

            const newContract = {
                id: 'CNT-' + Math.floor(100000 + Math.random() * 900000),
                requestId: request.id,
                buyerId: request.buyerId,
                buyerName: request.buyerName,
                sellerId: request.sellerId,
                sellerName: request.sellerName,
                productName: request.productName,
                quantity: request.quantity,
                unit: request.unit || 'kg',
                pricePerUnit: request.pricePerUnit,
                totalPrice: request.totalPrice,
                status: 'ACTIVE',
                createdDate: new Date().toLocaleDateString(),
                terms: 'Standard AgriConnect Agricultural Purchase Agreement. Delivery within 7 business days upon confirmation.'
            };

            contracts.unshift(newContract);
            setItem(STORAGE_KEYS.CONTRACTS, contracts);
            return newContract;
        }
    };

    window.AgriConnect = AgriConnect;
})(window);

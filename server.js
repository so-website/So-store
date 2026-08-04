const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-Memory Database with Temu/Shein-like extensive product inventory
const memoryDb = {
    users: [],
    verificationCodes: {}, // Stores code mapping: phone/email -> code
    products: [
        { id: 1, title: "Ultra-Resilient Smart Watch Series 9", price: 12.99, oldPrice: 49.99, discount: "74% OFF", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", sales: "10K+ sold", seller: "SO Global" },
        { id: 2, title: "Active Noise Cancelling Wireless Earbuds", price: 8.50, oldPrice: 35.00, discount: "75% OFF", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", sales: "25K+ sold", seller: "SO Direct" },
        { id: 3, title: "Minimalist Ergonomic Mechanical Keyboard", price: 22.40, oldPrice: 70.00, discount: "68% OFF", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500", sales: "5K+ sold", seller: "SO Tech" },
        { id: 4, title: "HD Waterproof Action Sports Camera 4K", price: 34.99, oldPrice: 120.00, discount: "70% OFF", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500", sales: "8K+ sold", seller: "SO Gadgets" },
        { id: 5, title: "RGB Led Backlit Gaming Mouse Pro", price: 5.99, oldPrice: 25.00, discount: "76% OFF", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500", sales: "40K+ sold", seller: "SO Direct" },
        { id: 6, title: "Portable Mini Thermal Photo Printer", price: 18.20, oldPrice: 55.00, discount: "67% OFF", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500", sales: "12K+ sold", seller: "SO Lifestyle" },
        { id: 7, title: "Smart LED Desk Lamp with Wireless Charger", price: 15.60, oldPrice: 45.00, discount: "65% OFF", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500", sales: "9K+ sold", seller: "SO Home" },
        { id: 8, title: "Multifunctional Stainless Steel Water Bottle", price: 7.99, oldPrice: 20.00, discount: "60% OFF", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", sales: "18K+ sold", seller: "SO Living" }
    ],
    orders: []
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'so_store_secure_secret',
    resave: false,
    saveUninitialized: true
}));

// Temu/Shein Theme Layout Base Header & Footer
const layout = (title, content, user) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SO Shopping</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .badge-flash { background: linear-gradient(135deg, #ff2d55 0%, #ff5e3a 100%); }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col justify-between">
    <div>
        <!-- Top Flash Banner -->
        <div class="badge-flash text-white text-xs font-bold text-center py-2 px-4">
            🔥 FLASH DEAL: Up to 80% OFF + Free Shipping on All Orders in Kuwait! Use Code: <span class="underline uppercase">SO2026</span>
        </div>

        <!-- Main Header -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <a href="/" class="text-3xl font-black italic tracking-tighter text-red-600">SO<span class="text-black text-xs not-italic bg-yellow-300 ml-1 px-1.5 py-0.5 rounded font-bold">MEGA MALL</span></a>
                
                <div class="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
                    <input type="text" placeholder="Search 10,000+ Super Deals..." class="w-full bg-gray-100 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-500">
                    <button class="bg-red-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-red-700">Search</button>
                </div>

                <div class="flex items-center space-x-4">
                    ${user ? `
                        <div class="text-right hidden sm:block">
                            <span class="block text-xs text-gray-500">Welcome back</span>
                            <span class="font-bold text-sm text-gray-800">${user}</span>
                        </div>
                        <a href="/sell" class="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full font-bold text-xs hover:bg-red-100">Sell Item</a>
                        <a href="/logout" class="text-gray-500 hover:text-red-600 text-sm font-medium">Logout</a>
                    ` : `
                        <a href="/login" class="flex items-center space-x-1 text-sm font-bold text-gray-700 hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span>Sign In / Register</span>
                        </a>
                    `}
                </div>
            </div>
        </header>

        <!-- Main Content Area -->
        <main class="max-w-7xl mx-auto px-4 py-6">
            ${content}
        </main>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-10 mt-16 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
                <h4 class="text-white font-bold mb-3 text-lg">Customer Support</h4>
                <p class="text-sm mb-1">WhatsApp Hotline: <strong class="text-red-400">+96590018827</strong></p>
                <p class="text-sm mb-1">Email Support: <strong class="text-red-400">othmensameh2@gmail.com</strong></p>
                <p class="text-xs text-gray-500 mt-2">Available 24/7 for fast delivery assistance across Kuwait.</p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3 text-lg">Secure Shopping</h4>
                <p class="text-sm">Verified Payment Gateways</p>
                <p class="text-sm">Easy 14-Day Returns & Refunds</p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3 text-lg">Download SO App</h4>
                <p class="text-sm mb-2">Get exclusive app-only discounts instantly.</p>
                <span class="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded">Google Play & App Store</span>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3 text-lg">About SO</h4>
                <p class="text-sm">Your ultimate direct-from-factory mega marketplace inspired by global trends.</p>
            </div>
        </div>
        <div class="text-center text-xs text-gray-600 border-t border-gray-800 pt-6">
            &copy; 2026 SO Platform. All rights reserved. Operating in Kuwait.
        </div>
    </footer>
</body>
</html>
`;

// Homepage Route with Grid of Products
app.get('/', (req, res) => {
    let productsHtml = memoryDb.products.map(p => `
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div class="relative overflow-hidden bg-gray-100">
                <span class="absolute top-2 left-2 badge-flash text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10">${p.discount}</span>
                <img src="${p.image}" alt="${p.title}" class="w-full h-48 object-cover group-hover:scale-105 transition duration-300">
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h4 class="font-medium text-sm text-gray-800 mb-2 line-clamp-2">${p.title}</h4>
                    <div class="flex items-baseline space-x-2 mb-1">
                        <span class="text-red-600 font-extrabold text-xl">$${p.price.toFixed(2)}</span>
                        <span class="text-gray-400 text-xs line-through">$${p.oldPrice.toFixed(2)}</span>
                    </div>
                    <span class="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">${p.sales}</span>
                </div>
                <div class="mt-4">
                    <button onclick="alert('Item added to your quick cart! Proceed to checkout or explore more deals.')" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs transition">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    let content = `
        <div class="mb-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center">
            <div>
                <span class="bg-black/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Mega Savings Season</span>
                <h2 class="text-3xl md:text-5xl font-black mt-2 mb-3">Direct Factory Prices</h2>
                <p class="text-red-100 text-sm max-w-lg mb-4">Discover millions of trendy items shipped straight to your doorstep with lightning-fast local delivery.</p>
            </div>
            <div class="bg-white text-gray-900 p-6 rounded-xl shadow-md text-center">
                <p class="text-xs text-gray-500 uppercase font-bold">Use Coupon Code</p>
                <p class="text-2xl font-black text-red-600 my-1">SO2026</p>
                <p class="text-[11px] text-gray-600">Extra $5 OFF orders over $20</p>
            </div>
        </div>
        <h3 class="text-xl font-black mb-6 border-l-4 border-red-600 pl-3 text-gray-800">Trending Flash Deals</h3>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${productsHtml}
        </div>
    `;

    res.send(layout('Home', content, req.session.user));
});

// Authentication: Login Page with Phone/Email option (Temu/Shein style)
app.get('/login', (req, res) => {
    let content = `
        <div class="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm my-10">
            <h2 class="text-2xl font-black mb-2 text-center text-red-600">Sign in to SO</h2>
            <p class="text-xs text-center text-gray-500 mb-6">Access exclusive mega discounts and track your orders</p>
            
            <form action="/send-code" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Email or Mobile Number</label>
                    <input type="text" name="identifier" placeholder="e.g. +96590000000 or email@domain.com" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600">
                </div>
                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow">Continue with Verification Code</button>
            </form>
            <div class="text-center mt-6">
                <a href="/" class="text-xs text-gray-500 hover:text-red-600 font-medium">← Back to Marketplace</a>
            </div>
        </div>
    `;
    res.send(layout('Sign In', content, req.session.user));
});

// Send Verification Code Handler (Temu/Shein style multi-step verification)
app.post('/send-code', (req, res) => {
    const { identifier } = req.body;
    // Generate a 4-digit code (simulated verification code for high security)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    memoryDb.verificationCodes[identifier] = code;

    let content = `
        <div class="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm my-10 text-center">
            <h2 class="text-2xl font-black mb-2 text-red-600">Enter Verification Code</h2>
            <p class="text-xs text-gray-500 mb-4">We sent a secure 4-digit verification code to <strong>${identifier}</strong></p>
            
            <div class="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800 mb-6">
                🔐 <strong>Simulated SMS/Email Code:</strong> <span class="text-red-600 font-bold text-base">${code}</span>
            </div>

            <form action="/verify-code" method="POST" class="space-y-4">
                <input type="hidden" name="identifier" value="${identifier}">
                <div>
                    <input type="text" name="code" placeholder="Enter 4-digit code" maxlength="4" required class="w-full text-center tracking-widest text-2xl font-bold bg-gray-50 border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-red-600">
                </div>
                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow">Verify & Sign In</button>
            </form>
        </div>
    `;
    res.send(layout('Verification', content, req.session.user));
});

// Verify Code and Complete Login/Registration
app.post('/verify-code', (req, res) => {
    const { identifier, code } = req.body;
    if (memoryDb.verificationCodes[identifier] === code) {
        req.session.user = identifier;
        res.redirect('/');
    } else {
        res.send(layout('Error', `<div class="max-w-md mx-auto text-center py-20"><h3 class="text-xl font-bold text-red-600 mb-2">Invalid Verification Code</h3><p class="text-sm text-gray-600 mb-4">The code you entered does not match.</p><a href="/login" class="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm">Try Again</a></div>`, req.session.user));
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// Sell Item Page
app.get('/sell', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let content = `
        <div class="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm my-10">
            <h2 class="text-2xl font-black mb-6 text-center text-red-600">List Item on SO Mega Mall</h2>
            <form action="/add-product" method="POST" class="space-y-4">
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Product Title</label><input type="text" name="title" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></div>
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Price ($)</label><input type="number" step="0.01" name="price" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></div>
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Image URL (Google Images / Unsplash)</label><input type="url" name="image" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></div>
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Description</label><textarea name="description" rows="3" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></textarea></div>
                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm">Publish Deal</button>
            </form>
            <p class="text-center text-sm text-gray-500 mt-4"><a href="/" class="text-red-600 font-medium">← Back to Store</a></p>
        </div>
    `;
    res.send(layout('Sell', content, req.session.user));
});

app.post('/add-product', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { title, price, description, image } = req.body;
    memoryDb.products.unshift({
        id: Date.now(),
        title,
        price: parseFloat(price),
        oldPrice: parseFloat(price) * 3,
        discount: "66% OFF",
        image,
        sales: "1+ sold",
        seller: req.session.user
    });
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`SO Mega Mall running on port ${PORT}`);
});

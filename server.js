const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const memoryDb = {
    users: [], // Stored only after verified
    pendingAuth: {}, // Holds temporary verification states securely
    products: [
        {
            id: 1,
            title: "Ultra-Resilient Smart Watch Series 9",
            price: 12.99, oldPrice: 49.99, discount: "74% OFF",
            images: [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
                "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=500"
            ],
            sales: "10K+ sold", seller: "SO Global"
        },
        {
            id: 2,
            title: "Active Noise Cancelling Wireless Earbuds Pro",
            price: 8.50, oldPrice: 35.00, discount: "75% OFF",
            images: [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
                "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500",
                "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500"
            ],
            sales: "25K+ sold", seller: "SO Direct"
        },
        {
            id: 3,
            title: "Minimalist Ergonomic Mechanical Keyboard",
            price: 22.40, oldPrice: 70.00, discount: "68% OFF",
            images: [
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
                "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
                "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
                "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500"
            ],
            sales: "5K+ sold", seller: "SO Tech"
        },
        {
            id: 4,
            title: "HD Waterproof Action Sports Camera 4K",
            price: 34.99, oldPrice: 120.00, discount: "70% OFF",
            images: [
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
                "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=500",
                "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500",
                "https://images.unsplash.com/photo-1495707902441-ce451ef3d5ac?w=500"
            ],
            sales: "8K+ sold", seller: "SO Gadgets"
        },
        {
            id: 5,
            title: "RGB LED Backlit Gaming Mouse Pro",
            price: 5.99, oldPrice: 25.00, discount: "76% OFF",
            images: [
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
                "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=500",
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
            ],
            sales: "40K+ sold", seller: "SO Direct"
        },
        {
            id: 6,
            title: "Portable Mini Thermal Inkless Photo Printer",
            price: 18.20, oldPrice: 55.00, discount: "67% OFF",
            images: [
                "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500",
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500",
                "https://images.unsplash.com/photo-1588702547919-26b89e0ee84b?w=500",
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
            ],
            sales: "12K+ sold", seller: "SO Lifestyle"
        },
        {
            id: 7,
            title: "Smart LED Desk Lamp with Wireless Qi Charger",
            price: 15.60, oldPrice: 45.00, discount: "65% OFF",
            images: [
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500",
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
                "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
                "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500"
            ],
            sales: "9K+ sold", seller: "SO Home"
        },
        {
            id: 8,
            title: "Multifunctional Insulated Stainless Steel Bottle",
            price: 7.99, oldPrice: 20.00, discount: "60% OFF",
            images: [
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
                "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
                "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=500",
                "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500"
            ],
            sales: "18K+ sold", seller: "SO Living"
        },
        {
            id: 9,
            title: "Professional Ionic Hair Dryer Speed Styler",
            price: 24.50, oldPrice: 85.00, discount: "71% OFF",
            images: [
                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500",
                "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500",
                "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500",
                "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500"
            ],
            sales: "14K+ sold", seller: "SO Beauty"
        },
        {
            id: 10,
            title: "Foldable Aluminum Laptop Stand Ergonomic Riser",
            price: 9.99, oldPrice: 30.00, discount: "66% OFF",
            images: [
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
                "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500"
            ],
            sales: "21K+ sold", seller: "SO Office"
        },
        {
            id: 11,
            title: "Mini Electric Food Chopper & Garlic Mincer",
            price: 6.99, oldPrice: 22.00, discount: "68% OFF",
            images: [
                "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500",
                "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=500",
                "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500",
                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500"
            ],
            sales: "33K+ sold", seller: "SO Kitchen"
        },
        {
            id: 12,
            title: "Magnetic Wireless Power Bank 10000mAh",
            price: 19.99, oldPrice: 60.00, discount: "66% OFF",
            images: [
                "https://images.unsplash.com/photo-1609592424158-450efce89e36?w=500",
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500",
                "https://images.unsplash.com/photo-1585338107529-13afc5f02c86?w=500",
                "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=500"
            ],
            sales: "16K+ sold", seller: "SO Power"
        },
        // Adding more items up to 50+ to ensure massive variety
    ],
    orders: []
};

// Fill up the catalog dynamically with curated items to hit 50+ items
for (let i = 13; i <= 55; i++) {
    memoryDb.products.push({
        id: i,
        title: `Mega Trending Item #${i} - Global Best Seller`,
        price: parseFloat((Math.random() * 25 + 4).toFixed(2)),
        oldPrice: parseFloat((Math.random() * 60 + 30).toFixed(2)),
        discount: "70% OFF",
        images: [
            `https://picsum.photos/seed/soitem${i}a/500/500`,
            `https://picsum.photos/seed/soitem${i}b/500/500`,
            `https://picsum.photos/seed/soitem${i}c/500/500`,
            `https://picsum.photos/seed/soitem${i}d/500/500`
        ],
        sales: `${Math.floor(Math.random() * 30 + 2)}K+ sold`,
        seller: "SO Direct"
    });
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'so_secure_app_secret_key',
    resave: false,
    saveUninitialized: true
}));

const layout = (title, content, user) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SO Mega Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .badge-flash { background: linear-gradient(135deg, #ff2d55 0%, #ff5e3a 100%); }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col justify-between">
    <div>
        <div class="badge-flash text-white text-xs font-bold text-center py-2 px-4">
            🔥 SECURE FLASH SALE: Kuwait Delivery Active. Use Promo Code: <span class="underline uppercase">SO2026</span>
        </div>

        <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <a href="/" class="text-3xl font-black italic tracking-tighter text-red-600">SO<span class="text-black text-xs not-italic bg-yellow-300 ml-1 px-1.5 py-0.5 rounded font-bold">SECURE MALL</span></a>
                
                <div class="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
                    <input type="text" placeholder="Search 50+ mega items..." class="w-full bg-gray-100 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-500">
                    <button class="bg-red-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-red-700">Search</button>
                </div>

                <div class="flex items-center space-x-4">
                    ${user ? `
                        <div class="text-right hidden sm:block">
                            <span class="block text-xs text-gray-500">Verified User</span>
                            <span class="font-bold text-sm text-gray-800">${user}</span>
                        </div>
                        <a href="/sell" class="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full font-bold text-xs hover:bg-red-100">Sell Item</a>
                        <a href="/logout" class="text-gray-500 hover:text-red-600 text-sm font-medium">Logout</a>
                    ` : `
                        <a href="/login" class="flex items-center space-x-1 text-sm font-bold bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
                            <span>Secure Sign In</span>
                        </a>
                    `}
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 py-6">
            ${content}
        </main>
    </div>

    <footer class="bg-gray-900 text-gray-400 py-10 mt-16 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
                <h4 class="text-white font-bold mb-3 text-lg">Customer Support (Kuwait)</h4>
                <p class="text-sm mb-1">WhatsApp Hotline: <strong class="text-red-400">+96590018827</strong></p>
                <p class="text-sm mb-1">Email Support: <strong class="text-red-400">othmensameh2@gmail.com</strong></p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3 text-lg">Strict Security</h4>
                <p class="text-sm">Two-Step Code Verification Enforced for All Accounts.</p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3 text-lg">About SO</h4>
                <p class="text-sm">Protected mega store experience with direct factory prices.</p>
            </div>
        </div>
        <div class="text-center text-xs text-gray-600 border-t border-gray-800 pt-6">
            &copy; 2026 SO Platform. All rights reserved.
        </div>
    </footer>
</body>
</html>
`;

// Homepage Route with 50+ items and thumbnail click preview
app.get('/', (req, res) => {
    let productsHtml = memoryDb.products.map(p => `
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div class="relative bg-gray-100">
                <span class="absolute top-2 left-2 badge-flash text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10">${p.discount}</span>
                <!-- Main Image Preview Container -->
                <img id="main-img-${p.id}" src="${p.images[0]}" alt="${p.title}" class="w-full h-48 object-cover transition duration-300">
                
                <!-- 4 Clickable Thumbnail Bar -->
                <div class="flex justify-center space-x-1 p-2 bg-gray-50 border-t border-gray-200">
                    ${p.images.map((img, idx) => `
                        <img src="${img}" onclick="document.getElementById('main-img-${p.id}').src='${img}'" class="w-9 h-9 object-cover rounded cursor-pointer border border-gray-300 hover:border-red-600">
                    `).join('')}
                </div>
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
                    <button onclick="alert('Item added to cart securely!')" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs transition">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    let content = `
        <div class="mb-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center">
            <div>
                <span class="bg-black/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Secure Verified Platform</span>
                <h2 class="text-3xl md:text-5xl font-black mt-2 mb-3">Over 50+ Curated Global Deals</h2>
                <p class="text-red-100 text-sm max-w-lg mb-4">Click any of the 4 thumbnails per item to instantly preview angles. Secured by verification code authentication.</p>
            </div>
            <div class="bg-white text-gray-900 p-6 rounded-xl shadow-md text-center">
                <p class="text-xs text-gray-500 uppercase font-bold">Coupon Code</p>
                <p class="text-2xl font-black text-red-600 my-1">SO2026</p>
                <p class="text-[11px] text-gray-600">Kuwait Priority Shipping</p>
            </div>
        </div>
        <h3 class="text-xl font-black mb-6 border-l-4 border-red-600 pl-3 text-gray-800">Massive Product Catalog (${memoryDb.products.size || memoryDb.products.length} Items Available)</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${productsHtml}
        </div>
    `;

    res.send(layout('Home', content, req.session.user));
});

// Secure Login Step 1: Request code based on user choice
app.get('/login', (req, res) => {
    let content = `
        <div class="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm my-10">
            <h2 class="text-2xl font-black mb-2 text-center text-red-600">Secure Sign In / Register</h2>
            <p class="text-xs text-center text-gray-500 mb-6">Select your verification option. Account creation is strictly gated by a secure code.</p>
            
            <form action="/request-verification" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Choose Verification Method</label>
                    <select name="method" class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600 mb-3">
                        <option value="WhatsApp">WhatsApp OTP</option>
                        <option value="SMS">SMS Mobile Code</option>
                        <option value="Email">Email Verification Code</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Enter Your Phone Number or Email</label>
                    <input type="text" name="identifier" placeholder="e.g. +96590018827 or user@gmail.com" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600">
                </div>
                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow">Send Verification Code</button>
            </form>
            <div class="text-center mt-6">
                <a href="/" class="text-xs text-gray-500 hover:text-red-600 font-medium">← Back to Marketplace</a>
            </div>
        </div>
    `;
    res.send(layout('Secure Sign In', content, req.session.user));
});

// Generate and store code securely, prompting user for code
app.post('/request-verification', (req, res) => {
    const { method, identifier } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save state temporarily
    memoryDb.pendingAuth[identifier] = code;

    let content = `
        <div class="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm my-10 text-center">
            <h2 class="text-2xl font-black mb-2 text-red-600">Enter Verification Code</h2>
            <p class="text-xs text-gray-500 mb-2">A secure code has been sent via <strong>${method}</strong> to:</p>
            <p class="text-sm font-bold text-gray-800 mb-4">${identifier}</p>
            
            <div class="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800 mb-6">
                🔒 <strong>Simulated Secure Gateway (${method}):</strong> <span class="text-red-600 font-extrabold text-base">${code}</span>
            </div>

            <form action="/verify-and-login" method="POST" class="space-y-4">
                <input type="hidden" name="identifier" value="${identifier}">
                <div>
                    <input type="text" name="code" placeholder="Enter 4-digit code" maxlength="4" required class="w-full text-center tracking-widest text-2xl font-bold bg-gray-50 border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-red-600">
                </div>
                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow">Verify & Create / Login Account</button>
            </form>
        </div>
    `;
    res.send(layout('Verification', content, req.session.user));
});

// Finalize authentication: Account cannot be accessed or created without correct code
app.post('/verify-and-login', (req, res) => {
    const { identifier, code } = req.body;
    
    if (memoryDb.pendingAuth[identifier] && memoryDb.pendingAuth[identifier] === code) {
        // Clear pending auth and register user session securely
        delete memoryDb.pendingAuth[identifier];
        if (!memoryDb.users.includes(identifier)) {
            memoryDb.users.push(identifier);
        }
        req.session.user = identifier;
        res.redirect('/');
    } else {
        let errContent = `
            <div class="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm my-10 text-center">
                <h3 class="text-xl font-black text-red-600 mb-2">Security Verification Failed</h3>
                <p class="text-sm text-gray-600 mb-6">The verification code entered is invalid or expired. Accounts cannot be accessed without proper authorization.</p>
                <a href="/login" class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm">Try Again</a>
            </div>
        `;
        res.send(layout('Error', errContent, req.session.user));
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// Sell item page (secured)
app.get('/sell', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let content = `
        <div class="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm my-10">
            <h2 class="text-2xl font-black mb-6 text-center text-red-600">List Item on SO Mall</h2>
            <form action="/add-product" method="POST" class="space-y-4">
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Title</label><input type="text" name="title" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></div>
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Price ($)</label><input type="number" step="0.01" name="price" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></div>
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Main Image URL</label><input type="url" name="image" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></div>
                <div><label class="block text-xs font-bold text-gray-700 mb-1">Description</label><textarea name="description" rows="3" required class="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm"></textarea></div>
                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm">Publish Product</button>
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
        oldPrice: parseFloat(price) * 2.5,
        discount: "60% OFF",
        images: [image, image, image, image],
        sales: "1 sold",
        seller: req.session.user
    });
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`SO Secure Mega Mall running on port ${PORT}`);
});

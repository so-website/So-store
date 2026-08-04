const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const memoryDb = {
    users: [],
    pendingAuth: {},
    products: []
};

for (let i = 1; i <= 50; i++) {
    memoryDb.products.push({
        id: i,
        title: `Elite Luxury Signature Item #${i}`,
        price: parseFloat((Math.random() * 150 + 50).toFixed(2)),
        oldPrice: parseFloat((Math.random() * 300 + 200).toFixed(2)),
        discount: "VIP EXCLUSIVE",
        // Panoramic landscape images (16:9 ratio)
        images: [
            `https://picsum.photos/seed/lux${i}a/800/450`,
            `https://picsum.photos/seed/lux${i}b/800/450`,
            `https://picsum.photos/seed/lux${i}c/800/450`,
            `https://picsum.photos/seed/lux${i}d/800/450`
        ],
        sales: `${Math.floor(Math.random() * 10 + 1)}K+ acquired`,
        seller: "SO Luxury Vault"
    });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secure_so_lux_999',
    resave: false,
    saveUninitialized: true
}));

const layout = (title, content, user) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SO Luxury Collection</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0b0b0b] text-gray-100 font-sans min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-black">
    <div>
        <!-- Panoramic Luxurious Gold Header & Web Logo -->
        <div class="w-full bg-gradient-to-r from-black via-[#141414] to-black py-5 px-6 shadow-2xl border-b border-amber-500/30">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <a href="/" class="flex items-center space-x-4 group">
                    <div class="bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 text-black font-black tracking-widest px-5 py-2.5 rounded-xl text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">SO</div>
                    <div>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 font-black tracking-wider text-xl uppercase block leading-none">SO LUXURY VAULT</span>
                        <span class="text-amber-500/70 text-[10px] tracking-[0.3em] uppercase font-semibold">Kuwait • Exclusive Private Club</span>
                    </div>
                </a>
                <div class="flex items-center space-x-6">
                    <button onclick="toggleCart()" class="relative bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black px-6 py-2.5 rounded-full font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-600/20 transition">
                        <span>🛒 Basket</span>
                        <span id="cart-badge" class="bg-black text-amber-400 px-2 py-0.5 rounded-full text-xs font-black">0</span>
                    </button>
                    ${user ? `<span class="font-bold text-sm text-amber-300 hidden md:inline">${user}</span><a href="/logout" class="text-gray-400 hover:text-amber-400 text-sm font-medium transition">Logout</a>` : `<a href="/login" class="bg-[#1f1f1f] border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black px-5 py-2.5 rounded-full text-xs font-bold transition">Sign In</a>`}
                </div>
            </div>
        </div>

        <div class="bg-gradient-to-r from-amber-900/40 via-yellow-600/20 to-amber-900/40 border-y border-amber-500/20 text-amber-300 text-xs font-bold text-center py-2 px-4 shadow-inner">
            ✨ VIP Secure Encryption Enabled: Encrypted Multi-Asset Vault Active.
        </div>

        <main class="max-w-7xl mx-auto px-4 py-8">${content}</main>
    </div>

    <!-- Slide-out Basket Drawer -->
    <div id="cart-drawer" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#121212] text-gray-100 shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col justify-between border-l border-amber-500/30">
        <div class="p-6 border-b border-gray-800 flex justify-between items-center bg-black">
            <h3 class="font-black text-lg text-amber-400">Your Luxury Basket</h3>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-white font-bold text-xl">&times;</button>
        </div>
        <div id="cart-items-container" class="p-6 flex-1 overflow-y-auto space-y-4">
            <p class="text-gray-500 text-sm text-center py-10">Your basket is currently pristine & empty.</p>
        </div>
        <div class="p-6 border-t border-gray-800 bg-[#181818]">
            <div class="flex justify-between font-bold text-base mb-4">
                <span class="text-gray-400">Total Vault Value:</span>
                <span id="cart-total-price" class="text-amber-400">$0.00</span>
            </div>
            <button onclick="openCheckout()" class="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black py-3 rounded-xl font-black text-sm shadow-lg shadow-amber-600/20 transition">Proceed to Secure Checkout</button>
        </div>
    </div>

    <!-- Checkout Modal with Payment Methods -->
    <div id="checkout-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-[#141414] border border-amber-500/40 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onclick="closeCheckout()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl">&times;</button>
            <h3 class="text-xl font-black text-amber-400 mb-4 border-b border-gray-800 pb-2">Select VIP Payment Method</h3>
            <form action="/checkout" method="POST" class="space-y-4">
                <div class="space-y-2">
                    <label class="flex items-center space-x-3 p-3.5 bg-[#1c1c1c] border border-gray-800 rounded-xl cursor-pointer hover:border-amber-500/60 transition">
                        <input type="radio" name="paymentMethod" value="Bank Card" checked class="text-amber-500 focus:ring-amber-500">
                        <div>
                            <p class="font-bold text-sm text-gray-200">Elite Credit / Debit Card</p>
                            <p class="text-xs text-gray-400">Secured via encrypted global banking networks & KNET.</p>
                        </div>
                    </label>
                    <label class="flex items-center space-x-3 p-3.5 bg-[#1c1c1c] border border-gray-800 rounded-xl cursor-pointer hover:border-amber-500/60 transition">
                        <input type="radio" name="paymentMethod" value="Crypto Currency" class="text-amber-500 focus:ring-amber-500">
                        <div>
                            <p class="font-bold text-sm text-gray-200">Cryptocurrency (USDT / BTC / ETH)</p>
                            <p class="text-xs text-gray-400">Decentralized high-tier anonymous blockchain settlement.</p>
                        </div>
                    </label>
                    <label class="flex items-center space-x-3 p-3.5 bg-[#1c1c1c] border border-gray-800 rounded-xl cursor-pointer hover:border-amber-500/60 transition">
                        <input type="radio" name="paymentMethod" value="Cash on Delivery" class="text-amber-500 focus:ring-amber-500">
                        <div>
                            <p class="font-bold text-sm text-gray-200">Cash on Delivery (COD)</p>
                            <p class="text-xs text-gray-400">Hand-delivered securely directly to your private residence in Kuwait.</p>
                        </div>
                    </label>
                </div>
                <div>
                    <label class="block text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider">Private Delivery Address in Kuwait</label>
                    <input type="text" name="address" placeholder="Area, Block, Street, Villa/Building" required class="w-full bg-[#1c1c1c] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500">
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black py-3 rounded-xl font-black text-sm shadow-lg shadow-amber-600/20 transition">Confirm Secure Order</button>
            </form>
        </div>
    </div>

    <footer class="bg-black text-gray-500 py-6 text-center text-xs border-t border-gray-900 mt-12">
        &copy; 2026 SO Luxury Vault. Kuwait Concierge Hotline: +96590018827
    </footer>

    <script>
        let cart = [];

        function addToCart(id, title, price, image) {
            let existing = cart.find(item => item.id === id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ id, title, price, image, qty: 1 });
            }
            updateCartUI();
            alert('Item securely added to your basket!');
        }

        function updateCartUI() {
            let badge = document.getElementById('cart-badge');
            let container = document.getElementById('cart-items-container');
            let totalEl = document.getElementById('cart-total-price');

            let totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
            let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

            badge.innerText = totalCount;
            totalEl.innerText = '$' + totalPrice.toFixed(2);

            if (cart.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-sm text-center py-10">Your basket is currently pristine & empty.</p>';
                return;
            }

            container.innerHTML = cart.map(item => \`
                <div class="flex items-center justify-between border-b border-gray-800 pb-3">
                    <img src="\${item.image}" class="w-16 h-10 object-cover rounded-lg border border-gray-700">
                    <div class="flex-1 px-3">
                        <h4 class="text-xs font-bold text-gray-200 line-clamp-1">\${item.title}</h4>
                        <p class="text-xs text-amber-400 font-extrabold">$\${item.price} x \${item.qty}</p>
                    </div>
                    <button onclick="removeFromCart(\${item.id})" class="text-red-400 hover:text-red-300 font-bold text-xs bg-red-950/40 border border-red-900/50 px-2.5 py-1 rounded">Remove</button>
                </div>
            \`).join('');
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }

        function toggleCart() {
            let drawer = document.getElementById('cart-drawer');
            drawer.classList.toggle('translate-x-full');
        }

        function openCheckout() {
            if (cart.length === 0) {
                alert('Your basket is empty!');
                return;
            }
            toggleCart();
            document.getElementById('checkout-modal').classList.remove('hidden');
        }

        function closeCheckout() {
            document.getElementById('checkout-modal').classList.add('hidden');
        }
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    let productsHtml = memoryDb.products.map(p => `
        <div class="bg-[#141414] border border-gray-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition duration-300">
            <div class="relative bg-black">
                <span class="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow">${p.discount}</span>
                <!-- Panoramic 16:9 Image Container -->
                <img id="img-${p.id}" src="${p.images[0]}" class="w-full h-44 object-cover group-hover:scale-105 transition duration-500">
                <div class="flex justify-center space-x-1.5 p-2 bg-[#1a1a1a] border-t border-gray-800">
                    ${p.images.map((img) => `<img src="${img}" onclick="document.getElementById('img-${p.id}').src='${img}'" class="w-10 h-6 object-cover rounded cursor-pointer border border-gray-700 hover:border-amber-400 transition">`).join('')}
                </div>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h4 class="font-bold text-sm mb-2 text-gray-200 line-clamp-2">${p.title}</h4>
                    <div class="flex items-baseline space-x-2 mb-4">
                        <span class="text-amber-400 font-black text-lg">$${p.price}</span>
                        <span class="text-gray-500 text-xs line-through">$${p.oldPrice}</span>
                    </div>
                </div>
                <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.images[0]}')" class="w-full bg-[#1f1f1f] border border-amber-500/40 group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-yellow-500 text-amber-400 group-hover:text-black font-black py-2.5 rounded-xl text-xs transition duration-300 shadow">Acquire to Basket</button>
            </div>
        </div>
    `).join('');
    res.send(layout('Home', `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${productsHtml}</div>`, req.session.user));
});

app.get('/login', (req, res) => {
    res.send(layout('Sign In', `
        <div class="max-w-md mx-auto bg-[#141414] border border-amber-500/40 p-8 rounded-2xl shadow-2xl my-10">
            <h2 class="text-2xl font-black mb-4 text-center text-amber-400">Secure VIP Sign In</h2>
            <form action="/request-otp" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider">Verification Channel</label>
                    <select name="method" class="w-full bg-[#1c1c1c] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500">
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="SMS">SMS Text Message</option>
                        <option value="Gmail">Gmail / Email</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider">Phone Number or Email</label>
                    <input type="text" name="identifier" placeholder="+96590018827 or email@domain.com" required class="w-full bg-[#1c1c1c] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500">
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black py-3 rounded-xl font-black text-sm shadow-lg shadow-amber-600/20 transition">Send Verification Code</button>
            </form>
        </div>
    `, req.session.user));
});

app.post('/request-otp', async (req, res) => {
    const { method, identifier } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    memoryDb.pendingAuth[identifier] = otp;

    res.send(layout('Verify', `
        <div class="max-w-md mx-auto bg-[#141414] border border-amber-500/40 p-8 rounded-2xl shadow-2xl my-10 text-center">
            <h2 class="text-2xl font-black mb-2 text-amber-400">Check Your ${method}</h2>
            <p class="text-xs text-gray-400 mb-2">We sent a secure verification code to <strong>${identifier}</strong>.</p>
            <div class="bg-black border border-amber-500/30 p-4 rounded-xl text-xs text-gray-300 mb-6 shadow-inner">
                🔒 <strong>Console Code Hint:</strong> <span class="text-amber-400 font-extrabold text-base tracking-widest">${otp}</span>
            </div>
            <form action="/verify-otp" method="POST" class="space-y-4">
                <input type="hidden" name="identifier" value="${identifier}">
                <input type="text" name="code" placeholder="Enter 6-digit code" maxlength="6" required class="w-full text-center tracking-widest text-2xl font-bold bg-[#1c1c1c] border border-gray-800 rounded-xl p-3 text-amber-400 focus:outline-none focus:border-amber-500">
                <button type="submit" class="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black py-3 rounded-xl font-black text-sm shadow-lg shadow-amber-600/20 transition">Verify & Unlock Vault</button>
            </form>
        </div>
    `, req.session.user));
});

app.post('/verify-otp', (req, res) => {
    const { identifier, code } = req.body;
    if (memoryDb.pendingAuth[identifier] && memoryDb.pendingAuth[identifier] === code) {
        delete memoryDb.pendingAuth[identifier];
        if (!memoryDb.users.includes(identifier)) memoryDb.users.push(identifier);
        req.session.user = identifier;
        res.redirect('/');
    } else {
        res.send(layout('Error', `<div class="max-w-md mx-auto text-center py-20"><h3 class="text-xl font-bold text-red-400 mb-2">Invalid or Expired Code</h3><a href="/login" class="bg-gradient-to-r from-amber-600 to-yellow-500 text-black px-6 py-2.5 rounded-full text-sm font-bold shadow">Try Again</a></div>`, req.session.user));
    }
});

app.post('/checkout', (req, res) => {
    const { paymentMethod, address } = req.body;
    res.send(layout('Order Success', `
        <div class="max-w-md mx-auto bg-[#141414] border border-amber-500/40 p-8 rounded-2xl shadow-2xl my-10 text-center">
            <div class="w-16 h-16 bg-amber-500/20 border border-amber-500 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg shadow-amber-500/10">✓</div>
            <h2 class="text-2xl font-black text-gray-100 mb-2">Vault Order Placed Successfully!</h2>
            <p class="text-xs text-gray-400 mb-2">Settlement Method: <strong class="text-amber-400">${paymentMethod}</strong></p>
            <p class="text-xs text-gray-400 mb-6">Concierge Delivery Address: <strong class="text-gray-200">${address}</strong></p>
            <a href="/" class="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-amber-600/20 transition">Return to Vault</a>
        </div>
    `, req.session.user));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.listen(PORT, () => console.log(`Luxury Server running on port ${PORT}`));

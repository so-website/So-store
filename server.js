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
        title: `Mega Trending Item #${i}`,
        price: parseFloat((Math.random() * 25 + 5).toFixed(2)),
        oldPrice: parseFloat((Math.random() * 60 + 35).toFixed(2)),
        discount: "70% OFF",
        images: [
            `https://picsum.photos/seed/item${i}a/500/500`,
            `https://picsum.photos/seed/item${i}b/500/500`,
            `https://picsum.photos/seed/item${i}c/500/500`,
            `https://picsum.photos/seed/item${i}d/500/500`
        ],
        sales: `${Math.floor(Math.random() * 30 + 5)}K+ sold`,
        seller: "SO Verified"
    });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secure_so_key_999',
    resave: false,
    saveUninitialized: true
}));

const layout = (title, content, user) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SO Secure Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col justify-between">
    <div>
        <!-- Panoramic Web Logo Header Banner -->
        <div class="w-full bg-gradient-to-r from-black via-gray-900 to-red-950 py-4 px-6 shadow-md border-b border-red-600/30">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <a href="/" class="flex items-center space-x-3 group">
                    <div class="bg-red-600 text-white font-black tracking-widest px-4 py-2 rounded-lg text-xl shadow-lg group-hover:scale-105 transition">SO</div>
                    <div>
                        <span class="text-white font-black tracking-wider text-lg uppercase block leading-none">Secure Global Platform</span>
                        <span class="text-red-400 text-xs tracking-widest uppercase font-semibold">Kuwait • Direct Mega Store</span>
                    </div>
                </a>
                <div class="flex items-center space-x-6">
                    <button onclick="toggleCart()" class="relative bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold text-xs flex items-center space-x-2 shadow transition">
                        <span>🛒 Basket</span>
                        <span id="cart-badge" class="bg-yellow-300 text-black px-2 py-0.5 rounded-full text-xs font-black">0</span>
                    </button>
                    ${user ? `<span class="font-bold text-sm text-gray-200 hidden md:inline">${user}</span><a href="/logout" class="text-red-400 hover:text-red-300 text-sm font-medium">Logout</a>` : `<a href="/login" class="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-100">Sign In</a>`}
                </div>
            </div>
        </div>

        <div class="bg-red-600 text-white text-xs font-bold text-center py-2 px-4 shadow-inner">
            🔒 High Security Mode Active: Multiple Verified Checkout Options Available.
        </div>

        <main class="max-w-7xl mx-auto px-4 py-6">${content}</main>
    </div>

    <!-- Slide-out Basket Drawer -->
    <div id="cart-drawer" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col justify-between border-l border-gray-200">
        <div class="p-6 border-b flex justify-between items-center bg-gray-900 text-white">
            <h3 class="font-black text-lg">Your Secure Shopping Basket</h3>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-white font-bold text-xl">&times;</button>
        </div>
        <div id="cart-items-container" class="p-6 flex-1 overflow-y-auto space-y-4">
            <p class="text-gray-500 text-sm text-center py-10">Your basket is currently empty.</p>
        </div>
        <div class="p-6 border-t bg-gray-50">
            <div class="flex justify-between font-bold text-base mb-4">
                <span>Total Subtotal:</span>
                <span id="cart-total-price" class="text-red-600">$0.00</span>
            </div>
            <button onclick="openCheckout()" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow">Proceed to Secure Checkout</button>
        </div>
    </div>

    <!-- Checkout Modal with Payment Methods -->
    <div id="checkout-modal" class="fixed inset-0 z-50 bg-black/60 hidden flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onclick="closeCheckout()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            <h3 class="text-xl font-black text-gray-900 mb-4 border-b pb-2">Select Payment Method</h3>
            <form action="/checkout" method="POST" class="space-y-4">
                <div class="space-y-2">
                    <label class="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-red-50">
                        <input type="radio" name="paymentMethod" value="Bank Card" checked class="text-red-600 focus:ring-red-500">
                        <div>
                            <p class="font-bold text-sm">Credit / Debit Bank Card</p>
                            <p class="text-xs text-gray-500">Secure Visa, Mastercard, or local Kuwait KNET gateway.</p>
                        </div>
                    </label>
                    <label class="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-red-50">
                        <input type="radio" name="paymentMethod" value="Crypto Currency" class="text-red-600 focus:ring-red-500">
                        <div>
                            <p class="font-bold text-sm">Cryptocurrency (USDT / BTC)</p>
                            <p class="text-xs text-gray-500">Instant decentralized peer-to-peer secure settlement.</p>
                        </div>
                    </label>
                    <label class="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-red-50">
                        <input type="radio" name="paymentMethod" value="Cash on Delivery" class="text-red-600 focus:ring-red-500">
                        <div>
                            <p class="font-bold text-sm">Cash on Delivery (COD)</p>
                            <p class="text-xs text-gray-500">Pay securely with cash upon delivery at your doorstep in Kuwait.</p>
                        </div>
                    </label>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Delivery Address in Kuwait</label>
                    <input type="text" name="address" placeholder="Area, Block, Street, House/Building" required class="w-full bg-gray-50 border rounded-xl p-3 text-sm focus:outline-none focus:border-red-600">
                </div>
                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow">Confirm Order</button>
            </form>
        </div>
    </div>

    <footer class="bg-gray-900 text-gray-400 py-6 text-center text-xs border-t border-gray-800 mt-12">
        &copy; 2026 SO Platform. Kuwait Hotline: +96590018827
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
            alert('Item added to your basket!');
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
                container.innerHTML = '<p class="text-gray-500 text-sm text-center py-10">Your basket is currently empty.</p>';
                return;
            }

            container.innerHTML = cart.map(item => \`
                <div class="flex items-center justify-between border-b pb-3">
                    <img src="\${item.image}" class="w-12 h-12 object-cover rounded-lg border">
                    <div class="flex-1 px-3">
                        <h4 class="text-xs font-bold text-gray-800 line-clamp-1">\${item.title}</h4>
                        <p class="text-xs text-red-600 font-extrabold">$\${item.price} x \${item.qty}</p>
                    </div>
                    <button onclick="removeFromCart(\${item.id})" class="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded">Remove</button>
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
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div class="relative bg-gray-100">
                <span class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10">${p.discount}</span>
                <img id="img-${p.id}" src="${p.images[0]}" class="w-full h-48 object-cover">
                <div class="flex justify-center space-x-1 p-2 bg-gray-50 border-t">
                    ${p.images.map((img) => `<img src="${img}" onclick="document.getElementById('img-${p.id}').src='${img}'" class="w-8 h-8 object-cover rounded cursor-pointer border hover:border-red-600">`).join('')}
                </div>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h4 class="font-medium text-sm mb-1 line-clamp-2">${p.title}</h4>
                    <div class="flex items-baseline space-x-2 mb-3">
                        <span class="text-red-600 font-extrabold text-lg">$${p.price}</span>
                        <span class="text-gray-400 text-xs line-through">$${p.oldPrice}</span>
                    </div>
                </div>
                <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.images[0]}')" class="w-full bg-gray-900 group-hover:bg-red-600 text-white font-bold py-2 rounded-lg text-xs transition">Add to Basket</button>
            </div>
        </div>
    `).join('');
    res.send(layout('Home', `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">${productsHtml}</div>`, req.session.user));
});

app.get('/login', (req, res) => {
    res.send(layout('Sign In', `
        <div class="max-w-md mx-auto bg-white border p-8 rounded-2xl shadow-sm my-10">
            <h2 class="text-2xl font-black mb-4 text-center text-red-600">Secure Sign In</h2>
            <form action="/request-otp" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Method</label>
                    <select name="method" class="w-full bg-gray-50 border rounded-xl p-3 text-sm">
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="SMS">SMS Text Message</option>
                        <option value="Gmail">Gmail / Email</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Phone Number or Email</label>
                    <input type="text" name="identifier" placeholder="+96590018827 or email@domain.com" required class="w-full bg-gray-50 border rounded-xl p-3 text-sm">
                </div>
                <button type="submit" class="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow">Send Verification Code</button>
            </form>
        </div>
    `, req.session.user));
});

app.post('/request-otp', async (req, res) => {
    const { method, identifier } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    memoryDb.pendingAuth[identifier] = otp;

    res.send(layout('Verify', `
        <div class="max-w-md mx-auto bg-white border p-8 rounded-2xl shadow-sm my-10 text-center">
            <h2 class="text-2xl font-black mb-2 text-red-600">Check Your ${method}</h2>
            <p class="text-xs text-gray-500 mb-2">We sent a 6-digit verification code to <strong>${identifier}</strong>.</p>
            <div class="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800 mb-6">
                🔒 <strong>Console Code Hint:</strong> <span class="text-red-600 font-extrabold text-base">${otp}</span>
            </div>
            <form action="/verify-otp" method="POST" class="space-y-4">
                <input type="hidden" name="identifier" value="${identifier}">
                <input type="text" name="code" placeholder="Enter 6-digit code" maxlength="6" required class="w-full text-center tracking-widest text-2xl font-bold bg-gray-50 border rounded-xl p-3">
                <button type="submit" class="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow">Verify & Access Account</button>
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
        res.send(layout('Error', `<div class="max-w-md mx-auto text-center py-20"><h3 class="text-xl font-bold text-red-600 mb-2">Invalid or Expired Code</h3><a href="/login" class="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold">Try Again</a></div>`, req.session.user));
    }
});

app.post('/checkout', (req, res) => {
    const { paymentMethod, address } = req.body;
    res.send(layout('Order Success', `
        <div class="max-w-md mx-auto bg-white border p-8 rounded-2xl shadow-sm my-10 text-center">
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
            <h2 class="text-2xl font-black text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p class="text-xs text-gray-600 mb-4">Payment Method: <strong class="text-red-600">${paymentMethod}</strong></p>
            <p class="text-xs text-gray-600 mb-6">Delivery Address: <strong>${address}</strong></p>
            <a href="/" class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow">Return to Store</a>
        </div>
    `, req.session.user));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));

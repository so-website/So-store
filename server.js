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
        <div class="bg-red-600 text-white text-xs font-bold text-center py-2 px-4">
            🔒 High Security Mode: OTP Verification Enforced.
        </div>
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <a href="/" class="text-3xl font-black italic tracking-tighter text-red-600">SO<span class="text-black text-xs not-italic bg-yellow-300 ml-1 px-1.5 py-0.5 rounded font-bold">SECURE</span></a>
                <div class="flex items-center space-x-4">
                    ${user ? `<span class="font-bold text-sm text-gray-800">${user}</span><a href="/logout" class="text-red-600 text-sm font-medium">Logout</a>` : `<a href="/login" class="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">Sign In</a>`}
                </div>
            </div>
        </header>
        <main class="max-w-7xl mx-auto px-4 py-6">${content}</main>
    </div>
    <footer class="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        &copy; 2026 SO Platform. Kuwait Hotline: +96590018827
    </footer>
</body>
</html>
`;

app.get('/', (req, res) => {
    let productsHtml = memoryDb.products.map(p => `
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div class="relative bg-gray-100">
                <img id="img-${p.id}" src="${p.images[0]}" class="w-full h-48 object-cover">
                <div class="flex justify-center space-x-1 p-2 bg-gray-50 border-t">
                    ${p.images.map((img) => `<img src="${img}" onclick="document.getElementById('img-${p.id}').src='${img}'" class="w-8 h-8 object-cover rounded cursor-pointer border hover:border-red-600">`).join('')}
                </div>
            </div>
            <div class="p-4">
                <h4 class="font-medium text-sm mb-1">${p.title}</h4>
                <div class="flex items-baseline space-x-2"><span class="text-red-600 font-extrabold text-lg">$${p.price}</span><span class="text-gray-400 text-xs line-through">$${p.oldPrice}</span></div>
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
                <button type="submit" class="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm">Send Verification Code</button>
            </form>
        </div>
    `, req.session.user));
});

app.post('/request-otp', async (req, res) => {
    const { method, identifier } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    memoryDb.pendingAuth[identifier] = otp;

    console.log(`[SECURE CODE] -> ${otp}`);

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
                <button type="submit" class="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm">Verify & Access Account</button>
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

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-Memory Database
const memoryDb = {
    users: [],
    products: [
        {
            id: 1,
            title: "SO Signature Smart Watch",
            price: 29.99,
            description: "High-end fitness and notification tracker, sleek design.",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            seller: "admin"
        },
        {
            id: 2,
            title: "Wireless Neon Earbuds",
            price: 19.99,
            description: "Immersive sound with deep bass and long battery life.",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            seller: "admin"
        }
    ],
    orders: []
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'so_store_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Main Homepage Route
app.get('/', (req, res) => {
    let productsHtml = memoryDb.products.map(p => `
        <div style="background:#18181b; border:1px solid #27272a; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
            <img src="${p.image}" alt="${p.title}" style="width:100%; height:192px; object-fit:cover;">
            <div style="padding:16px;">
                <h4 style="font-weight:bold; font-size:18px; margin-bottom:4px; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.title}</h4>
                <p style="color:#fbbf24; font-weight:extrabold; font-size:20px; margin-bottom:8px;">$${p.price.toFixed(2)}</p>
                <p style="color:#a1a1aa; font-size:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.description}</p>
                <span style="font-size:12px; color:#71717a; margin-top:12px; display:block;">Seller: ${p.seller}</span>
            </div>
            <div style="padding:16px; padding-top:0;">
                <button onclick="alert('Please use the desktop/browser view or check items below')" style="width:100%; background:#27272a; color:#fff; border:none; padding:10px; border-radius:12px; font-weight:bold; cursor:pointer;">View Product</button>
            </div>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SO - Global Marketplace</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-zinc-950 text-zinc-100 font-sans">
            <header class="border-b border-zinc-800 sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md">
                <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 class="text-3xl font-black tracking-widest text-amber-400">S O</h1>
                    <div class="flex items-center space-x-4">
                        ${req.session.user ? `<span class="text-sm text-zinc-400">Hi, ${req.session.user}</span><a href="/sell" class="bg-amber-400 text-zinc-950 px-4 py-2 rounded-full font-bold text-sm">Sell Item</a><a href="/logout" class="text-red-400 text-sm">Logout</a>` : `<a href="/login" class="text-sm hover:text-amber-400">Login</a><a href="/register" class="bg-amber-400 text-zinc-950 px-4 py-2 rounded-full font-bold text-sm">Sign Up</a>`}
                    </div>
                </div>
            </header>
            <section class="py-12 px-4 text-center bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
                <h2 class="text-4xl md:text-6xl font-extrabold mb-4">Everything You Want, Delivered by <span class="text-amber-400">SO</span></h2>
                <p class="text-zinc-400 max-w-xl mx-auto">Discover trending items, buy unique products, or launch your store instantly.</p>
            </section>
            <main class="max-w-7xl mx-auto px-4 py-12">
                <h3 class="text-2xl font-bold mb-6 border-l-4 border-amber-400 pl-3">Trending Products</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    ${productsHtml}
                </div>
            </main>
            <footer class="border-t border-zinc-800 mt-20 py-8 bg-zinc-900 text-center text-zinc-400 text-sm">
                <p class="mb-2">Need Help? Contact SO Customer Service:</p>
                <p class="font-bold text-amber-400">Phone/WhatsApp: +96590018827</p>
                <p class="font-bold text-amber-400">Email: othmensameh2@gmail.com</p>
                <p class="text-xs text-zinc-600 mt-4">&copy; 2026 SO Platform. All rights reserved.</p>
            </footer>
        </body>
        </html>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html><head><title>SO - Login</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-zinc-950 text-zinc-100 flex items-center justify-center h-screen">
            <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full">
                <h2 class="text-2xl font-extrabold mb-6 text-center text-amber-400">Welcome Back to SO</h2>
                <form action="/login" method="POST" class="space-y-4">
                    <div><label class="block text-xs text-zinc-400 mb-1">Username</label><input type="text" name="username" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></div>
                    <div><label class="block text-xs text-zinc-400 mb-1">Password</label><input type="password" name="password" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></div>
                    <button type="submit" class="w-full bg-amber-400 text-zinc-950 py-3 rounded-xl font-bold">Log In</button>
                </form>
                <p class="text-center text-sm text-zinc-500 mt-4"><a href="/" class="text-amber-400">← Back to Home</a></p>
            </div>
        </body></html>
    `);
});

app.get('/register', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html><head><title>SO - Sign Up</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-zinc-950 text-zinc-100 flex items-center justify-center h-screen">
            <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full">
                <h2 class="text-2xl font-extrabold mb-6 text-center text-amber-400">Join SO Platform</h2>
                <form action="/register" method="POST" class="space-y-4">
                    <div><label class="block text-xs text-zinc-400 mb-1">Username</label><input type="text" name="username" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></div>
                    <div><label class="block text-xs text-zinc-400 mb-1">Password</label><input type="password" name="password" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></div>
                    <button type="submit" class="w-full bg-amber-400 text-zinc-950 py-3 rounded-xl font-bold">Create Account</button>
                </form>
                <p class="text-center text-sm text-zinc-500 mt-4"><a href="/" class="text-amber-400">← Back to Home</a></p>
            </div>
        </body></html>
    `);
});

app.get('/sell', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.send(`
        <!DOCTYPE html>
        <html><head><title>SO - Sell</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-zinc-950 text-zinc-100 flex items-center justify-center min-h-screen py-10">
            <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full">
                <h2 class="text-2xl font-extrabold mb-6 text-center text-amber-400">List Your Item on SO</h2>
                <form action="/add-product" method="POST" class="space-y-4">
                    <div><label class="block text-xs text-zinc-400 mb-1">Title</label><input type="text" name="title" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></div>
                    <div><label class="block text-xs text-zinc-400 mb-1">Price ($)</label><input type="number" step="0.01" name="price" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></div>
                    <div><label class="block text-xs text-zinc-400 mb-1">Image URL</label><input type="url" name="image" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></div>
                    <div><label class="block text-xs text-zinc-400 mb-1">Description</label><textarea name="description" rows="3" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm"></textarea></div>
                    <button type="submit" class="w-full bg-amber-400 text-zinc-950 py-3 rounded-xl font-bold">Publish Product</button>
                </form>
                <p class="text-center text-sm text-zinc-500 mt-4"><a href="/" class="text-amber-400">← Back to Store</a></p>
            </div>
        </body></html>
    `);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    memoryDb.users.push({ username, password });
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = memoryDb.users.find(u => u.username === username && u.password === password);
    if (user || (username === "admin" && password === "admin")) {
        req.session.user = username;
        res.redirect('/');
    } else {
        res.send("Invalid credentials. <a href='/login'>Try again</a>");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.post('/add-product', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { title, price, description, image } = req.body;
    memoryDb.products.push({ id: Date.now(), title, price: parseFloat(price), description, image, seller: req.session.user });
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

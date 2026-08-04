const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-Memory Database for Cloud Hosting
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'so_store_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Set View Engine and absolute views path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { products: memoryDb.products, user: req.session.user });
});

app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/sell', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('sell');
});

// Auth Handlers
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const existingUser = memoryDb.users.find(u => u.username === username);
    if (existingUser) {
        return res.send("Error: Username already exists. <a href='/register'>Try again</a>");
    }
    memoryDb.users.push({ username, password });
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = memoryDb.users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user.username;
        res.redirect('/');
    } else {
        res.send("Invalid login credentials. <a href='/login'>Try again</a>");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// Product Upload Handler
app.post('/add-product', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { title, price, description, image } = req.body;
    memoryDb.products.push({
        id: Date.now(),
        title,
        price: parseFloat(price),
        description,
        image,
        seller: req.session.user
    });
    res.redirect('/');
});

// Checkout Handler
app.post('/checkout', (req, res) => {
    const { product_id, customer_name, address, phone, payment_method } = req.body;
    memoryDb.orders.push({
        id: Date.now(),
        product_id,
        customer_name,
        address,
        phone,
        payment_method
    });
    
    res.send(`<h2>Order Placed Successfully! 🎉</h2><p>Thank you for shopping with <strong>SO</strong>. We will contact you shortly.</p><a href="/">Back to Home</a>`);
});

app.listen(PORT, () => {
    console.log(`SO Store is running smoothly on port ${PORT}`);
});

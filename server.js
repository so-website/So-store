const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure database file exists securely
const dbFile = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ users: [], products: [], orders: [] }));
}

const adapter = new FileSync(dbFile);
const db = low(adapter);

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
    try {
        const products = db.get('products').value() || [];
        res.render('index', { products, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database loading error.");
    }
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
    const existingUser = db.get('users').find({ username }).value();
    if (existingUser) {
        return res.send("Error: Username already exists. <a href='/register'>Try again</a>");
    }
    db.get('users').push({ username, password }).write();
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.get('users').find({ username, password }).value();
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
    db.get('products').push({
        id: Date.now(),
        title,
        price: parseFloat(price),
        description,
        image,
        seller: req.session.user
    }).write();
    res.redirect('/');
});

// Checkout Handler
app.post('/checkout', (req, res) => {
    const { product_id, customer_name, address, phone, payment_method } = req.body;
    db.get('orders').push({
        id: Date.now(),
        product_id,
        customer_name,
        address,
        phone,
        payment_method
    }).write();
    
    res.send(`<h2>Order Placed Successfully! 🎉</h2><p>Thank you for shopping with <strong>SO</strong>. We will contact you shortly.</p><a href="/">Back to Home</a>`);
});

app.listen(PORT, () => {
    console.log(`SO Store is running smoothly on port ${PORT}`);
});

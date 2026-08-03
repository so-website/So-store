const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const app = express();
const PORT = 3000;

// Database Setup using Lowdb (JSON file storage)
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default data structure if db.json is empty
db.defaults({ users: [], products: [], orders: [] }).write();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'so_store_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Set View Engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    const products = db.get('products').value();
    res.render('index', { products, user: req.session.user });
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
    console.log(`SO Store is running smoothly at http://localhost:${PORT}`);
});

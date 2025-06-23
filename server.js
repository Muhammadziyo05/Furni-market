const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static fayllar
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/image', express.static(path.join(__dirname, 'image')));

// Routerni ulash
const authRouter = require('./js/login');
const pagesRouter = require('./js/route');
const deleteRouter = require('./js/users/delete');
const userData = require('./js/users/userData');
const paymant = require('./js/users/paymart');
const adminRoute = require('./js/admin/adminRoute');
const adminProductRouter = require('./js/admin/productRoute');
const supportRoute = require('./js/support');
const adminDeleteRoute = require('./js/admin/delete');

app.use(express.json());
app.use('/', supportRoute);

app.use('/', adminProductRouter);
app.use('/', pagesRouter);
app.use('/', authRouter);
app.use('/', deleteRouter);
app.use('/', userData);
app.use('/', paymant);
app.use('/', adminRoute);
app.use('/', adminDeleteRoute);

// cart.json fayl manzili
const CART_FILE = path.join(__dirname, 'data', 'cart.json');

// Savatchaga mahsulot qo‘shish
app.post('/add-to-cart', async (req, res) => {
  const { username, name, price, image } = req.body;

  if (!username || !name || !price || !image) {
    return res.status(400).json({ message: 'Maʼlumotlar toʻliq emas' });
  }

  let cartData = {};

  try {
    // Fayl o'qish
    const fileData = await fs.readFile(CART_FILE, 'utf-8');
    cartData = JSON.parse(fileData);
  } catch (err) {
    console.warn('Yangi cart.json yaratiladi yoki bo‘sh', err.message);
  }

  // Yangi foydalanuvchi bo‘lsa
  if (!cartData[username]) {
    cartData[username] = [];
  }

  // Mahsulotni qo‘shish
  cartData[username].push({
    name: name,
    price: price,
    image: image,
    quantity: 1
  });

  try {
    await fs.writeFile(CART_FILE, JSON.stringify(cartData, null, 2));
    res.json({ message: `"${name}" savatchaga qo‘shildi.` });
  } catch (err) {
    console.error("Saqlashda xatolik:", err);
    res.status(500).json({ message: "Faylga yozishda xatolik yuz berdi." });
  }
});

app.get('/cart/:username', async (req, res) => {
  const username = req.params.username;
  const CART_FILE = path.join(__dirname, 'data', 'cart.json');

  try {
    const fileData = await fs.readFile(CART_FILE, 'utf-8');
    const cartData = JSON.parse(fileData);

    const userCart = cartData[username] || [];
    res.json(userCart);
  } catch (err) {
    console.error("cart.json o‘qishda xatolik:", err);
    res.status(500).json({ message: "Savatchani o‘qishda xatolik" });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
});

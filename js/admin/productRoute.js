const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

const router = express.Router();
const PRODUCT_FILE = path.join(__dirname, '../../data', 'product.json');

// Multer sozlamasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../image')); // Rasmlar shu yerda saqlanadi
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// POST /admin/add-product
router.post('/admin/add-productcs', upload.single('image'), async (req, res) => {
  const { name, price, description, quantity } = req.body;
  const image = req.file;

  if (!name || !price || !description || !quantity || !image) {
    return res.status(400).json({ message: 'Barcha maydonlarni to‘ldiring' });
  }

  const imagePath = `/image/${image.filename}`;

  const newProduct = {
    name,
    price: parseInt(price),
    description,
    quantity: parseInt(quantity),
    image: imagePath
  };

  try {
    let products = [];
    try {
      const fileData = await fs.readFile(PRODUCT_FILE, 'utf-8');
      products = JSON.parse(fileData);
    } catch (e) {
      products = [];
    }

    products.push(newProduct);
    await fs.writeFile(PRODUCT_FILE, JSON.stringify(products, null, 2));

    res.json({ message: "✅ Mahsulot muvaffaqiyatli qo‘shildi." });
  } catch (err) {
    console.error("Saqlashda xatolik:", err);
    res.status(500).json({ message: "❌ Serverda xatolik yuz berdi." });
  }
});


router.get('/admin/productcs', async (req, res) => {
  try {
    const file = await fs.readFile(PRODUCT_FILE, 'utf-8');
    const products = JSON.parse(file);
    res.json(products);
  } catch (err) {
    console.error('Mahsulotlarni yuklashda xatolik:', err);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
});

router.delete('/admin/delete-productcs/:id', async (req, res) => {
  const id = req.params.id;

  const fileData = await fs.readFile('../../data/product.json', 'utf-8');
  const products = JSON.parse(fileData);
  const updated = products.filter(p => p.id !== id && p._id !== id);

  if (products.length === updated.length) {
    return res.status(404).json({ message: 'Mahsulot topilmadi' });
  }

  await fs.writeFile('../../data/product.json', JSON.stringify(updated, null, 2));
  res.json({ message: 'Mahsulot o‘chirildi' });
});


module.exports = router;

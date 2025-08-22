const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs').promises;

router.delete('/delete-productcs/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const products = JSON.parse(fs.readFileSync('../../data/products.json'));

  if (index >= 0 && index < products.length) {
    products.splice(index, 1);
    fs.writeFileSync('../../data/products.json', JSON.stringify(products, null, 2));
    return res.json({ message: "Mahsulot o‘chirildi." });
  }

  return res.status(400).json({ message: "Noto‘g‘ri indeks." });
});

module.exports = router;


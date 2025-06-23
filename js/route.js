const express = require('express');
const path = require('path');
const router = express.Router();

// HTML sahifalar manzillari
const staticRoutes = [
  { url: '/', file: 'index.html' },
  { url: '/index', file: 'index.html' },
  { url: '/services', file: 'services.html' },
  { url: '/about', file: 'about.html' },
  { url: '/contact', file: 'contact.html' },
  { url: '/blog', file: 'blog.html' },
  { url: '/shop', file: 'shop.html' },
  { url: '/login', file: 'login.html' },
  { url: '/signup', file: 'signup.html' },
  { url: '/exit', file: 'index.html' },
  { url: '/user/profile', file: 'users/index.html' },
  { url: '/user/shop', file: 'users/shop.html' },
  { url: '/user/cart', file: 'users/cart.html' },
  { url: '/user/tolov', file: 'users/tolov.html' },
  { url: '/admin/dashboard', file: '/admin/index.html' },
  { url: '/admin/products', file: '/admin/product.html' },
  { url: '/admin/users', file: '/admin/users.html' },
  { url: '/admin/payments', file: '/admin/payments.html' },
  { url: '/admin/message', file: '/admin/message.html' },
];


// Dinamik marshrutlar yaratish
staticRoutes.forEach(route => {
  router.get(route.url, (req, res) => {
    res.sendFile(path.join(__dirname, '../html', route.file));
  });
});


module.exports = router;

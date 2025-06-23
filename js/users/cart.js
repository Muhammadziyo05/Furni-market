
async function addToCart(productName, productPrice) {
  const username = localStorage.getItem("currentUser");
  if (!username) {
    alert("Iltimos, tizimga kiring.");
    return;
  }

  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, productName, productPrice })
    });

    const result = await response.json();
    if (response.ok) {
      alert(`"${productName}" savatchaga qo‘shildi.`);
    } else {
      alert("Xatolik: " + result.error);
    }
  } catch (err) {
    console.error("Xatolik:", err);
  }
}

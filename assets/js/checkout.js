/**
 * Seafood & Fresh Fish Market - Checkout Engine (checkout.js)
 */

(function () {
  const ORDERS_KEY = 'seafood_orders';

  function getOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY)) || getDefaultOrders();
    } catch (e) {
      return getDefaultOrders();
    }
  }

  function getDefaultOrders() {
    return [
      {
        orderId: 'SFM-8921',
        date: '2026-09-02',
        time: '08:30 AM',
        items: [
          { name: 'Norwegian Atlantic Salmon', weight: '1 kg', cut: 'Steaks', price: 1199, qty: 1 }
        ],
        amount: 1319,
        deliverySlot: 'Morning (07:00 AM - 10:00 AM)',
        status: 'Delivered',
        paymentMethod: 'UPI (Google Pay)',
        customer: {
          name: 'Sanjai Kumar',
          address: '42 Marine Drive, Bayview Heights, Chennai, Tamil Nadu - 600004'
        }
      },
      {
        orderId: 'SFM-8750',
        date: '2026-08-28',
        time: '04:15 PM',
        items: [
          { name: 'Jumbo Tiger Prawns', weight: '1 kg', cut: 'Peeled & Deveined', price: 799, qty: 2 },
          { name: 'Fresh Ocean Squid', weight: '500g', cut: 'Rings', price: 250, qty: 1 }
        ],
        amount: 1940,
        deliverySlot: 'Evening (04:00 PM - 07:00 PM)',
        status: 'Delivered',
        paymentMethod: 'Credit Card (ending 4021)',
        customer: {
          name: 'Sanjai Kumar',
          address: '42 Marine Drive, Bayview Heights, Chennai, Tamil Nadu - 600004'
        }
      }
    ];
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  function createOrder(orderData) {
    const orders = getOrders();
    orders.unshift(orderData);
    saveOrders(orders);
    window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { orders } }));
    return orderData;
  }

  function handleCheckoutFormSubmit(form) {
    const name = form.customerName?.value?.trim();
    const email = form.customerEmail?.value?.trim();
    const phone = form.customerPhone?.value?.trim();
    const address = form.customerAddress?.value?.trim();
    const city = form.customerCity?.value?.trim();
    const state = form.customerState?.value?.trim();
    const pincode = form.customerPincode?.value?.trim();
    const deliverySlot = form.deliverySlot?.value || 'Standard Morning (7 AM - 10 AM)';
    const instructions = form.deliveryNotes?.value?.trim() || '';

    // Payment method
    const paymentRadio = form.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = paymentRadio ? paymentRadio.value : 'Cash on Delivery';

    // Validation
    if (!name || name.length < 3) {
      if (window.showToast) window.showToast('Please enter your full name (minimum 3 characters)', 'warning');
      form.customerName?.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      if (window.showToast) window.showToast('Please enter a valid email address', 'warning');
      form.customerEmail?.focus();
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
      if (window.showToast) window.showToast('Please enter a valid 10-digit mobile number', 'warning');
      form.customerPhone?.focus();
      return false;
    }

    if (!address || address.length < 8) {
      if (window.showToast) window.showToast('Please provide your complete delivery street address', 'warning');
      form.customerAddress?.focus();
      return false;
    }

    if (!city) {
      if (window.showToast) window.showToast('Please provide your delivery city', 'warning');
      form.customerCity?.focus();
      return false;
    }

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      if (window.showToast) window.showToast('Please enter a valid 6-digit postal pincode', 'warning');
      form.customerPincode?.focus();
      return false;
    }

    // Card validation if card selected
    if (paymentMethod === 'Card') {
      const cardNumber = form.cardNumber?.value?.replace(/\s/g, '');
      const cardExpiry = form.cardExpiry?.value?.trim();
      const cardCvv = form.cardCvv?.value?.trim();

      if (!cardNumber || cardNumber.length < 15) {
        if (window.showToast) window.showToast('Please enter a valid card number', 'warning');
        return false;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        if (window.showToast) window.showToast('Please enter valid MM/YY card expiry', 'warning');
        return false;
      }
      if (!cardCvv || cardCvv.length < 3) {
        if (window.showToast) window.showToast('Please enter a valid 3-digit CVV', 'warning');
        return false;
      }
    }

    // Check cart
    const cart = window.CartManager?.get() || [];
    if (cart.length === 0) {
      if (window.showToast) window.showToast('Your cart is empty! Add seafood items before checking out.', 'warning');
      return false;
    }

    const calcs = window.CartManager.getCalculations();
    const orderId = 'SFM-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      orderId: orderId,
      date: formattedDate,
      time: formattedTime,
      items: cart.map(i => ({
        name: i.name,
        weight: `${i.weightKg} kg`,
        cut: i.cutType,
        price: i.pricePerKg,
        qty: i.quantity
      })),
      amount: calcs.total,
      deliverySlot: deliverySlot,
      status: 'Processing',
      paymentMethod: paymentMethod === 'Card' ? 'Credit/Debit Card' : paymentMethod,
      instructions: instructions,
      customer: {
        name: name,
        email: email,
        phone: phone,
        address: `${address}, ${city}, ${state} - ${pincode}`
      }
    };

    createOrder(newOrder);
    window.CartManager.clear();

    if (window.showToast) {
      window.showToast(`Success! Order ${orderId} placed successfully.`, 'success');
    }

    setTimeout(() => {
      window.location.href = `orders.html?placed=${orderId}`;
    }, 1000);

    return true;
  }

  window.CheckoutManager = {
    getOrders: getOrders,
    createOrder: createOrder,
    handleSubmit: handleCheckoutFormSubmit
  };
})();

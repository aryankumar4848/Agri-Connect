import React, { useEffect, useMemo, useState } from 'react';
import './CheckoutPage.css';

function CheckoutPage() {
  const [cartData, setCartData] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    street: '',
    phone: '',
    email: localStorage.getItem('email') || '',
  });

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/Cart/${email}`)
      .then((res) => res.json())
      .then((data) => setCartData(data || { items: [] }))
      .catch(() => setError('Could not fetch cart data.'));
  }, []);

  const subTotal = useMemo(
    () => (cartData?.items || []).reduce((sum, item) => sum + Number(item.price || 0), 0),
    [cartData]
  );

  const inputChangeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fname || !formData.street || !formData.phone) {
      setError('Please fill in required billing details.');
      return;
    }

    if (subTotal <= 0) {
      setError('Your cart total is empty. Add items before checkout.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payments/razorpay/create-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: subTotal,
          currency: 'INR',
          customerName: `${formData.fname} ${formData.lname}`.trim(),
          customerEmail: formData.email,
          customerPhone: formData.phone,
          referenceId: `agri_${Date.now()}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create payment link.');
      }

      if (!data.shortUrl) {
        throw new Error('Razorpay payment link not returned by API.');
      }

      window.location.href = data.shortUrl;
    } catch (err) {
      setError(err.message || 'Payment initialization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout_body">
      <div className="checkout_container">
        <div className="checkout_title">
          <h2>FarmCart Checkout</h2>
        </div>

        <div className="d-flex">
          <form onSubmit={submitHandler}>
            <label>
              <span className="fname">First Name <span className="required">*</span></span>
              <input type="text" name="fname" value={formData.fname} onChange={inputChangeHandler} />
            </label>
            <label>
              <span className="lname">Last Name</span>
              <input type="text" name="lname" value={formData.lname} onChange={inputChangeHandler} />
            </label>
            <label>
              <span>Address <span className="required">*</span></span>
              <input type="text" name="street" value={formData.street} onChange={inputChangeHandler} />
            </label>
            <label>
              <span>Phone <span className="required">*</span></span>
              <input type="tel" name="phone" value={formData.phone} onChange={inputChangeHandler} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" value={formData.email} onChange={inputChangeHandler} />
            </label>

            <div className="Yorder">
              <table>
                <thead>
                  <tr>
                    <th colSpan="2">Your Order</th>
                  </tr>
                </thead>
                <tbody>
                  {(cartData?.items || []).map((item) => (
                    <tr key={item._id || item.prod_id}>
                      <td>{item.name} x {item.quantity || 1}</td>
                      <td>Rs. {item.price}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Total</td>
                    <td>Rs. {subTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <button type="submit" className="checkout_button" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Generate Razorpay Payment Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

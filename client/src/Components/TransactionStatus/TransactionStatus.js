import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './TransactionStatus.css';

function TransactionStatus({ data }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verification, setVerification] = useState({ checking: false, verified: null, message: '' });

  const razorpayCallback = useMemo(
    () => ({
      razorpay_payment_link_id: searchParams.get('razorpay_payment_link_id') || '',
      razorpay_payment_link_reference_id: searchParams.get('razorpay_payment_link_reference_id') || '',
      razorpay_payment_link_status: searchParams.get('razorpay_payment_link_status') || '',
      razorpay_payment_id: searchParams.get('razorpay_payment_id') || '',
      razorpay_signature: searchParams.get('razorpay_signature') || '',
    }),
    [searchParams]
  );

  useEffect(() => {
    const hasRazorpayPayload = Boolean(
      razorpayCallback.razorpay_payment_link_id &&
        razorpayCallback.razorpay_payment_id &&
        razorpayCallback.razorpay_signature
    );

    if (!hasRazorpayPayload) {
      return;
    }

    const verify = async () => {
      setVerification({ checking: true, verified: null, message: '' });
      try {
        const query = new URLSearchParams(razorpayCallback).toString();
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/payments/razorpay/verify-link-signature?${query}`
        );
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          setVerification({
            checking: false,
            verified: false,
            message: payload.message || 'Payment verification failed.',
          });
          return;
        }

        setVerification({ checking: false, verified: true, message: 'Payment verified successfully.' });
      } catch (error) {
        setVerification({ checking: false, verified: false, message: 'Could not verify payment callback.' });
      }
    };

    verify();
  }, [razorpayCallback]);

  const provider =
    data?.provider || (razorpayCallback.razorpay_payment_link_id ? 'razorpay' : searchParams.get('provider')) || 'payment';

  const rawStatus =
    data?.status ||
    razorpayCallback.razorpay_payment_link_status ||
    searchParams.get('status') ||
    'pending';

  const isSuccess =
    verification.verified === true ||
    rawStatus === 'success' ||
    rawStatus === 'paid';

  const status = verification.verified === false ? 'failed' : rawStatus;

  const referenceId =
    razorpayCallback.razorpay_payment_id ||
    data?.paymentId ||
    data?.orderId ||
    searchParams.get('payment_id') ||
    `AGRI-${Date.now()}`;

  return (
    <div className="center-div">
      <div className="transaction-container">
        <div className="row">
          <div className="col no-gutters">
            <div className="transaction">
              <div className="transaction1-container">
                <h2 className="heading-3">
                  <u>{isSuccess ? 'Payment Successful :)' : 'Payment Not Completed'}</u>
                </h2>

                <h3>Provider: {provider}</h3>
                <h3>Status: {status}</h3>
                <h3>Name: {data?.fname || 'N/A'}</h3>
                <h3>Address: {data?.street || 'N/A'}</h3>
                <h3>Reference ID: {referenceId}</h3>
                {verification.checking && <h3>Verifying callback signature...</h3>}
                {!verification.checking && verification.message && <h3>{verification.message}</h3>}

                <div className="transaction_btn">
                  <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                  <button onClick={() => navigate('/Market')}>Continue Shopping</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionStatus;

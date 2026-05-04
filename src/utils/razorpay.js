const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let razorpayScriptPromise = null;

const loadRazorpayScript = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay checkout is only available in the browser'));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Razorpay), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

export const openRazorpayCheckout = async ({ razorpayKeyId, order, course, prefill }) => {
  const Razorpay = await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const instance = new Razorpay({
      key: razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Pilot Pathshala',
      description: `Purchase ${course.title}`,
      order_id: order.id,
      prefill: {
        name: prefill?.name || '',
        email: prefill?.email || ''
      },
      notes: {
        courseId: String(course.id),
        courseTitle: String(course.title || '')
      },
      theme: {
        color: '#1d4ed8'
      },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled'))
      }
    });

    instance.on('payment.failed', (event) => {
      reject(new Error(event?.error?.description || 'Payment failed'));
    });

    instance.open();
  });
};

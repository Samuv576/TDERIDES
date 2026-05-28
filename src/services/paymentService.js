export const paymentMethods = ['creditCard', 'mercadoPago', 'cash'];

export const simulatePayment = payment => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: `payment-${Date.now()}`,
        method: payment.method,
        amount: payment.amount,
        status: 'Approved',
        createdAt: new Date().toISOString(),
      });
    }, 1200);
  });
};

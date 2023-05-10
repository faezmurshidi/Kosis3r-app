const generateTransactionId = (centerid) => {
  const timestamp = Date.now();

  return `${centerid}-${timestamp}`;
};

export { generateTransactionId };

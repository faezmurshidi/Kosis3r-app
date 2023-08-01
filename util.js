const generateTransactionId = (centerid) => {
  const timestamp = Date.now().toString().substring(5);

  return `${centerid}-${timestamp}`;
};

export { generateTransactionId };

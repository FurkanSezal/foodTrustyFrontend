const productAddEventAbi = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: "address",
      name: "adder",
      type: "address",
    },
    {
      indexed: true,
      internalType: "uint256",
      name: "productId",
      type: "uint256",
    },
  ],
  name: "productAdd",
  type: "event",
};

module.exports = { productAddEventAbi };

const initState = [];

const cartReducer = (carts = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_ALL_CART":
      return payload;
    default:
      return carts;
  }
};

export default cartReducer;

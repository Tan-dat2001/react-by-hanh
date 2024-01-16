import { getAllCarts } from "../service/CartService";

export const findAllCarts = (appUserId) => async (dispatch) => {
  try {
    const res = await getAllCarts(appUserId);
    dispatch({
      type: "GET_ALL_CART",
      payload: res,
    });
  } catch (err) {
    console.log(err);
  }
};

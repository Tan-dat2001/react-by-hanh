import axios from "axios";

export async function getAllCarts(appUserId) {
  const res = await axios.get(
    `http://localhost:8080/carts?appUserId=${appUserId}`
  );
  return res.data;
}

export async function addToCart(appUserId, courseId) {
  const res = await axios.post(
    `http://localhost:8080/carts?appUserId=${appUserId}&courseId=${courseId}`
  );
  return res.data;
}

export async function deleteCart(cartId) {
  const res = await axios.delete(
    `http://localhost:8080/carts?cartId=${cartId}`
  );
  return res.data;
}

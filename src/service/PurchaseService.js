import axios from "axios";

export async function createPurchase(appUserId) {
  const res = await axios.post(
    `http://localhost:8080/purchases?appUserId=${appUserId}`
  );

  return res;
}

export async function getAllPurchases(appUserId) {
  const res = await axios.get(
    `http://localhost:8080/purchases?appUserId=${appUserId}`
  );

  return res.data;
}

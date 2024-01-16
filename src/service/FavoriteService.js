import axios from "axios";
export async function getAllFavorites(appUserId) {
  const res = await axios.get(
    `http://localhost:8080/favorites?appUserId=${appUserId}`
  );
  return res.data;
}

export async function addToFavorites(appUserId, courseId) {
  const res = await axios.post(
    `http://localhost:8080/favorites?appUserId=${appUserId}&courseId=${courseId}`
  );
  return res.data;
}

export async function checkFavorites(appUserId, courseId) {
  const res = await axios.get(
    `http://localhost:8080/favorites/check-favorite?appUserId=${appUserId}&courseId=${courseId}`
  );
  return res.data;
}

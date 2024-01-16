import axios from "axios";

export async function saveAnswerLike(appUserId, answerId) {
  const res = await axios.post(
    `http://localhost:8080/answer-likes/add?appUserId=${appUserId}&answerId=${answerId}`
  );
  return res.data;
}

export async function getAnswerLikes(appUserId, courseId) {
  const res = await axios.get(
    `http://localhost:8080/answer-likes/all?appUserId=${appUserId}&courseId=${courseId}`
  );
  return res.data;
}

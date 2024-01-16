import axios from "axios";

export async function saveQuestionLike(appUserId, questionId) {
  const res = await axios.post(
    `http://localhost:8080/question-likes/add?appUserId=${appUserId}&questionId=${questionId}`
  );
  return res.data;
}

export async function getQuestionLikes(appUserId, courseId) {
  const res = await axios.get(
    `http://localhost:8080/question-likes/all?appUserId=${appUserId}&courseId=${courseId}`
  );
  return res.data;
}

import axios from "axios";

export async function getAllComments(courseId) {
  const res = await axios.get(
    `http://localhost:8080/comments/all?courseId=${courseId}`
  );
  return res.data;
}

export async function saveComment(appUserId, courseId, commentText, rating) {
  const params = encodeURIComponent(commentText);
  const res = await axios.post(
    `http://localhost:8080/comments/review?appUserId=${appUserId}&courseId=${courseId}&commentText=${params}&rating=${rating}`
  );
  return res;
}

import axios from "axios";

// export async function getAllAnswers(questionId) {
//   const res = await axios.get(
//     `http://localhost:8080/questions/all?courseId=${courseId}`
//   );
//   return res.data;
// }

export async function saveReply(appUserId, questionId, answerText) {
  const params = encodeURIComponent(answerText);
  const res = await axios.post(
    `http://localhost:8080/answers/add?appUserId=${appUserId}&questionId=${questionId}&answerText=${params}`
  );
  return res;
}

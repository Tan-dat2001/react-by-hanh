import axios from "axios";

export async function getAllVideos(courseId) {
  const res = await axios.get(
    `http://localhost:8080/videos?courseId=${courseId}`
  );
  return res.data;
}

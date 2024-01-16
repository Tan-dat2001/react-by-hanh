import axios from "axios";

export async function getCourseTypes() {
  const res = await axios.get("http://localhost:8080/courseTypes");
  return res.data;
}

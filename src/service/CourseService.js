import axios from "axios";

export async function getAllCourse() {
  const res = await axios.get("http://localhost:8080/courses");
  return res.data;
}

export async function findCourse(courseId) {
  const res = await axios.get(
    `http://localhost:8080/courses/details?courseId=${courseId}`
  );
  return res.data;
}

export async function searchCourse(searchInfo) {
  const params = encodeURIComponent(searchInfo);
  const res = await axios.get(
    `http://localhost:8080/courses/search?searchInfo=${params}`
  );
  return res.data;
}

export async function searchAllCourses(
  searchInfo,
  numOfRating,
  topics,
  priceStart,
  priceEnd,
  sortBy
) {
  console.log("searchhhh");
  console.log(searchInfo);
  console.log(numOfRating);
  console.log(topics);
  console.log(priceStart);
  console.log(priceEnd);
  //        @RequestParam("searchInfo") String searchInfo,
  //        @RequestParam("numOfRating") int numOfRating,
  //        @RequestParam("topics")  List<String> topics,
  //        @RequestParam("priceStart") Double priceStart,
  //        @RequestParam("priceEnd") Double priceEnd

  const params = encodeURIComponent(searchInfo);

  const searchObj = {
    searchInfo: searchInfo,
    numOfRating: numOfRating,
    topics: topics,
    priceStart: priceStart,
    priceEnd: priceEnd,
    sortBy: sortBy,
  };
  console.log(searchObj);

  const res = await axios.post(
    `http://localhost:8080/courses/search-all`,
    searchObj
  );

  return res.data;
}

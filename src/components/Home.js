import React, { useEffect, useState } from "react";
import "../css/bootstrap.css";
import "../css/linearicons.css";
import "../css/font-awesome.min.css";
import "../css/bootstrap.css";
import "../css/magnific-popup.css";
import "../css/owl.carousel.css";
import "../css/hexagons.min.css";
import "../css/main.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Header from "./Header";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import { getAppUserInfoFromJwtToken } from "../service/LogInService";
import { getAllCourse } from "../service/CourseService";
import { addToCart } from "../service/CartService";
import { getAllFavorites, addToFavorites } from "../service/FavoriteService";
import { getAllPurchases } from "../service/PurchaseService";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { findAllCarts } from "../redux/cartAction";
import ReactStars from "react-rating-stars-component";
import SubSection from "./SubSection";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [appUser, setAppUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const dispatch = useDispatch();

  const firstExample = {
    size: 15,
    activeColor: "#f4ab20",
    edit: false,
  };

  const extractToken = () => {
    console.log("heheheh");
    const temp = getAppUserInfoFromJwtToken();
    if (temp !== null) {
      console.log("hi");
      console.log(temp.appUser);
      setAppUser(temp.appUser);
    }
  };

  const loadAllCourses = async () => {
    const data = await getAllCourse();
    setCourses(data);
    console.log(data);
  };

  const loadFavoriteCourses = async () => {
    const data = await getAllFavorites(appUser.id);
    setFavorites(data);
    console.log(data);
  };

  const loadMyCourses = async () => {
    const data = await getAllPurchases(appUser.id);
    setMyCourses(data);
    console.log("coursesss");
    console.log(data);
  };

 

  const handleHeartClick = async (courseId) => {
    if (appUser.id) {
      const data = await addToFavorites(appUser.id, courseId);
      setIsUpdated(!isUpdated);
    } else {
      Swal.fire(
        "Please sign in your account to use this function!",
        "",
        "warning"
      );
      navigate("/log-in");
    }
  };

  const handleAddToCart = async (courseId) => {
    if (!appUser.id) {
      Swal.fire("Please sign in your account!", "", "warning");
      navigate("/log-in");
    } else {
      const response = await addToCart(appUser.id, courseId);
      dispatch(findAllCarts(appUser.id));
      toast.info("Course added successfully!");
    }
  };

  useEffect(() => {
    extractToken();
  }, []);

  useEffect(() => {
    loadAllCourses();
  }, []);

 

  useEffect(() => {
    if (appUser.id) {
      loadMyCourses(appUser.id);
    }
  }, [appUser.id, isUpdated]);

  useEffect(() => {
    if (appUser.id) {
      loadFavoriteCourses(appUser.id);
    }
  }, [appUser.id, isUpdated]);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <Header />

      <section className="pt-5 mt-4">
        <div
          id="carouselExample"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active" style={{ height: "550px" }}>
              <img
                src="https://www.venturelessons.com/wp-content/uploads/2021/03/Business-English.jpg"
                className="d-block w-100 h-100"
                alt="..."
              />
            </div>
            <div className="carousel-item" style={{ height: "550px" }}>
              <img
                src="https://treecampus.in/wp-content/uploads/2022/09/1.png"
                className="d-block w-100 h-100"
                alt="..."
              />
            </div>
            <div className="carousel-item" style={{ height: "550px" }}>
              <img
                src="https://www.fastinfoclass.com/blogs/asset/upload/feature_images/Importance_of_English_Speaking_Course_copy.jpg"
                className="d-block w-100 h-100"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className=" each-kind mt-5 mx-5" id="IELTS">
          <h2 className="px-5 my-0 fw-bolder">Essential IELTS Courses</h2>
          <Carousel responsive={responsive}>
            {courses.length > 0 &&
              courses
                .filter((temp) => temp.course.courseType.name == "IELTS")
                .map((el) => {
                  return (
                    <div
                      key={`el-${el.course.id}`}
                      className="single-popular-course py-5 mb-3"
                      style={{ width: "270px" }}
                    >
                      <div className="thumb">
                        <div
                          style={{ height: "200px" }}
                          className=" d-flex justify-content-center"
                        >
                          <Link to={`/details/${el.course.id}`}>
                            <img
                              className=" w-100 h-100 mx-auto col"
                              src={el.course.image}
                              alt=""
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="details pb-3 px-1">
                        <Link to={`/details/${el.course.id}`}>
                          <h5 className=" fw-bolder">
                            {el.course.name} - Learn {el.course.courseType.name}{" "}
                            Course Online
                          </h5>
                        </Link>
                        <div className="d-flex flex-column justify-content-between">
                          <p className="name">{el.course.appUser.userName}</p>
                          <p className="value m-0">$ {el.course.price}</p>
                        </div>
                        <div className="bottom d-flex align-items-start flex-column align-items-start  justify-content-start">
                          <small className="star d-flex align-items-center">
                            {el.numOfRating > 0
                              ? Number.parseFloat(el.averageRating).toFixed(1)
                              : ""}
                            <ReactStars
                              key={el.averageRating}
                              value={el.averageRating}
                              {...firstExample}
                            />
                            ({el.numOfRating}{" "}
                            {el.numOfRating > 1 ? "ratings" : "rating"})
                          </small>
                          <small className="d-inline-block">
                            {el.numOfVideo} lectures • All levels •{" "}
                            {el.numOfStudent}{" "}
                            {el.numOfStudent > 1 ? "students" : "student"}
                          </small>
                        </div>
                        <div className="mt-3 mb-0 d-flex justify-content-between align-items-center">
                          {myCourses.find(
                            (temp) => temp.purchase.course.id == el.course.id
                          ) ? (
                            <Link
                              className=" btn btn-outline-primary back-btn w-75"
                              to={`/details/${el.course.id}`}
                            >
                              Go To Course →
                            </Link>
                          ) : (
                            <button
                              className=" btn btn-outline-success w-75"
                              onClick={() => handleAddToCart(el.course.id)}
                            >
                              Add to Cart
                            </button>
                          )}
                          {favorites.find(
                            (temp) => temp.favorites.course.id == el.course.id
                          ) ? (
                            <AiFillHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiFillHeart>
                          ) : (
                            <AiOutlineHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiOutlineHeart>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Carousel>
        </div>

        <div className=" each-kind mt-5 mx-5" id="TOEIC">
          <h2 className="px-5 my-0 fw-bolder">Essential TOEIC Courses</h2>
          <Carousel responsive={responsive}>
            {courses.length > 0 &&
              courses
                .filter((temp) => temp.course.courseType.name == "TOEIC")
                .map((el) => {
                  return (
                    <div
                      key={`el-${el.course.id}`}
                      className="single-popular-course py-5 mb-3"
                      style={{ width: "270px" }}
                    >
                      <div className="thumb">
                        <div
                          style={{ height: "200px" }}
                          className=" d-flex justify-content-center"
                        >
                          <Link to={`/details/${el.course.id}`}>
                            <img
                              className=" w-100 h-100 mx-auto col"
                              src={el.course.image}
                              alt=""
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="details pb-3 px-1">
                        <Link to={`/details/${el.course.id}`}>
                          <h5 className=" fw-bolder">
                            {el.course.name} - Learn {el.course.courseType.name}{" "}
                            Course Online
                          </h5>
                        </Link>
                        <div className="d-flex flex-column justify-content-between">
                          <p className="name">{el.course.appUser.userName}</p>
                          <p className="value m-0">$ {el.course.price}</p>
                        </div>
                        <div className="bottom d-flex align-items-start flex-column align-items-start  justify-content-start">
                          <small className="star d-flex align-items-center">
                            {el.numOfRating > 0
                              ? Number.parseFloat(el.averageRating).toFixed(1)
                              : ""}
                            <ReactStars
                              key={el.averageRating}
                              value={el.averageRating}
                              {...firstExample}
                            />
                            ({el.numOfRating}{" "}
                            {el.numOfRating > 1 ? "ratings" : "rating"})
                          </small>
                          <small className="d-inline-block">
                            {el.numOfVideo} lectures • All levels •{" "}
                            {el.numOfStudent}{" "}
                            {el.numOfStudent > 1 ? "students" : "student"}
                          </small>
                        </div>
                        <div className="mt-3 mb-0 d-flex justify-content-between align-items-center">
                          {myCourses.find(
                            (temp) => temp.purchase.course.id == el.course.id
                          ) ? (
                            <Link
                              className=" btn btn-outline-primary back-btn w-75"
                              to={`/details/${el.course.id}`}
                            >
                              Go To Course →
                            </Link>
                          ) : (
                            <button
                              className=" btn btn-outline-success w-75"
                              onClick={() => handleAddToCart(el.course.id)}
                            >
                              Add to Cart
                            </button>
                          )}
                          {favorites.find(
                            (temp) => temp.favorites.course.id == el.course.id
                          ) ? (
                            <AiFillHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiFillHeart>
                          ) : (
                            <AiOutlineHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiOutlineHeart>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Carousel>
        </div>

        <div className=" each-kind mt-5 mx-5" id="TOEFL">
          <h2 className="px-5 my-0 fw-bolder">Essential TOEFL Courses</h2>
          <Carousel responsive={responsive}>
            {courses.length > 0 &&
              courses
                .filter((temp) => temp.course.courseType.name == "TOEFL")
                .map((el) => {
                  return (
                    <div
                      key={`el-${el.course.id}`}
                      className="single-popular-course py-5 mb-3"
                      style={{ width: "270px" }}
                    >
                      <div className="thumb">
                        <div
                          style={{ height: "200px" }}
                          className=" d-flex justify-content-center"
                        >
                          <Link to={`/details/${el.course.id}`}>
                            <img
                              className=" w-100 h-100 mx-auto col"
                              src={el.course.image}
                              alt=""
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="details pb-3 px-1">
                        <Link to={`/details/${el.course.id}`}>
                          <h5 className=" fw-bolder">
                            {el.course.name} - Learn {el.course.courseType.name}{" "}
                            Course Online
                          </h5>
                        </Link>
                        <div className="d-flex flex-column justify-content-between">
                          <p className="name">{el.course.appUser.userName}</p>
                          <p className="value m-0">$ {el.course.price}</p>
                        </div>
                        <div className="bottom d-flex align-items-start flex-column align-items-start  justify-content-start">
                          <small className="star d-flex align-items-center">
                            {el.numOfRating > 0
                              ? Number.parseFloat(el.averageRating).toFixed(1)
                              : ""}
                            <ReactStars
                              key={el.averageRating}
                              value={el.averageRating}
                              {...firstExample}
                            />
                            ({el.numOfRating}{" "}
                            {el.numOfRating > 1 ? "ratings" : "rating"})
                          </small>
                          <small className="d-inline-block">
                            {el.numOfVideo} lectures • All levels •{" "}
                            {el.numOfStudent}{" "}
                            {el.numOfStudent > 1 ? "students" : "student"}
                          </small>
                        </div>
                        <div className="mt-3 mb-0 d-flex justify-content-between align-items-center">
                          {myCourses.find(
                            (temp) => temp.purchase.course.id == el.course.id
                          ) ? (
                            <Link
                              className=" btn btn-outline-primary back-btn w-75"
                              to={`/details/${el.course.id}`}
                            >
                              Go To Course →
                            </Link>
                          ) : (
                            <button
                              className=" btn btn-outline-success w-75"
                              onClick={() => handleAddToCart(el.course.id)}
                            >
                              Add to Cart
                            </button>
                          )}
                          {favorites.find(
                            (temp) => temp.favorites.course.id == el.course.id
                          ) ? (
                            <AiFillHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiFillHeart>
                          ) : (
                            <AiOutlineHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiOutlineHeart>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Carousel>
        </div>

        <div className=" each-kind mt-5 mx-5" id="DAILY CONVERSATION">
          <h2 className="px-5 my-0 fw-bolder">
            Essential DAILY CONVERSATION Courses
          </h2>
          <Carousel responsive={responsive}>
            {courses.length > 0 &&
              courses
                .filter(
                  (temp) => temp.course.courseType.name == "DAILY CONVERSATION"
                )
                .map((el) => {
                  return (
                    <div
                      key={`el-${el.course.id}`}
                      className="single-popular-course py-5 mb-3"
                      style={{ width: "270px" }}
                    >
                      <div className="thumb">
                        <div
                          style={{ height: "200px" }}
                          className=" d-flex justify-content-center"
                        >
                          <Link to={`/details/${el.course.id}`}>
                            <img
                              className=" w-100 h-100 mx-auto col"
                              src={el.course.image}
                              alt=""
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="details pb-3 px-1">
                        <Link to={`/details/${el.course.id}`}>
                          <h5 className=" fw-bolder">
                            {el.course.name} - Learn {el.course.courseType.name}{" "}
                            Course Online
                          </h5>
                        </Link>
                        <div className="d-flex flex-column justify-content-between">
                          <p className="name">{el.course.appUser.userName}</p>
                          <p className="value m-0">$ {el.course.price}</p>
                        </div>
                        <div className="bottom d-flex align-items-start flex-column align-items-start  justify-content-start">
                          <small className="star d-flex align-items-center">
                            {el.numOfRating > 0
                              ? Number.parseFloat(el.averageRating).toFixed(1)
                              : ""}
                            <ReactStars
                              key={el.averageRating}
                              value={el.averageRating}
                              {...firstExample}
                            />
                            ({el.numOfRating}{" "}
                            {el.numOfRating > 1 ? "ratings" : "rating"})
                          </small>
                          <small className="d-inline-block">
                            {el.numOfVideo} lectures • All levels •{" "}
                            {el.numOfStudent}{" "}
                            {el.numOfStudent > 1 ? "students" : "student"}
                          </small>
                        </div>
                        <div className="mt-3 mb-0 d-flex justify-content-between align-items-center">
                          {myCourses.find(
                            (temp) => temp.purchase.course.id == el.course.id
                          ) ? (
                            <Link
                              className=" btn btn-outline-primary back-btn w-75"
                              to={`/details/${el.course.id}`}
                            >
                              Go To Course →
                            </Link>
                          ) : (
                            <button
                              className=" btn btn-outline-success w-75"
                              onClick={() => handleAddToCart(el.course.id)}
                            >
                              Add to Cart
                            </button>
                          )}
                          {favorites.find(
                            (temp) => temp.favorites.course.id == el.course.id
                          ) ? (
                            <AiFillHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiFillHeart>
                          ) : (
                            <AiOutlineHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiOutlineHeart>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Carousel>
        </div>

        <div className=" each-kind mt-5 mx-5" id="ENGLISH SPEAKING">
          <h2 className="px-5 my-0 fw-bolder">
            Essential ENGLISH SPEAKING Courses
          </h2>
          <Carousel responsive={responsive}>
            {courses.length > 0 &&
              courses
                .filter(
                  (temp) => temp.course.courseType.name == "ENGLISH SPEAKING"
                )
                .map((el) => {
                  return (
                    <div
                      key={`el-${el.course.id}`}
                      className="single-popular-course py-5 mb-3"
                      style={{ width: "270px" }}
                    >
                      <div className="thumb">
                        <div
                          style={{ height: "200px" }}
                          className=" d-flex justify-content-center"
                        >
                          <Link to={`/details/${el.course.id}`}>
                            <img
                              className=" w-100 h-100 mx-auto col"
                              src={el.course.image}
                              alt=""
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="details pb-3 px-1">
                        <Link to={`/details/${el.course.id}`}>
                          <h5 className=" fw-bolder">
                            {el.course.name} - Learn {el.course.courseType.name}{" "}
                            Course Online
                          </h5>
                        </Link>
                        <div className="d-flex flex-column justify-content-between">
                          <p className="name">{el.course.appUser.userName}</p>
                          <p className="value m-0">$ {el.course.price}</p>
                        </div>
                        <div className="bottom d-flex align-items-start flex-column align-items-start  justify-content-start">
                          <small className="star d-flex align-items-center">
                            {el.numOfRating > 0
                              ? Number.parseFloat(el.averageRating).toFixed(1)
                              : ""}
                            <ReactStars
                              key={el.averageRating}
                              value={el.averageRating}
                              {...firstExample}
                            />
                            ({el.numOfRating}{" "}
                            {el.numOfRating > 1 ? "ratings" : "rating"})
                          </small>
                          <small className="d-inline-block">
                            {el.numOfVideo} lectures • All levels •{" "}
                            {el.numOfStudent}{" "}
                            {el.numOfStudent > 1 ? "students" : "student"}
                          </small>
                        </div>
                        <div className="mt-3 mb-0 d-flex justify-content-between align-items-center">
                          {myCourses.find(
                            (temp) => temp.purchase.course.id == el.course.id
                          ) ? (
                            <Link
                              className=" btn btn-outline-primary back-btn w-75"
                              to={`/details/${el.course.id}`}
                            >
                              Go To Course →
                            </Link>
                          ) : (
                            <button
                              className=" btn btn-outline-success w-75"
                              onClick={() => handleAddToCart(el.course.id)}
                            >
                              Add to Cart
                            </button>
                          )}
                          {favorites.find(
                            (temp) => temp.favorites.course.id == el.course.id
                          ) ? (
                            <AiFillHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiFillHeart>
                          ) : (
                            <AiOutlineHeart
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#DB7093",
                              }}
                              onClick={() => handleHeartClick(el.course.id)}
                            ></AiOutlineHeart>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Carousel>
        </div>
      </section>

      <SubSection />

      <Footer />
      <ToastContainer autoClose={2000} className="toast-position" />
    </>
  );
}

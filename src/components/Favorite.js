import React, { useEffect, useState } from "react";
import { getAllFavorites, addToFavorites } from "../service/FavoriteService";
import { addToCart } from "../service/CartService";
import { Link, useNavigate } from "react-router-dom";
import { getAppUserInfoFromJwtToken } from "../service/LogInService";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { getAllPurchases } from "../service/PurchaseService";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { findAllCarts } from "../redux/cartAction";
import ReactStars from "react-rating-stars-component";
import SubSection from "./SubSection";

export default function Favorite() {
  const [appUser, setAppUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();
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
    if (appUser.id) {
      loadMyCourses(appUser.id);
    }
  }, [appUser.id, isUpdated]);

  useEffect(() => {
    if (appUser.id) {
      loadFavoriteCourses(appUser.id);
      window.scrollTo(0, 0);
    }
  }, [appUser.id, isUpdated]);

  return (
    <>
      <Header />
      <h1
        style={{ marginTop: "100px" }}
        className="mb-0 p-0 fw-bolder text-center"
      >
        My WishList{" "}
        <AiFillHeart
          style={{ color: "palevioletred", height: "30px", width: "30px" }}
        ></AiFillHeart>
      </h1>
      <div
        className=" row justify-content-center row-cols-md-4 row-cols-2 gap-4"
        style={{ marginTop: "50px" }}
      >
        {favorites.length > 0 ? (
          favorites.map((el) => {
            return (
              <div
                key={`el-${el.favorites.id}`}
                className="single-popular-course mb-3"
                style={{ width: "300px" }}
              >
                <div className="thumb">
                  <div
                    style={{ height: "200px" }}
                    className=" d-flex justify-content-center"
                  >
                    <Link to={`/details/${el.favorites.course.id}`}>
                      <img
                        className=" w-100 h-100 mx-auto col"
                        src={el.favorites.course.image}
                        alt=""
                      />
                    </Link>
                  </div>
                </div>
                <div className="details pb-3 px-1">
                  <Link to={`/details/${el.favorites.course.id}`}>
                    <h5 className=" fw-bolder">
                      {el.favorites.course.name} - Learn{" "}
                      {el.favorites.course.courseType.name} Course Online
                    </h5>
                  </Link>
                  <div className="d-flex flex-column justify-content-between">
                    <p className="name">
                      {el.favorites.course.appUser.userName}
                    </p>
                    <p className="value m-0">$ {el.favorites.course.price}</p>
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
                      {el.numOfVideo} lectures • All levels • {el.numOfStudent}{" "}
                      {el.numOfStudent > 1 ? "students" : "student"}
                    </small>
                  </div>
                  <div className="mt-3 mb-0 d-flex justify-content-between align-items-center">
                    {myCourses.find(
                      (temp) =>
                        temp.purchase.course.id == el.favorites.course.id
                    ) ? (
                      <Link
                        className=" btn btn-outline-primary back-btn w-75"
                        to={`/details/${el.favorites.course.id}`}
                      >
                        Go To Course →
                      </Link>
                    ) : (
                      <button
                        className=" btn btn-outline-success w-75"
                        onClick={() => handleAddToCart(el.favorites.course.id)}
                      >
                        Add to Cart
                      </button>
                    )}
                    {favorites.find(
                      (temp) =>
                        temp.favorites.course.id == el.favorites.course.id
                    ) ? (
                      <AiFillHeart
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#DB7093",
                        }}
                        onClick={() => handleHeartClick(el.favorites.course.id)}
                      ></AiFillHeart>
                    ) : (
                      <AiOutlineHeart
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#DB7093",
                        }}
                        onClick={() => handleHeartClick(el.favorites.course.id)}
                      ></AiOutlineHeart>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <img
                src="https://s.udemycdn.com/browse_components/flyout/empty-shopping-cart-v2-2x.jpg"
                className=" w-100"
              ></img>
              <div>
                <Link to="/" className="btn payment-btn fw-bold py-2">
                  ← Browse courses now
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      <SubSection />

      <ToastContainer autoClose={2000} className="toast-position" />
      <Footer />
    </>
  );
}

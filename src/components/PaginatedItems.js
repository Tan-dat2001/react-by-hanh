import React, { useEffect, useState, useLayoutEffect } from "react";
import { getAllFavorites, addToFavorites } from "../service/FavoriteService";
import { addToCart } from "../service/CartService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAppUserInfoFromJwtToken } from "../service/LogInService";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineClear,
  AiOutlineFilter,
} from "react-icons/ai";

import {
  FiShoppingCart,
  FiTv,
  FiFastForward,
  FiSkipBack,
} from "react-icons/fi";

import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { getAllPurchases } from "../service/PurchaseService";
import { searchAllCourses } from "../service/CourseService";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { findAllCarts } from "../redux/cartAction";
import ReactStars from "react-rating-stars-component";
import SubSection from "./SubSection";
import ReactPaginate from "react-paginate";
import { getCourseTypes } from "../service/CourseTypeService";
import "../css/header.css";
import Slider from "react-slider";

export default function PaginatedItems() {
  const [courses, setCourses] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [appUser, setAppUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const location = useLocation();
  const [searchInfo, setSearchInfo] = useState(
    location.state && location.state.searchInfo ? location.state.searchInfo : ""
  );
  const [numOfStar, setNumOfStar] = useState(-1);
  const [topics, setTopics] = useState([]);
  const [numOfFilter, setNumOfFilter] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState([0, 100]);

  const handleChangeThumbs = (newValues) => {
    let thumb0 = document.querySelector(".thumb.thumb-0");
    thumb0.style.setProperty(
      "--before-content-0",
      `'${newValues[0].toString()}'`
    );
    let thumb1 = document.querySelector(".thumb.thumb-1");
    thumb1.style.setProperty(
      "--before-content-100",
      `'${newValues[1].toString()}'`
    );
  };

  const handleChange = (newValues) => {
    setValues(newValues);
    handleChangeThumbs(newValues);
    setIsUpdated(!isUpdated);
  };

  const handleTopicSearch = async (id) => {
    topics.find((el) => el == id)
      ? setTopics((prev) => prev.filter((el) => el != id))
      : setTopics((prev) => [...prev, id]);
    console.log(topics);
    setIsUpdated(!isUpdated);
  };

  const handleRatingSearch = (rating) => {
    setNumOfStar(rating);
    console.log(rating);
    setIsUpdated(!isUpdated);
  };

  const handleSortByChange = (event) => {
    console.log(event.target.value);
    setSortBy(event.target.value);
    setIsUpdated(!isUpdated);
  };

  const handleSearchAll = async () => {
    const data = await searchAllCourses(
      searchInfo,
      numOfStar,
      topics,
      values[0],
      values[1],
      sortBy
    );
    console.log(data);
    setCourses(data);
  };

  const checkNumOfFilter = () => {
    let totalFilters = 0;
    if (numOfStar != -1) totalFilters += 1;
    if (values[0] != 0 || values[1] != 100) totalFilters += 1;
    if (topics.length > 0) totalFilters += topics.length;
    setNumOfFilter(totalFilters);
  };

  const firstExample = {
    size: 15,

    color: "lightgrey",

    edit: false,
  };

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;
  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = courses.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(courses.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % courses.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
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

  const handleClearFilter = () => {
    handleChange([0, 100]);
    setTopics([]);
    setNumOfStar(-1);
    setIsUpdated(!isUpdated);
    let inputs = document.querySelectorAll(
      'input[type="checkbox"], input[type="radio"]'
    );
    inputs.forEach(function (input) {
      input.checked = false;
    });
  };


  const loadCourseTypes = async () => {
    const data = await getCourseTypes();
    setCourseTypes(data);
  };

  useEffect(() => {
    setSearchInfo(
      location.state && location.state.searchInfo
        ? location.state.searchInfo
        : ""
    );
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
    handleSearchAll();
  }, [searchInfo]);

  useEffect(() => {
    loadCourseTypes();
  }, []);

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
    }
  }, [appUser.id, isUpdated]);

  useEffect(() => {
    checkNumOfFilter();
    handleSearchAll();
  }, [isUpdated]);

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((el) => (
            <tr key={`el_${el.course.id}`}>
              <td>
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-start">
                  <img
                    src={el.course.image}
                    style={{
                      width: "7rem",
                      height: "7rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/details/${el.course.id}`)}
                  />
                </div>
              </td>

              <td className=" text-center align-middle fw-bold">
                <div
                  style={{ cursor: "pointer" }}
                  className=" d-flex flex-column align-items-start justify-content-center mx-2"
                  onClick={() => navigate(`/details/${el.course.id}`)}
                >
                  <p className="m-0">{el.course.name}</p>
                  <small>{el.course.appUser.userName}</small>
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
                </div>
              </td>
              <td
                className="align-middle text-center fw-bold"
                style={{ color: "#9435f3", fontSize: "18px" }}
              >
                ${el.course.price}
              </td>

              <td className="align-middle text-center">
                {myCourses.find(
                  (temp) => temp.purchase.course.id == el.course.id
                ) ? (
                  <Link
                    className=" btn btn-outline-primary back-btn w-75"
                    to={`/details/${el.course.id}`}
                  >
                    <FiTv></FiTv>
                  </Link>
                ) : (
                  <button
                    className=" btn btn-outline-success w-75"
                    onClick={() => handleAddToCart(el.course.id)}
                  >
                    <FiShoppingCart></FiShoppingCart>
                  </button>
                )}
              </td>

              {/*                            total price*/}

              <td className="align-middle">
                {favorites.find(
                  (temp) => temp.favorites.course.id == el.course.id
                ) ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      border: "1px solid palevioletred",
                      borderRadius: "100px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <AiFillHeart
                      style={{
                        width: "25px",
                        height: "25px",
                        color: "#DB7093",
                        cursor: "pointer",
                      }}
                      onClick={() => handleHeartClick(el.course.id)}
                    ></AiFillHeart>
                  </div>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      border: "1px solid palevioletred",
                      borderRadius: "100px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <AiOutlineHeart
                      style={{
                        width: "25px",
                        height: "25px",
                        color: "#DB7093",
                        cursor: "pointer",
                      }}
                      onClick={() => handleHeartClick(el.course.id)}
                    ></AiOutlineHeart>
                  </div>
                )}
              </td>
            </tr>
          ))}
      </>
    );
  }

  return (
    <>
      <Header searchInfo={searchInfo} />

      <div
        style={{ marginTop: "100px" }}
        className=" d-flex justify-content-between"
      >
        <h1 className=" fw-bold px-5 mb-0  ">
          {courses.length} {courses.length > 1 ? "results" : "result"} for "
          {searchInfo}"
        </h1>
      </div>
      <div className=" d-flex align-items-center gap-2 mx-5 mt-3">
        <div
          className=" fs-5 p-3"
          style={{ border: "1px solid #5b85d1", color: "#5b85d1" }}
        >
          <AiOutlineFilter></AiOutlineFilter>
          <small className="fs-6 fw-bold"> Filter ({numOfFilter})</small>{" "}
        </div>
        <div
          className="  p-2"
          style={{ border: "1px solid #5b85d1", color: "#5b85d1" }}
        >
          <small className=" fw-bold">Sort by</small>
          <select
            onChange={(event) => handleSortByChange(event)}
            name="sortBy"
            id="sortBy"
            className=" border-0"
            style={{ color: "#5b85d1", outline: "none" }}
          >
            <option value="newest">Newest</option>
            <option value="rate">Highest Rated</option>
            <option value="review">Most Reviewed</option>
          </select>
        </div>

        {numOfFilter > 0 && (
          <button
            onClick={handleClearFilter}
            className="btn fs-5 p-1"
            style={{ color: "#5b85d1" }}
          >
            <small className="fs-6">Clear Filters</small>{" "}
            <AiOutlineClear></AiOutlineClear>
          </button>
        )}
      </div>

      <div className=" d-flex justify-content-end ">
        <small className=" fw-bold text-secondary px-5">
          {courses.length} {courses.length > 1 ? "results" : "result"}
        </small>
      </div>
      <div className=" row justify-content-center row-cols-md-4 row-cols-2 gap-1 px-5 mt-1">
        <div className="container w-100 ">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-3 col-xl-3 container ">
              <h4 className=" fw-bold">Ratings</h4>
              <div className=" d-flex">
                <input
                  type="radio"
                  id="rating5"
                  name="rating"
                  value="5"
                  onChange={() => handleRatingSearch(5)}
                ></input>
                <ReactStars
                  classNames="mx-1"
                  key={5}
                  value={5}
                  {...firstExample}
                />
                <small> 5 🥰</small>
              </div>
              <div className=" d-flex">
                <input
                  type="radio"
                  id="rating4"
                  name="rating"
                  value="4"
                  onChange={() => handleRatingSearch(4)}
                ></input>
                <ReactStars
                  classNames="mx-1"
                  key={4}
                  value={4}
                  {...firstExample}
                />
                <small> 4 & up</small>
              </div>
              <div className="d-flex">
                <input
                  type="radio"
                  id="rating3"
                  name="rating"
                  value="3"
                  onChange={() => handleRatingSearch(3)}
                ></input>
                <ReactStars
                  classNames="mx-1"
                  key={3}
                  value={3}
                  {...firstExample}
                />{" "}
                <small> 3 & up</small>
              </div>
              <div className="d-flex">
                <input
                  type="radio"
                  id="rating2"
                  name="rating"
                  value="2"
                  onChange={() => handleRatingSearch(2)}
                ></input>
                <ReactStars
                  classNames="mx-1"
                  key={2}
                  value={2}
                  {...firstExample}
                />
                <small> 2 & up</small>
              </div>
              <div className=" d-flex">
                <input
                  type="radio"
                  id="rating1"
                  name="rating"
                  value="1"
                  onChange={() => handleRatingSearch(1)}
                ></input>
                <ReactStars
                  classNames="mx-1"
                  key={1}
                  value={1}
                  {...firstExample}
                />{" "}
                <small>1 & up</small>
              </div>

              <hr />

              {/* search for type */}
              <h4 className=" fw-bold">Topic</h4>
              {courseTypes.length > 0 &&
                courseTypes.map((el) => {
                  return (
                    <div key={`type-${el.id}`}>
                      <input
                        type="checkbox"
                        id={el.id}
                        name={el.name}
                        value={el.id}
                        onChange={() => handleTopicSearch(el.id)}
                      />
                      <label
                        for={el.id}
                        className=" ms-2 mb-0"
                        style={{ fontSize: "12px" }}
                      >
                        {el.name}
                      </label>
                      <br></br>
                    </div>
                  );
                })}

              {/* slider */}
              <hr />

              <>
                <h4 className=" fw-bold mb-0">Price Range</h4>
                <br></br>

                <Slider
                  className="slider"
                  value={values}
                  onAfterChange={handleChange}
                  onChange={handleChangeThumbs}
                  min={0}
                  max={222}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <small className="thumb thumb-0 fw-bold">$0</small>

                  <small className="thumb thumb-1 fw-bold">$222</small>
                  <div className=" d-none">
                    <label htmlFor="minPrice">Min Price:</label>
                    <input
                      type="number"
                      id="minPrice"
                      value={values[0]}
                      onChange={(e) =>
                        handleChange([+e.target.value, values[1]])
                      }
                    />
                  </div>
                  <div className=" d-none">
                    <label htmlFor="maxPrice">Max Price:</label>
                    <input
                      type="number"
                      id="maxPrice"
                      value={values[1]}
                      onChange={(e) =>
                        handleChange([values[0], +e.target.value])
                      }
                    />
                  </div>
                </div>
              </>
            </div>

            <div className=" col col-sm-12 col-md-12 col-lg-9 col-xl-9">
              <div className=" d-flex flex-column justify-content-center align-items-center">
                {courses.length > 0 ? (
                  <table className="table table-hover">
                    <tbody>
                      <Items currentItems={currentItems} />
                    </tbody>
                  </table>
                ) : (
                  <>
                    <div className="d-flex justify-content-center align-items-center flex-column">
                      <img src="https://s.udemycdn.com/browse_components/flyout/empty-shopping-cart-v2-2x.jpg"></img>
                      <p className="col col-md-12  mb-3 text-center fs-5">
                        Sorry, we couldn't find any results for
                        <h5 className=" fw-bold d-inline ms-2">
                          "{searchInfo}"
                        </h5>
                        <h6 className=" fw-bold mt-2">
                          Try adjusting your search. Here are some ideas:
                        </h6>
                        <div className=" d-flex justify-content-center">
                          <ul
                            style={{
                              listStyleType: "disc",
                              paddingLeft: "0px",
                            }}
                            className="d-flex flex-column justify-content-start"
                          >
                            <li className="p-0 text-start fs-6">
                              Make sure all words are spelled correctly
                            </li>
                            <li className="p-0 text-start fs-6">
                              Try different search terms
                            </li>
                            <li className="p-0 text-start fs-6">
                              Try more general search terms
                            </li>
                          </ul>
                        </div>
                      </p>
                      <div>
                        <Link to="/" className="btn payment-btn fw-bold">
                          ← Back to Home
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" d-flex justify-content-center mt-3">
        <ReactPaginate
          nextLabel={<FiFastForward></FiFastForward>}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel={<FiSkipBack></FiSkipBack>}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
      <ToastContainer autoClose={2000} className="toast-position" />
      <Footer />
    </>
  );
}

import React, { useEffect, useState } from "react";
import { getAllPurchases } from "../service/PurchaseService";
import { Link } from "react-router-dom";
import { getAppUserInfoFromJwtToken } from "../service/LogInService";
import { AiFillHeart } from "react-icons/ai";
import Header from "./Header";
import Footer from "./Footer";
import ReactStars from "react-rating-stars-component";
import SubSection from "./SubSection";

export default function MyLearning() {
  const [appUser, setAppUser] = useState({});
  const [myCourses, setMyCourses] = useState([]);

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

  const loadMyCourses = async () => {
    const data = await getAllPurchases(appUser.id);
    setMyCourses(data);
    console.log(data);
  };

  useEffect(() => {
    extractToken();
  }, []);

  useEffect(() => {
    if (appUser.id) {
      loadMyCourses(appUser.id);
      window.scrollTo(0, 0);
    }
  }, [appUser.id]);

  return (
    <>
      <Header />
      <h1
        style={{ marginTop: "100px" }}
        className="mb-0 p-0 fw-bolder text-center"
      >
        My Learning{" "}
        <AiFillHeart
          style={{ color: "palevioletred", height: "30px", width: "30px" }}
        ></AiFillHeart>
      </h1>
      {myCourses.length > 0 && (
        <p className="text-center fw-bold">
          ({myCourses.length < 10 && "0"}
          {myCourses.length} course
          {myCourses.length > 1 ? "s" : ""})
        </p>
      )}
      <div
        className=" row justify-content-center row-cols-md-4 row-cols-2 gap-4"
        style={{ marginTop: "50px" }}
      >
        {myCourses.length > 0 ? (
          myCourses.map((el) => {
            return (
              <div
                key={`el-${el.purchase.id}`}
                className="single-popular-course mb-3"
                style={{ width: "300px" }}
              >
                <div className="thumb">
                  <div
                    style={{ height: "200px" }}
                    className=" d-flex justify-content-center"
                  >
                    <Link to={`/details/${el.purchase.course.id}`}>
                      <img
                        className=" w-100 h-100 mx-auto col"
                        src={el.purchase.course.image}
                        alt=""
                      />
                    </Link>
                  </div>
                </div>
                <div className="details pb-3 px-1">
                  <Link to={`/details/${el.purchase.course.id}`}>
                    <h5 className=" fw-bolder">
                      {el.purchase.course.name} - Learn{" "}
                      {el.purchase.course.courseType.name} Course Online
                    </h5>
                  </Link>
                  <div className="d-flex flex-column justify-content-between">
                    <p className="name">
                      {el.purchase.course.appUser.userName}
                    </p>
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
      <Footer />
    </>
  );
}

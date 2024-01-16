import React, { useEffect, useState } from "react";
import { getAllPurchases } from "../service/PurchaseService";
import { Link, useNavigate } from "react-router-dom";
import { getAppUserInfoFromJwtToken } from "../service/LogInService";
import { FiShoppingCart } from "react-icons/fi";
import Header from "./Header";
import Footer from "./Footer";
import ReactStars from "react-rating-stars-component";
import SubSection from "./SubSection";

export default function MyLearning() {
  const [appUser, setAppUser] = useState({});
  const [myCourses, setMyCourses] = useState([]);

  const navigate = useNavigate();

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
      <div
        className=" col col-sm-12 col-md-12  mt-5"
        style={{ paddingLeft: "100px", paddingRight: "100px" }}
      >
        {myCourses.length > 0 && (
          <h2 className="p-0 text-start mb-3" style={{ marginTop: "100px" }}>
            Purchase history
          </h2>
        )}

        <div className=" d-flex flex-column justify-content-center align-items-center ">
          {myCourses.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      color: "grey",
                      fontWeight: "bold",
                      borderTop: "none",
                    }}
                  >
                    Courses
                  </td>

                  <td
                    style={{
                      color: "grey",
                      fontWeight: "bold",
                      borderTop: "none",
                    }}
                  >
                    Date
                  </td>
                  <td
                    style={{
                      color: "grey",
                      fontWeight: "bold",
                      borderTop: "none",
                    }}
                  >
                    Total price
                  </td>
                  <td
                    style={{
                      color: "grey",
                      fontWeight: "bold",
                      borderTop: "none",
                    }}
                  >
                    Payment type
                  </td>
                  <td
                    colSpan={3}
                    style={{
                      borderTop: "none",
                    }}
                  ></td>
                </tr>
              </thead>
              <tbody>
                {myCourses.map((el) => (
                  <tr key={`el_${el.purchase.course.id}`}>
                    <td className="align-middle text-center">
                      <FiShoppingCart
                        style={{ fontSize: "25px" }}
                      ></FiShoppingCart>
                    </td>
                    <td className=" text-center align-middle fw-bold">
                      <div
                        style={{ cursor: "pointer" }}
                        className=" d-flex flex-column align-items-start justify-content-center mx-2"
                        onClick={() =>
                          navigate(`/details/${el.purchase.course.id}`)
                        }
                      >
                        <p className="m-0">{el.purchase.course.name}</p>
                        <small>{el.purchase.course.appUser.userName}</small>
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
                      </div>
                    </td>
                    <td className="align-middle  ">${el.purchase.price}</td>
                    <td className="align-middle  ">
                      {el.purchase.purchaseDate}
                    </td>
                    <td className="align-middle ">Paypal - Visa ****2729</td>
                    <td className="align-middle text-center fw-bold">
                      <div
                        style={{ border: "1px solid black", cursor: "pointer" }}
                      >
                        Receipt
                      </div>
                    </td>
                    <td className="align-middle text-center fw-bold">
                      <div
                        style={{ border: "1px solid black", cursor: "pointer" }}
                      >
                        Invoice
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div className="d-flex justify-content-center align-items-center flex-column">
                <h2 className="p-0  mb-3" style={{ marginTop: "100px" }}>
                  Purchase history
                </h2>
                <img
                  src="https://s.udemycdn.com/browse_components/flyout/empty-shopping-cart-v2-2x.jpg"
                  className="w-75"
                ></img>
                <p className="col col-md-12  mb-3 text-center fs-6">
                  Sorry, we couldn't find any results for your purchase history!
                </p>
                <div>
                  <Link to="/" className="btn payment-btn fw-bold">
                    ← Browse courses now
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <SubSection />
      <Footer />
    </>
  );
}

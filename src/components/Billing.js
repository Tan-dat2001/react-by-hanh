import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import Header from "./Header";
import Footer from "./Footer";
import "../css/details.css";

export default function Billing() {
  let location = useLocation();
  let navigate = useNavigate();

  const [purchaseDetails, setPurchaseDetails] = useState([]);

  const loadPurchaseDetais = async () => {
    const data = location.state.purchaseDetails;
    setPurchaseDetails(data);
  };

  useEffect(() => {
    loadPurchaseDetais();
  }, []);
  return (
    <>
      <Header />

      <div id="hannah" className="pb-5 pt-5">
        <div style={{ marginTop: "50px" }} className=" h-auto">
          <div className="d-flex justify-content-center align-items-center flex-column">
            <img
              src="https://www.90daykorean.com/wp-content/uploads/2015/09/how-to-say-thank-you-in-korean-min.png"
              className=" h-50 w-50 mt-5"
            ></img>
            <h5 className="col col-md-5 col-8 mb-3 text-center mt-3 fw-bold">
              Thank You For Your Purchase{" "}
              <AiFillHeart
                style={{
                  color: "palevioletred",
                  height: "30px",
                  width: "30px",
                }}
              ></AiFillHeart>
              !
            </h5>
            <Link
              to="/my-learning"
              className="btn text-uppercase fw-bold mt-0"
              id="my-learning-btn"
            >
              Go To My Learning →
            </Link>
            <h6 className=" my-3 fw-bold">Or Check</h6>
          </div>
        </div>
        <div className="container-fluid p-1 px-3 position-relative">
          <h1
            className="text-center mb-5 mx-auto fw-bold"
            style={{ color: "#0340c1" }}
          >
            PURCHASE INFORMATION
          </h1>
          {purchaseDetails.length > 0 && (
            <p className=" fw-bold px-4">
              {purchaseDetails.length} course
              {purchaseDetails.length > 1 ? "s" : ""} in cart
            </p>
          )}

          <div className="container-fluid w-100">
            {purchaseDetails.length > 0 && (
              <div className="row">
                <div className=" col col-sm-12 col-md-12 col-lg-8 col-xl-8 p-0">
                  <div className=" d-flex flex-column justify-content-center align-items-center px-4">
                    <table className="table table-hover">
                      <tbody>
                        {purchaseDetails.map((el) => {
                          return (
                            <>
                              <tr key={`el_${el.id}`}>
                                <td>
                                  <div className="d-flex flex-column flex-md-row align-items-center justify-content-start ">
                                    <img
                                      src={el.course.image}
                                      style={{
                                        width: "5rem",
                                        height: "5rem",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        navigate(`/details/${el.course.id}`)
                                      }
                                    />
                                  </div>
                                </td>

                                <td className=" text-center align-middle fw-bold">
                                  <div
                                    style={{ cursor: "pointer" }}
                                    className=" d-flex flex-column align-items-start justify-content-center mx-2"
                                    onClick={() =>
                                      navigate(`/details/${el.course.id}`)
                                    }
                                  >
                                    <p className="m-0">{el.course.name}</p>
                                    <small>{el.course.appUser.userName}</small>
                                    <small className="star">
                                      4.2{" "}
                                      <i className="fa fa-star checked text-warning" />
                                      <i className="fa fa-star checked text-warning" />
                                      <i className="fa fa-star checked text-warning" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" /> (2277
                                      ratings)
                                    </small>
                                    <small>77 lectures • All levels</small>
                                  </div>
                                </td>

                                {/*                            total price*/}
                                <td
                                  className="align-middle text-center fw-bold"
                                  style={{ color: "#9435f3" }}
                                >
                                  ${el.course.price}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>

                    <Link
                      to="/"
                      className="btn btn-outline-primary mb-5 back-btn"
                    >
                      ← Back to Home
                    </Link>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 container position-relative">
                  <div className="shadow rounded p-3 mb-5 position-sticky custom-cart">
                    <div>
                      <div
                        className="fs-5 fw-bold"
                        style={{ color: "#0340c1" }}
                      >
                        TOTAL
                      </div>
                      <hr className="text-secondary h-2" />
                      <div className="">
                        <div className="border-bottom mb-2 pb-2">
                          <span className=" fw-bold">SUB TOTAL:</span>
                          <span className="fw-bold" style={{ float: "right" }}>
                            ${location.state.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <hr />
                    </div>
                    {/*                payment*/}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

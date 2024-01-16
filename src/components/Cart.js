import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCarts, deleteCart } from "../service/CartService";
import { getAppUserInfoFromJwtToken } from "../service/LogInService";
import { createPurchase } from "../service/PurchaseService";
import "../css/order.css";
import Header from "./Header";
import Footer from "./Footer";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { findAllCarts } from "../redux/cartAction";
import ReactStars from "react-rating-stars-component";

export default function Cart() {
  const navigate = useNavigate();
  const [appUser, setAppUser] = useState({});
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const dispatch = useDispatch();

  const firstExample = {
    size: 15,
    activeColor: "#f4ab20",
    edit: false,
  };

  const extractToken = async () => {
    const temp = getAppUserInfoFromJwtToken();
    if (temp !== null) {
      console.log(temp.appUser);
      setAppUser(temp.appUser);
    }
  };

  const loadAllCarts = async (appUserId) => {
    const data = await getAllCarts(appUserId);
    setCart(data);
  };

  const handleDelete = async (el) => {
    Swal.fire({
      title: "Are you sure to delete this course from cart?",
      text: el.course.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (willDelete) => {
      if (willDelete.isConfirmed) {
        await deleteCart(el.id);
        dispatch(findAllCarts(appUser.id));
        setIsUpdated((prev) => !prev);

        Swal.fire("Deleted successfully!", "", "success");
      }
    });
  };

  const checkRenderPaypal = () => {
    if (!checkout) {
      setCheckout(true);
      renderPaypal();
    }
  };

  const renderPaypal = () => {
    if (window.paypal) {
      window.paypal.Buttons().close();
    }

    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          const totalPrice = document.querySelector(".total-price").value;
          console.log(totalPrice);
          const priceInNum = parseFloat(totalPrice);
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "I'm buying courses :))",
                amount: {
                  currency_code: "USD",
                  value: priceInNum,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const totalPrice = document.querySelector(".total-price").value;
          const priceInNum = parseFloat(totalPrice);

          const order = await actions.order.capture();
          console.log(JSON.stringify(order));
          // after we're done with paypal

          const res = await createPurchase(appUser.id);
          console.log("hihihi herere");
          console.log(res);

          navigate("/success", {
            state: {
              purchaseDetails: res.data,
              totalPrice: priceInNum,
            },
          });
        },
        onError: (err) => {
          console.log(err);
          Swal.fire("Payment failed! Please try again!", "", "error");
        },
      })
      .render("#paypal-button-container");
  };

  useEffect(() => {
    extractToken();
  }, []);

  useEffect(() => {
    let newTotalPrice = cart.reduce(
      (total, el) => total + el.cart.course.price,
      0
    );

    setTotalPrice(newTotalPrice);
  }, [cart]);

  useEffect(() => {
    if (appUser.id) {
      loadAllCarts(appUser.id);
      window.scrollTo(0, 0);
    }
  }, [appUser.id, isUpdated]);

  return (
    <>
      <Header />
      <div id="hannah" className="pb-5 pt-5">
        <div className="container-fluid p-1 px-3 position-relative">
          <h1
            className="text-center my-5 mx-auto fw-bold"
            style={{ color: "#0340c1" }}
          >
            Shopping Cart
          </h1>
          {cart.length > 0 && (
            <p className=" fw-bold">
              {cart.length} course{cart.length > 1 ? "s" : ""} in cart
            </p>
          )}

          <div className="container-fluid w-100">
            {cart.length > 0 ? (
              <div className="row">
                <div className=" col col-sm-12 col-md-12 col-lg-8 col-xl-8 p-0">
                  <div className=" d-flex flex-column justify-content-center align-items-center">
                    <table className="table table-hover">
                      <tbody>
                        {cart.map((el) => {
                          return (
                            <>
                              <tr key={`el_${el.cart.id}`}>
                                <td>
                                  <div className="d-flex flex-column flex-md-row align-items-center justify-content-start">
                                    <img
                                      src={el.cart.course.image}
                                      style={{
                                        width: "5rem",
                                        height: "5rem",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        navigate(
                                          `/details/${el.cart.course.id}`
                                        )
                                      }
                                    />
                                  </div>
                                </td>

                                <td className=" text-center align-middle fw-bold">
                                  <div
                                    style={{ cursor: "pointer" }}
                                    className=" d-flex flex-column align-items-start justify-content-center mx-2"
                                    onClick={() =>
                                      navigate(`/details/${el.cart.course.id}`)
                                    }
                                  >
                                    <p className="m-0">{el.cart.course.name}</p>
                                    <small>
                                      {el.cart.course.appUser.userName}
                                    </small>
                                    <div className="bottom d-flex align-items-start flex-column align-items-start  justify-content-start">
                                      <small className="star d-flex align-items-center">
                                        {el.numOfRating > 0
                                          ? Number.parseFloat(
                                              el.averageRating
                                            ).toFixed(1)
                                          : ""}
                                        <ReactStars
                                          key={el.averageRating}
                                          value={el.averageRating}
                                          {...firstExample}
                                        />
                                        ({el.numOfRating}{" "}
                                        {el.numOfRating > 1
                                          ? "ratings"
                                          : "rating"}
                                        )
                                      </small>
                                      <small className="d-inline-block">
                                        {el.numOfVideo} lectures • All levels •{" "}
                                        {el.numOfStudent}{" "}
                                        {el.numOfStudent > 1
                                          ? "students"
                                          : "student"}
                                      </small>
                                    </div>
                                  </div>
                                </td>

                                <td className="align-middle">
                                  <button
                                    type="button"
                                    className="btn mx-5 p-0 "
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      color: "#1b41a7",
                                    }}
                                    onClick={() => handleDelete(el.cart)}
                                  >
                                    Remove
                                  </button>
                                </td>
                                {/*                            total price*/}
                                <td
                                  className="align-middle text-center fw-bold"
                                  style={{ color: "#9435f3" }}
                                >
                                  ${el.cart.course.price}
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
                      <div className="text-secondary fs-5 fw-bold">TOTAL</div>
                      <hr className="text-secondary h-2" />
                      <div className="">
                        <div className="border-bottom mb-2 pb-2">
                          <span className=" fw-bold">SUB TOTAL:</span>
                          <span className="fw-bold" style={{ float: "right" }}>
                            <input
                              className="fw-bold total-price"
                              type="hidden"
                              value={totalPrice.toFixed(2)}
                            />
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-100 btn payment-btn mt-3 fw-bold"
                        style={{ color: "white" }}
                        onClick={checkRenderPaypal}
                      >
                        PROCEED PAYMENT
                      </button>
                      <hr />
                      <div id="paypal-button-container" className="w-100"></div>
                    </div>
                    {/*                payment*/}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <img src="https://s.udemycdn.com/browse_components/flyout/empty-shopping-cart-v2-2x.jpg"></img>
                  <p className="col col-md-3 col-8 mb-3 text-center">
                    Your cart is empty. Keep shopping to find a course!
                  </p>
                  <div>
                    <Link to="/" className="btn payment-btn fw-bold">
                      ← Keep Shopping
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

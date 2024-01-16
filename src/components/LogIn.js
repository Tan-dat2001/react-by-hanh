import React, { useState } from "react";
import "../css/login.css";
import { Form, Formik, ErrorMessage, Field } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import {
  login,
  addJwtTokenToLocalStorage,
  getAppUserInfoFromJwtToken,
} from "../service/LogInService";
import Swal from "sweetalert2";
import Header from "./Header";
import Footer from "./Footer";

export default function LogIn() {
  const navigate = useNavigate();
  const [err, setErr] = useState(null);

  const handleLogIn = async (values) => {
    console.log("hrerere");
    const data = await login(values);
    if (data.data.token == null) {
      setErr(":))");
    } else {
      addJwtTokenToLocalStorage(data.data.token);
      console.log(getAppUserInfoFromJwtToken(data.data.token));
      navigate("/");
      Swal.fire("Logged In Successfully!", "", "success");
    }
  };

  return (
    <>
      <div>
        <Formik
          initialValues={{
            userName: "",
            password: "",
          }}
          validationSchema={yup.object({
            userName: yup.string().required("Please fill in username!"),
            password: yup.string().required("Password is required!"),
          })}
          onSubmit={(values) => handleLogIn(values)}
        >
          <div className="overlay-login">
            {/* LOGN IN FORM by Omar Dsoky */}

            <Form className="form-login m-0">
              {/*   con = Container  for items in the form*/}
              <div className="con">
                {/*     Start  header Content  */}
                <header className=" header-login">
                  <h2>Log In</h2>
                  {/*     A welcome message or an explanation of the login form */}
                  <p>login here using your username and password</p>
                </header>
                {/*     End  header Content  */}
                <br />
                <div className="field-set">
                  {/*   user name */}
                  <div>
                    <span className="input-item">
                      <i className="fa fa-user-circle" />
                    </span>
                    {/*   user name Input*/}
                    <Field
                      className="form-input"
                      type="text"
                      placeholder="@UserName"
                      name="userName"
                    />
                    <ErrorMessage
                      name="userName"
                      component="small"
                      className=" text-danger d-block"
                    ></ErrorMessage>
                  </div>
                  <div>
                    {/*   Password */}
                    <span className="input-item">
                      <i className="fa fa-key" />
                    </span>
                    {/*   Password Input*/}
                    <Field
                      className="form-input"
                      type="password"
                      placeholder="Password"
                      name="password"
                    />

                    {/*      Show/hide password  */}

                    <ErrorMessage
                      name="password"
                      component="small"
                      className=" text-danger d-block"
                    ></ErrorMessage>
                  </div>
                  {err !== null && (
                    <div>
                      <small className=" text-danger">
                        Username or password is not correct!
                      </small>
                    </div>
                  )}

                  {/*        buttons */}
                  {/*      button LogIn */}
                  <button type="submit" className="button-login">
                    {" "}
                    Log In{" "}
                  </button>
                  <div className="other">
                    {/*      Forgot Password button*/}
                    <Link to="/" className="btn submits frgt-pass button-login">
                      ← Home
                    </Link>
                    {/*     Sign Up button */}
                    <Link
                      className="btn submits sign-up button-login"
                      to="/sign-up"
                    >
                      Sign Up
                      {/*         Sign Up font icon */}
                      <i className="fa fa-user-plus" aria-hidden="true" />
                    </Link>
                    {/*      End Other the Division */}
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Formik>
      </div>
    </>
  );
}

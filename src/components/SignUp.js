import React from "react";
import "../css/login.css";
import { Form, Formik, ErrorMessage, Field } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  login,
  signup,
  addJwtTokenToLocalStorage,
  getAppUserInfoFromJwtToken,
} from "../service/LogInService";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = async (values, setErrors) => {
    const tempRole = {
      id: 1,
      flagDeleted: "false",
      name: "ROLE_STUDENT",
    };
    const data = await signup({
      userName: values.userName,
      password: values.password,
      appRole: tempRole,
    });
    console.log(data);
    if (data.data.token === null) {
      setErrors({ userName: "Cannot use this username!!" });
    } else {
      Swal.fire("New account is successfully created!", "", "success");
      console.log(data.data.token);
      addJwtTokenToLocalStorage(data.data.token);
      navigate("/");
    }
  };

  return (
    <>
      <div>
        <Formik
          initialValues={{
            userName: "",
            password: "",
            passwordConfirmation: "",
          }}
          validationSchema={yup.object({
            userName: yup.string().required("Please fill in username!"),
            password: yup.string().required("Password is required!"),
            passwordConfirmation: yup
              .string()
              .oneOf([yup.ref("password"), null], "Password must match!")
              .required("Password Confirmation is required!"),
          })}
          onSubmit={(values, { setErrors }) => handleSignUp(values, setErrors)}
        >
          <div className="overlay-login">
            {/* LOGN IN FORM by Omar Dsoky */}

            <Form className="form-login m-0">
              {/*   con = Container  for items in the form*/}
              <div className="con">
                {/*     Start  header Content  */}
                <header className=" header-login">
                  <h2>Sign Up</h2>
                  {/*     A welcome message or an explanation of the login form */}
                  <p>Sign Up here using your username and password</p>
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
                  <div>
                    {/*   Confirm Password */}
                    <span className="input-item">
                      <i className="fa fa-key" />
                    </span>
                    {/*   Password Input*/}
                    <Field
                      className="form-input"
                      type="password"
                      placeholder="Confirm Password"
                      name="passwordConfirmation"
                    />

                    {/*      Show/hide password  */}

                    <ErrorMessage
                      name="passwordConfirmation"
                      component="small"
                      className=" text-danger d-block"
                    ></ErrorMessage>
                  </div>

                  {/*        buttons */}
                  {/*      button LogIn */}
                  <button type="submit" className="button-login">
                    {" "}
                    Sign Up{" "}
                  </button>
                  <div className="other">
                    {/*     Sign Up button */}
                    <Link
                      className="btn submits sign-up button-login w-100"
                      to="/log-in"
                    >
                      Log In
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

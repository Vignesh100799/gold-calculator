import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { togglePasswordVisibility } from "../Utils/Utils";


export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validation = yup.object({
    email: yup.string().required("Email is required").email("Email is not valid"),
    password: yup.string().required("Password is required"),
  });

  async function sendDataToLogin(values) {
    console.log("Working sendDataToLogin");
    setLoading(true);

    try {
      const response = await axios.post(
        `/api/login`,
        values
      );

      setLoading(false);
      const data = response.data;
      // console.log(data)

      localStorage.setItem("Auth Token", `${data?.token}`);
      localStorage.setItem("userName", `${data?.userName}`);
      toast.success("Welcome To Home Page", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Navigate to the Header component
      navigate("/header", { state: { message: "Welcome back" } });
    } catch (error) {
      setLoading(false);
      setError("Email or password is not valid");
      toast.error("Email or password is not valid", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: sendDataToLogin,
  });

  function changeBgLogin() {
    document.getElementById("change").classList.add("auth");
    console.log("Working changeBgLogin");
  }

  return (
    <>
      <div className="bg-color" >
        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5 py-md-0">
          <div className="content row gx-0">
            <div className="col-md-5">
              <div
                className="image-container text-white h-100 d-flex align-items-center justify-content-center flex-column p-5 text-center"
                style={{ backgroundImage: `url(./image/Gold.jpeg)` }}
              >
                <h2 className="mb-3 dark-color fw-bold">Don't have an Account?</h2>
                <p>Register Here</p>
                <Link to={"/register"}>
                  <button className="btn btn-outline-light red-font fw-bold rounded-pill py-2 px-4">
                    Register
                  </button>
                </Link>
              </div>
            </div>
            <div className="col-md-7 bg-light">
              <div className="text-center p-5 light-bg">
                <img src="./image/GoldPrice.jpeg" height="70" alt="Gold price today" className="mx-1" />
                <form onSubmit={formik.handleSubmit}>
                  {error ? <p className="text-danger ">{error}</p> : ""}
                  <input
                    type="email"
                    className="form-control mt-3"
                    placeholder="Enter Email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <p className="fs-small ps-1 text-danger text-start">{formik.errors.email}</p>
                  ) : (
                    ""
                  )}

                  <div className="position-relative">
                    <input
                      id="password-input"
                      type="password"
                      className="form-control mt-3"
                      placeholder="Enter Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <i onClick={() => togglePasswordVisibility()} className="fa-regular fa-eye-slash eyeIcon"></i>
                  </div>
                  {formik.errors.password && formik.touched.password ? (
                    <p className="fs-small ps-1 text-danger text-start">{formik.errors.password}</p>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => changeBgLogin()}
                    id="change"
                    type="submit"
                    className="btn-style text-center mt-3 w-100"
                  >
                    {loading ? (
                      <div className="d-flex justify-content-center">
                        <Oval height={30} width={30} color="#fff" visible={true} ariaLabel="oval-loading" />
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <div className="mt-4">
                    <Link to="/forgotPassword" style={{ textDecoration: "none", color: "#832729", fontWeight: "bold" }}>
                      Forgot Password
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

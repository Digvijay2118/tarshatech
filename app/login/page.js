"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "react-js-loader";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import TarshLogo from "../../public/Tarsha-logo-brown.png";
import eye from "../../public/svg/eye.svg"
import Image from "next/image";
import { ReactSVG } from "react-svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import vector from "../../public/Vector.png"

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const email = data?.email ? data?.email.trim() : "";
      const password = data?.password ? data?.password.trim() : "";
  
      console.log("email:", email);
      console.log("password:", password);
       
      if (email && password) {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        });
  
        console.log("Response status:", res.status);
        console.log("Response headers:", res.headers);
  
        // Log the entire response body for inspection
        const responseBody = await res.text();
        console.log("Response body:", responseBody);
  
        if (res.ok) {
          try {
            // Attempt to parse the response body as JSON
            let result;
            try {
              result = JSON.parse(responseBody);
            } catch (jsonError) {
              console.error("Error parsing JSON:", jsonError);
              throw new Error("Invalid JSON response");
            }
  
            if (!result.error) {
              const payload = result?.data;
  
              const username = payload?.username ? payload?.username : "";
              const user_email = payload?.email ? payload?.email : "";
              const firm_name = payload?.firm_name? payload?.firm_name:"";
              const first_name = payload?.first_name ? payload?.first_name : "";
              const last_name = payload?.last_name ? payload?.last_name : "";
              const fullname = payload?.fullname ? payload?.fullname : `${first_name} ${last_name}`;
              const profile_picture = payload?.profile_picture
                ? payload?.profile_picture
                : "";
              const token = payload?.token ? payload?.token : "";
  
              const userinfo = {
                username,
                profile_picture,
                firm_name,
                fullname,
                first_name,
                last_name,
                user_email,
                token,
              };
              localStorage.setItem("userinfo", JSON.stringify(userinfo));
              toast.success(result?.message);
              router.push("/dashboard");
            } else {
              toast.error(result?.message);
            }
          } catch (jsonError) {
            console.error("Error handling JSON response:", jsonError.message);
            toast.error(jsonError.message);
          }
        } else {
          toast.error("Unable to login to the page");
        }
      } else {
        toast.error("Email and password are required");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  
  
  



  return (
    <>
      <main>
        <Toaster position="top-left" reverseOrder={false} />

        <section className="authentication--block">
          <div className="authentication__main d-flex">
            <div className="authentication__left">
              <div className="authentication__left__inner">
                <div className="header__logo">
                  <a href="https://www.zaidexceldesign.com/" target={"_blank"}>
             
                  <Image src={TarshLogo} alt="logo" color="black"/>
                  </a>
                </div>

                <div className="header_message">
                  <h1>Hi, Welcome Back!</h1>
                </div>

                <div className="authentication__form">
                  {loading ? (
                    <Loader
                      type="spinner-default"
                      bgColor={"#000000"}
                      title={"Please wait"}
                      color={"#000000"}
                      size={50}
                    />
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} aria-label="Login">
                      <div className="form-group">
                        <label htmlFor="email">
                          Email
                          <ReactSVG 
                                        src={`${eye}`}  
                                        wrapper="span"
                                        beforeInjection={(svg) => {
                                            // svg.classList.add('svg-class-name')
                                            svg.setAttribute('style', 'width: 30px')
                                          }}
                                        />
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <div className="input-group-text bg-transparent">
                            <FontAwesomeIcon icon={faUser} />
                            </div>
                          </div>
                          <input
                            id="email"
                            type="text"
                            name="email"
                            {...register("email", {
                              required: "Required",
                              pattern: {
                               
                                message: "Invalid email",
                              },
                            })}
                            placeholder="Email"
                           
                            className="form-control border-left-0"
                          />
                        </div>
                        <p className="text-danger">{errors?.email?.message}</p>
                        
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <div className="input-group-text bg-transparent">
                            <FontAwesomeIcon icon={faLock} />
                            </div>
                          </div>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            {...register("password", { required: "Required" })}
                            placeholder="******"
                           
                            className="form-control border-left-0"
                          />
                        </div>
                        <p className="text-danger">
                          {errors?.password?.message}
                        </p>
                       
                      </div>
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn d-block w-100 btn__login"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div className="authentication__right">
              <div className="authentication__right__inner">
                <Image src={vector}  className="login_logo" alt="" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;

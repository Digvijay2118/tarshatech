"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "react-js-loader";
import { GetDate, todayDate } from "../services/DateTimeService";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import {
  alphabetSpaceWithDot,
  mailPattern,
  phonePattern,
  floatPattern,
} from "../services/pattern";
import {
  formclass,
  displayError,
  checkFile,
} from "../services/ValidationService";
// import Reactdes from '../../public/icons/image.svg';

import {
  displayFormData,
  previewImage,
  removeImage,
} from "../services/FormCommon";
import axios from "axios";

//Customer
const page = () => {
  const navigate = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const goBack = () => {
    navigate.push(`/companies`);
  };

  const [loading, setLoading] = useState(false);
  const [isPreviewed, setIsPreviewed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [duration, setDuration] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date());

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("data===>", data);
      if (!data) {
        throw new Error("Form data is null or undefined.");
      }

      const formData = new FormData();
      // formData.append("file", data.file[0]);

      console.log("files===>", data.file[0]);
      for (let key of Object.keys(data)) {
        if (key === "file") {
          if (data?.file[0]) {
            formData.append("file", data?.file[0]);
          }
        } else {
          formData.append(key, data[key]);
        }
      }
      const planEndDate = endDate;
      const [day, month, year] = planEndDate.split("/");
      const newDate = new Date(`${year}-${month}-${day}`);
      const formattedEndDate = newDate.toISOString().split("T")[0];

      formData.append("plans_end_date", formattedEndDate);

      console.log("formData entries:===>", formData);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const selectedPlan = options.find(
        (option) => option.id === parseInt(selectedOption)
      );
      formData.append("selectedPlan", JSON.stringify(selectedPlan));

      console.log("selectedPlan--->", selectedPlan);

      const res = await fetch("/api/companies", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        // body: JSON.stringify(data),
        body: formData,
      });
      if (res.ok) {
        const responseData = await res.json();
        console.log("responseData==>", responseData);

        if (!responseData.error) {
          setLoading(false);
          toast.success(`${responseData.message}`);
          navigate.push(`/companies`);
        } else {
          setLoading(false);
          toast.error(responseData.message);
        }
      } else {
        setLoading(false);
        toast.error("Failed to fetch data");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
      // navigate(`/${CustRoute.list}`);
    }
  };

  useEffect(() => {
    // Make an API call to retrieve the user data
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`/api/plans/`);
        const plansData = response.data.result[0];
        setOptions(plansData);
        console.log("data==>", plansData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    console.log("selct==>", selectedOption);
  };

  const handleduration = (e) => {
    setDuration(e.target.value);
  };

  useEffect(() => {
    if (duration && startDate) {
      const endDate = new Date(startDate);
      if (duration === "1") {
        endDate.setMonth(endDate.getMonth() + 3);
      } else if (duration === "2") {
        endDate.setMonth(endDate.getMonth() + 6);
      } else if (duration === "3") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else if (duration === "4") {
        endDate.setFullYear(endDate.getFullYear() + 2);
      }
      const formattedEndDate = endDate.toLocaleDateString("en-GB"); // Format to "dd-mm-yyyy"
      setEndDate(formattedEndDate);
    }
  }, [duration, startDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  console.log("endDate==>", endDate);
  return (
    <>
      <Header />
      <Sidebar />
      <div className="content__wrapper">
        <section className="page-content">
          <div className="page-title mobile-title">
            <h1 className="h4 mb-0">Add</h1>
            <p className="mb-4">Companies Details</p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-5">
                <div className="card-header bg-transparent border-0 mb-5 p-0">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-10">
                      <h6 className="title-line text-shadow-yellow mb-0 pb-3">
                        Add Companies Details
                      </h6>
                    </div>
                    <div className="col-md-2 text-right status__selection-col">
                      <div className="status__selection">
                        <label className="mb-0" htmlFor="">
                          User Status
                        </label>
                        <div className="status__selection-wrapper">
                          <select
                            name="active"
                            id="active"
                            {...register("active")}
                            className="status-select ml-2"
                          >
                            <option value="1">Active</option>
                            <option value="0">In Active</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  {loading ? (
                    <Loader
                      type="spinner-default"
                      bgColor={"#000000"}
                      title={"Please wait"}
                      color={"#000000"}
                      size={50}
                    />
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label htmlFor="first_name">First Name*</label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            {...register("first_name", {
                              required: "Required",
                              pattern: {
                                value: alphabetSpaceWithDot,
                                message: "Invalid",
                              },
                            })}
                            className={formclass(errors?.first_name)}
                            placeholder="First name"
                          />
                          {displayError(errors?.first_name?.message)}
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="email">Email Address*</label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="email"
                            {...register("email", {
                              required: "Required",
                              pattern: {
                                value: mailPattern,
                                message: "Invalid email",
                              },
                            })}
                            className={formclass(errors?.email)}
                          />
                          {displayError(errors?.email?.message)}
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="phone">Mobile Number*</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Mobile no."
                            {...register("phone", {
                              required: "Required",
                              pattern: {
                                value: phonePattern,
                                message: "Only 10 Digits phone no. is required",
                              },
                            })}
                            className={formclass(errors?.phone)}
                          />
                          {displayError(errors?.phone?.message)}
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="password">Password*</label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            {...register("password", {
                              required: "Required",
                            })}
                            className={formclass(errors?.password)}
                          />
                          {displayError(errors?.password?.message)}
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="confirm_password">
                            Confirm password*
                          </label>
                          <input
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                            placeholder="Confirm password"
                            {...register("confirm_password", {
                              required: "Required",
                              validate: (value) =>
                                value == getValues("password") ||
                                "Confirm password doesn't match with password match",
                            })}
                            className={formclass(errors?.confirm_password)}
                          />
                          {displayError(errors?.confirm_password?.message)}
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="firm_name">Firm Name*</label>
                          <input
                            type="text"
                            name="firm_name"
                            id="firm_name"
                            placeholder="Firm name"
                            {...register("firm_name", {
                              required: "Required",
                              pattern: {
                                value: alphabetSpaceWithDot,
                                message: "Invalid",
                              },
                            })}
                            className={formclass(errors?.firm_name)}
                          />
                          {displayError(errors?.firm_name?.message)}
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="">Firm Logo*</label>
                          <div className="custom__file-upload">
                            <input
                              type="file"
                              id="file"
                              name="file"
                              className="form-control"
                              accept="image/*"
                              {...register("file", {
                                validate: (value) => {
                                  if (
                                    typeof value[0]?.name != "undefined" &&
                                    checkFile(value[0]?.name)
                                  ) {
                                    const isOKay = previewImage(
                                      value[0],
                                      "#previewImage"
                                    );
                                    setIsPreviewed(isOKay);
                                    return isOKay;
                                  } else {
                                    if (
                                      typeof value[0]?.name == "undefined" ||
                                      value[0]?.name == ""
                                    ) {
                                      const isOKay =
                                        removeImage("#previewImage");
                                      setIsPreviewed(!isOKay);
                                      return isOKay;
                                    } else {
                                      setIsPreviewed(
                                        !removeImage("#previewImage")
                                      );
                                      return "Invalid file";
                                    }
                                  }
                                },
                              })}
                            />
                            <label
                              htmlFor="file"
                              className="custom__file-label"
                            >
                              {/* <Reactdes/> */}
                              <span>upload your image here</span>
                            </label>
                          </div>
                          {errors?.file ? (
                            <span className="text-danger">
                              {errors?.file?.message}
                            </span>
                          ) : (
                            ""
                          )}
                          <div className="form-group col-md-1">
                            <img
                              src={""}
                              id="previewImage"
                              alt="image"
                              width={"100%"}
                              hidden={!isPreviewed}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="dropdown">Select an Plan:</label>
                            <select
                              id="plans"
                              name="plans"
                              value={selectedOption}
                              className="form-control"
                              {...register("plans", {
                                required: "Select the Plan",
                              })}
                              onChange={handleSelectChange}
                            >
                              <option value="" disabled>
                                Select a Plan
                              </option>
                              {options?.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.title}
                                </option>
                              ))}
                            </select>
                            {/* {displayError(errors?.payment_status?.message)} */}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="duration">Duration</label>

                            <select
                              id="duration"
                              name="duration"
                              value={duration}
                              className="form-control"
                              // className={formclass(errors?.duration)}
                              {...register("duration")}
                              onChange={handleduration}
                            >
                              <option value="" disabled>
                                Select a Plan
                              </option>
                              <option value="1">3 months</option>
                              <option value="2">6 Months</option>
                              <option value="3">1 Yr</option>
                              <option value="4">2 Yr</option>
                            </select>
                            {displayError(errors?.plan_start_date?.message)}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="plan_start_date">
                              Plan Start Date
                            </label>
                            <input
                              type="date"
                              name="plan_start_date"
                              id="plan_start_date"
                              value={startDate}
                              {...register("plan_start_date", {
                                required: "Required",
                              })}
                              onChange={handleStartDateChange}
                              className={formclass(errors?.plan_start_date)}
                            />
                            {displayError(errors?.plan_start_date?.message)}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="plan_end_date">Plan End Date</label>
                            <input
                              type="text"
                              name="plan_end_date"
                              id="plan_end_date"
                              value={endDate}
                              {...register("plan_end_date")}
                              readOnly
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="plan_status">Plan Status</label>
                            <select
                              name="plan_status"
                              id="plan_status"
                              className={formclass(errors?.plan_status)}
                              {...register("plan_status", {
                                required: false,
                              })}
                            >
                              <option value={"0"}>--Please Select--</option>
                              <option value="1">Active</option>
                              <option value="2">In Active</option>
                            </select>
                            {/* {displayError(errors?.plan_status?.message)} */}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="payment_status">
                              Payment Status
                            </label>
                            <select
                              name="payment_status"
                              id="payment_status"
                              className="form-control"
                              // className={formclass(errors?.payment_status)}
                              {...register("payment_status", {
                                required: "Select the Payment",
                              })}
                            >
                              <option value="1">Pending </option>
                              <option value="2">Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group mb-0 col-md-2">
                          <button type="submit" className="btn">
                            Submit
                          </button>
                        </div>
                        <div className="form-group mb-0 col-md-4">
                          <button
                            type="submit"
                            onClick={goBack}
                            className="btn"
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default page;

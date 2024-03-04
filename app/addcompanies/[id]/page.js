"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "react-js-loader";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { eyeButtonSvg, FileUrl } from "../../UtilsComponent/Config";
import {
  alphabetSpaceWithDot,
  mailPattern,
  floatPattern,
} from "../../services/pattern";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import {
  formclass,
  displayError,
  checkFile,
} from "../../services/ValidationService";
// import Reactdes from '../../public/icons/image.svg';
import { ReactSVG } from "react-svg";
import {
  displayFormData,
  previewImage,
  removeImage,
} from "../../services/FormCommon";
import { useParams } from "next/navigation";
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
  const [selectedOption, setSelectedOption] = useState("");
  const [isPreviewed, setIsPreviewed] = useState(false);
  const [saveOldFile, setSaveOldFile] = useState("");
  const [options, setOptions] = useState([]);
  const [duration, setDuration] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date());
  const [users, setUsers] = useState({
    active: "",
    first_name: "",
    // last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    firm_name: "",
    firm_logo: "",
    duration: "",
    plan_start: "",
    plan_expiry: "",
    payment_status: "",
    plan_status: "",
    plans: "",
  });

  const { id } = useParams();
  console.log("id==>", id);

  const Id = id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name}, New value: ${value}`);

    setUsers((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const onSubmit = async (data) => {
  //   try {
  //     setLoading(true);

  //     const formData = new FormData();
  //     // formData.append("file", data.file[0]);

  //     console.log("files===>", data.file[0]);
  //     for (let key of Object.keys(data)) {
  //       if (key === "file") {
  //         if (data?.file[0]) {
  //           // formData.append("file", data?.file[0]);
  //           formData.append("firm_logo", data.file[0].name);
  //           console.log("firm_logo===>:", data.file[0].name);
  //         }
  //       } else {
  //         formData.append(key, data[key]);
  //       }
  //     }

  //     console.log("formData entries:");
  //     for (var pair of formData.entries()) {
  //       console.log(pair[0] + ", " + pair[1]);
  //     }

  //     // console.log("User data before submitting:", users);

  //     const res = await axios.put(`/api/customer/${Id}`, formData);
  //     setUsers({
  //       active:"",
  //       first_name:"",
  //       last_name:"",
  //       email:"",
  //       phone:"",
  //       password:"",
  //       confirm_password:"",
  //       firm_name:"",
  //       firm_logo:"",
  //       plan_start:"",
  //       plan_expiry:"",
  //       payment_status:"",
  //       plan_status:"",
  //       plans:"",

  //     });
  //     if (res.status === 200) {
  //       const responseData = await res.json();

  //       if (!responseData.error) {
  //         setLoading(false);
  //         toast.success(`${responseData.message}`);
  //         navigate.push(`/customer`);
  //       } else {
  //         setLoading(false);
  //         toast.error(responseData.message);
  //       }
  //     } else {
  //       setLoading(false);
  //       toast.error("Failed to fetch data");
  //       console.error("Error:", res.statusText); // Log the statusText for debugging
  //     }
  //   } catch (err) {
  //     setLoading(false);
  //     toast.error(err.message);
  //     console.error("Error:", err); // Log the error for debugging
  //     navigate.push(`/customer`);
  //   }
  // }

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", document.getElementById("file").files[0]);
      formData.append("durations", duration);
      formData.append("plans_start", startDate);

      const planEndDate = endDate;
      const [day, month, year] = planEndDate.split("/");
      const newDate = new Date(`${year}-${month}-${day}`);
      const formattedEndDate = newDate.toISOString().split("T")[0];
      formData.append("plans_expiry", formattedEndDate);
      for (const key in users) {
        formData.append(key, users[key]);
      }

      const selectedPlan = options.find(
        (option) => option.id === parseInt(users.plans)
      );
      console.log("Selected Plan:", selectedPlan);
      formData.append("selectedPlan", JSON.stringify(selectedPlan));

      const res = await axios.put(`/api/companies/${Id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response
      if (res.status === 200) {
        const responseData = res.data; // Use res.data instead of res.json()

        if (!responseData.message) {
          setLoading(false);
          toast.success("Data updated successfully");
          navigate.push(`/companies`);
        } else {
          setLoading(false);
          toast.error(responseData.message);
        }
      } else {
        setLoading(false);
        toast.error("Failed to fetch data");
        console.error("Error:", res.statusText);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
      console.error("Error:", err);
      navigate.push(`/companies`);
    }
  };

  useEffect(() => {
    // Make an API call to retrieve the user data
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`/api/plans`);
        const plansData = response.data.result[0];
        setOptions(plansData);
        console.log("data==>", plansData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (Id) {
      // Make an API call to retrieve the user data
      const fetchOptions = async () => {
        try {
          const response = await axios.get(`/api/companies/${Id}`);
          const userData = response.data[0][0];
          userData.plan_start = userData.plan_start
            ? new Date(userData.plan_start).toISOString().split("T")[0]
            : "";
          userData.plan_expiry = userData.plan_expiry
            ? new Date(userData.plan_expiry).toISOString().split("T")[0]
            : "";
          setUsers(userData);
          setSaveOldFile(userData.firm_logo);
          setIsPreviewed(true);
          setDuration(userData.duration);
          setStartDate(userData.plan_start);
          setEndDate(userData.plan_expiry);
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      };

      fetchOptions();
    }
  }, [Id]);

  console.log("User data:", users);

  /*Displaying old image*/
  const resetOldImage = (imageName) => {
    try {
      if (imageName) {
        document.getElementById("previewImage").src = `${imageName}`;
      }
    } catch (err) {
      console.log(err);
    }
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

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content__wrapper">
        <section className="page-content">
          <div className="page-title mobile-title">
            <h1 className="h4 mb-0">Edit</h1>
            <p className="mb-4">Companies Details</p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-5">
                <div className="card-header bg-transparent border-0 mb-5 p-0">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-10">
                      <h6 className="title-line text-shadow-yellow mb-0 pb-3">
                        Edit Companies Details
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
                            onChange={handleChange}
                            className={formclass(errors?.first_name)}
                            placeholder="First name"
                            value={users.first_name}
                          />
                          {/* {displayError(errors?.first_name?.message)} */}
                        </div>
                        {/* <div className="form-group col-md-6">
                          <label htmlFor="last_name">Last Name*</label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            placeholder="Last name"
                            onChange={handleChange}
                            className={formclass(errors?.last_name)}
                            value={users.last_name}
                          />
                          
                        </div> */}
                        <div className="form-group col-md-6">
                          <label htmlFor="email">Email Address*</label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="email"
                            onChange={handleChange}
                            className={formclass(errors?.email)}
                            value={users.email}
                          />
                          {/* {displayError(errors?.email?.message)} */}
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="phone">Mobile Number*</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Mobile no."
                            onChange={handleChange}
                            className={formclass(errors?.phone)}
                            value={users.phone}
                          />
                          {/* {displayError(errors?.phone?.message)} */}
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="password">Password*</label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className={formclass(errors?.password)}
                            value={users.password}
                          />
                          {/* {displayError(errors?.password?.message)} */}
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="firm_name">Firm Name*</label>
                          <input
                            type="text"
                            name="firm_name"
                            id="firm_name"
                            placeholder="Firm name"
                            onChange={handleChange}
                            className={formclass(errors?.firm_name)}
                            value={users.firm_name}
                          />
                          {/* {displayError(errors?.firm_name?.message)} */}
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="file">Firm Logo*</label>
                          <div className="custom__file-upload">
                            <input
                              type="file"
                              id="file"
                              name="file"
                              className="form-control"
                              accept="image/*"
                              // onChange={handleFileChange}
                              {...register("file", {
                                validate: (value) => {
                                  // checkFile(value[0].name) || "Invalid File"
                                  if (
                                    typeof value[0]?.name != "undefined" &&
                                    checkFile(value[0]?.name)
                                  ) {
                                    const isOkay = previewImage(
                                      value[0],
                                      "#previewImage"
                                    );
                                    setIsPreviewed(isOkay);
                                    return isOkay;
                                  } else {
                                    if (
                                      typeof value[0]?.name == "undefined" ||
                                      value[0]?.name == ""
                                    ) {
                                      if (saveOldFile) {
                                        resetOldImage(saveOldFile);
                                        setIsPreviewed(true);
                                      } else {
                                        setIsPreviewed(false);
                                      }
                                      return true;
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
                          {/* <img src={`/uploads/${users.firm_logo}`} style={{ width: '100px', height: '100px' }}/> */}
                          <div className="form-group col-md-1">
                            <img
                              src={`/uploads/${saveOldFile}`}
                              id="previewImage"
                              alt="image"
                              width={"100%"}
                              hidden={!isPreviewed}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="dropdown">Select an Plan:</label>
                            <select
                              id="plans"
                              name="plans"
                              // value={selectedOption}
                              className="form-control"
                              onChange={handleChange}
                              value={users.plans}
                              // {...register("plans", {
                              //   required: "Select the Plan",
                              // })}
                              // onChange={handleSelectChange}
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
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="duration">Duration</label>

                            <select
                              id="duration"
                              name="duration"
                              value={duration}
                              className="form-control"
                              // className={formclass(errors?.duration)}

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
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="plan_start">Plan Start Date</label>
                            <input
                              type="date"
                              name="plan_start"
                              id="plan_start"
                              onChange={handleStartDateChange}
                              value={startDate}
                              className={formclass(errors?.plan_start)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="plan_expiry">
                              Plan Expiry Date{" "}
                            </label>
                            <input
                              type="text"
                              name="plan_expiry"
                              id="plan_expiry"
                              value={endDate}
                              className="form-control"
                              disabled
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
                              value={users.plan_status}
                              className={formclass(errors?.plan_status)}
                              onChange={handleChange}
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
                              value={users.payment_status}
                              onChange={handleChange}
                            >
                              <option value={""}>--Please Select--</option>
                              <option value="1">Pending </option>
                              <option value="2">Completed</option>
                            </select>
                            {/* {displayError(errors?.payment_status?.message)} */}
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

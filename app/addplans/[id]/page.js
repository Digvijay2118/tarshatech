"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { displayLoader } from "../../UtilsComponent/DisplayLoader";
import { useForm } from "react-hook-form";
import {
  formclass,
  displayError,
  checkFile,
} from "../../services/ValidationService";
import { floatPattern } from "../../services/pattern";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
//Deposit_Expense
const Add = () => {
  const { id } = useParams();
  const Id = id;

  const navigate = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [duration, setDuration] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [options, setOptions] = useState([]);
  const [plans, setPlans] = useState({
    plans_id: "",
    gst: "",
    max_admin_allow: "",
    max_users_allow: "",
    max_customer: "",
    start_date: "",
    expiry_date: "",
    duration: "",
    max_file: "",
    max_upload_size: "",
    price: "",
    final_price: "",
    discount_price: "",
  });

  useEffect(() => {
    // Get the id from local storage
    const storedId = localStorage.getItem("userId");
    setEditId(storedId);
  }, []);

  // console.log("storedid===>", editId);

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  const goBack = () => {
    const storedPath = localStorage.getItem("customerpath");
    navigate.push(storedPath);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlans((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const updatedPlans = {
        ...plans,
        duration: duration,
        plans_id: selectedOption, // Assuming selectplan is the field name for the selected plan id
      };

      const responseData = await axios.put(`/api/plans/${Id}`, updatedPlans);

      setPlans({
        active: "",
        plans_id: "",
        support_text: "",
        gst: "",
        max_admin_allow: "",
        max_users_allow: "",
        max_customer: "",
        start_date: "",
        expiry_date: "",
        duration: "",
        max_file: "",
        max_upload_size: "",
        price: "",
        final_price: "",
        discount_price: "",
      });

      // Use responseData instead of res
      if (responseData.status === 200) {
        if (!responseData.data.error) {
          setLoading(false);
          toast.success(responseData.data.message);

          const storedPath = localStorage.getItem("customerpath");
          navigate.push(storedPath);
        } else {
          setLoading(false);
          toast.error(responseData.data.message);
        }
      } else {
        setLoading(false);
        toast.error(
          responseData.data?.message || "Something went wrong with the request"
        );
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(err?.message || "Something went wrong with the request");
    }
  };

  useEffect(() => {
    if (Id) {
      // Make an API call to retrieve the user data
      const fetchOptions = async () => {
        try {
          const response = await axios.get(`/api/plans/${Id}`);
          console.log("response===>", response);
          const plansData = response.data.user[0][0];
          plansData.start_date = plansData.start_date
            ? new Date(plansData.start_date).toISOString().split("T")[0]
            : "";
          plansData.expiry_date = plansData.expiry_date
            ? new Date(plansData.expiry_date).toISOString().split("T")[0]
            : "";
          setSelectedOption(plansData.plans_id);
          setDuration(plansData.duration);
          setPlans(plansData);
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      };

      fetchOptions();
    }
  }, [Id, setValue]);

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
    const selectedPlanId = e.target.value;
    setSelectedOption(selectedPlanId);

    // Set duration options based on the selected plan
    const selectedPlan = options.find(
      (option) => option.id === parseInt(selectedPlanId)
    );

    if (selectedPlan) {
      if (selectedPlan.id === 2) {
        // For plan id 1, set duration options for months
        setDurationOptions([1, 2, 3, 6, 12]);
        setDuration("");
      } else if (selectedPlan.id === 3) {
        // For plan id 2, set duration options for years
        setDurationOptions([2, 3]); // Adjust this based on your actual requirements
        setDuration("");
      }
    }
  };
  const handleduration = (e) => {
    setDuration(e.target.value);
  };

  return (
    <>
      <Header />
      <Sidebar />

      <div className="content__wrapper">
        <section className="page-content">
          <div className="page-title mobile-title">
            <h1 className="h4 mb-0">Edit</h1>
            <p className="mb-4">Plans</p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-5">
                <div className="card-header bg-transparent border-0 mb-5 p-0">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-6">
                      <h6 className="title-line text-shadow-yellow mb-0 pb-3">
                        Edit Plans
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
                    displayLoader(null)
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="form-group col">
                          <label htmlFor="dropdown">Select Plan:</label>

                          <select
                            id="plans_id"
                            name="plans_id"
                            value={selectedOption}
                            className={formclass(errors?.plans)}
                            {...register("plans_id", {
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
                          {displayError(errors?.plans?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="max_users_allow">
                            {" "}
                            Team Members Allow
                          </label>
                          <input
                            type="text"
                            name="max_users_allow"
                            id="max_users_allow"
                            placeholder="Enter user"
                            value={plans.max_users_allow}
                            className={formclass(errors?.max_users_allow)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.max_users_allow?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="max_customer"> Customer</label>
                          <input
                            type="text"
                            name="max_customer"
                            id="max_customer"
                            placeholder="Enter customer"
                            value={plans.max_customer}
                            className={formclass(errors?.max_customer)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.max_customer?.message)}
                        </div>
                      </div>
                      <div className="row"></div>

                      <div className="row">
                        <div className="form-group col">
                          <label htmlFor="max_file">Max File</label>
                          <input
                            type="text"
                            name="max_file"
                            id="max_file"
                            placeholder="Enter file"
                            value={plans.max_file}
                            className={formclass(errors?.max_file)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.max_file?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="max_upload_size">
                            Max upload Size(mb)
                          </label>
                          <input
                            type="text"
                            name="max_upload_size"
                            id="max_upload_size"
                            placeholder="Enter upload Size"
                            value={plans.max_upload_size}
                            className={formclass(errors?.max_upload_size)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.max_upload_size?.message)}
                        </div>
                        <div className="form-group col">
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
                            {durationOptions.map((option) => (
                              <option key={option} value={option}>
                                {selectedOption === "2"
                                  ? `${option} month`
                                  : `${option} year`}
                              </option>
                            ))}
                          </select>
                          {displayError(errors?.plans?.message)}
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col">
                          <label htmlFor="price">Net Amount</label>
                          <input
                            type="text"
                            name="price"
                            id="price"
                            placeholder="Enter price per month"
                            value={plans.price}
                            className={formclass(errors?.price)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.price?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="discount_price">Discount Price</label>
                          <input
                            type="text"
                            name="discount_price"
                            id="discount_price"
                            placeholder="Enter Discount price"
                            value={plans.discount_price}
                            className={formclass(errors?.discount_price)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.discount_price?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="gst">GST%</label>
                          <input
                            type="text"
                            name="gst"
                            id="gst"
                            value={plans.gst}
                            placeholder="Enter gst in Percent"
                            className={formclass(errors?.gst)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.gst?.message)}
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col">
                          <label htmlFor="final_price">Final Price</label>
                          <input
                            type="text"
                            name="final_price"
                            id="final_price"
                            placeholder="Enter Final Price"
                            value={plans.final_price}
                            className={formclass(errors?.final_price)}
                            onChange={handleChange}
                          />
                          {displayError(errors?.final_price?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="filename">Start Date*</label>
                          <input
                            type="date"
                            name="start_date"
                            value={plans.start_date}
                            className={formclass(errors?.start_date)}
                            onChange={handleChange}
                            id="start_date"
                          />
                          {displayError(errors?.start_date?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="filename">End Date*</label>
                          <input
                            type="date"
                            name="expiry_date"
                            value={plans.expiry_date}
                            className={formclass(errors?.expiry_date)}
                            id="expiry_date"
                            onChange={handleChange}
                          />
                          {displayError(errors?.expiry_date?.message)}
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

export default Add;

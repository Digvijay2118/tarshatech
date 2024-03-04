"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { displayLoader } from "../UtilsComponent/DisplayLoader";
import { useForm } from "react-hook-form";
import {
  formclass,
  displayError,
  checkFile,
} from "../services/ValidationService";
import { floatPattern } from "../services/pattern";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

//Deposit_Expense
const Add = () => {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [duration, setDuration] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date());
  const [options, setOptions] = useState([]);
  const [netAmount, setNetAmount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [gst, setGst] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [initialPricePerMonth, setInitialPricePerMonth] = useState(0);

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

  const onSubmit = async (data) => {
    console.log("data==>",data)
    try {
      setLoading(true);
      data.user_id = localStorage.getItem("userId");
      data.comp_id = localStorage.getItem("comp_id");
      data.netAmount = netAmount;
      data.finalPrice = finalPrice;
     

      const planEndDate = endDate;
      const [day, month, year] = planEndDate.split("/");
      const newDate = new Date(`${year}-${month}-${day}`);
      const formattedEndDate = newDate.toISOString().split("T")[0];
      data.enddate = formattedEndDate;
      
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const responseData = await res.json();

        if (!responseData.error) {
          setLoading(false);
          toast.success(responseData.message);
          const storedPath = localStorage.getItem("customerpath");
          navigate.push(storedPath);
        } else {
          setLoading(false);
          toast.error(responseData.message);
        }
      } else {
        setLoading(false);
        const errorData = await res.json();
        toast.error(
          errorData?.message
            ? errorData.message
            : "Something went wrong with the request"
        );
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(
        err?.message ? err.message : "Something went wrong with the request"
      );
    }
  };

  // const handleSelectChange = (e) => {
  //   setSelectedOption(e.target.value);
  //   console.log("selct==>", selectedOption);
  // };

  const handleSelectChange = (e) => {
    const selectedPlanId = e.target.value;
    setSelectedOption(selectedPlanId);
    console.log("selectedPlanId-->", selectedPlanId);

    // Find the selected plan from options
    const selectedPlan = options.find(
      (plan) => plan.id === parseInt(selectedPlanId)
    );
    console.log("selectedPlan==>", selectedPlan);

    // If the selected plan is found, update the max user and max customer fields
    if (selectedPlan) {
      console.log("Selected Plan ID:", selectedPlan.id);
      setValue("max_user_allow", selectedPlan.max_user_allow);
      setValue("max_customer", selectedPlan.max_customer);
      setValue("max_file", selectedPlan.max_file);
      setValue("max_upload_size", selectedPlan.max_upload_size);
      // setValue("gst", selectedPlan.gst);
      setValue("price", selectedPlan.price_per_month);
      setNetAmount(selectedPlan.price_per_month);
      setInitialPricePerMonth(selectedPlan.price_per_month);
    }
  };

  const handleduration = (e) => {
    const selectedDuration = e.target.value;
    setDuration(selectedDuration);
  };

  useEffect(() => {
    if (duration && startDate) {
      const endDate = new Date(startDate);
      let multiplier = 1;
      if (duration === "1") {
        endDate.setMonth(endDate.getMonth() + 3);
        multiplier = 3;
      } else if (duration === "2") {
        endDate.setMonth(endDate.getMonth() + 6);
        multiplier = 6;
      } else if (duration === "3") {
        endDate.setFullYear(endDate.getFullYear() + 1);
        multiplier = 12;
      } else if (duration === "4") {
        endDate.setFullYear(endDate.getFullYear() + 2);
        multiplier = 24;
      }
      const formattedEndDate = endDate.toLocaleDateString("en-GB"); // Format to "dd-mm-yyyy"
      setEndDate(formattedEndDate);
      const newNetAmount = parseFloat(initialPricePerMonth) * multiplier;
      console.log("newNetAmountnewNetAmount==>", newNetAmount);
      setNetAmount(newNetAmount.toFixed(2));
    }
  }, [duration, startDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  useEffect(() => {
    const calculateFinalPrice = () => {
      const netPrice = parseFloat(netAmount);
      const discount = parseFloat(discountPrice) || 0;
      const gstValue = parseFloat(gst) || 0;

      const discountedAmount = (netPrice * (100 - discount)) / 100;
      const gstAmount = (discountedAmount * gstValue) / 100;
      const finalPrice = discountedAmount + gstAmount;

      setFinalPrice(finalPrice.toFixed(2));
    };

    calculateFinalPrice();
  }, [netAmount, discountPrice, gst]);

  return (
    <>
      <Header />
      <Sidebar />

      <div className="content__wrapper">
        <section className="page-content">
          <div className="page-title mobile-title">
            <h1 className="h4 mb-0">Add</h1>
            <p className="mb-4">Plans</p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-5">
                <div className="card-header bg-transparent border-0 mb-5 p-0">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-10">
                      <h6 className="title-line text-shadow-yellow mb-0 pb-3">
                        Add Plans
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
                          <label htmlFor="title">Select Plan</label>
                          <select
                            id="plans"
                            name="plans"
                            value={selectedOption}
                            className={formclass(errors?.plans)}
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
                          {displayError(errors?.plans?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="max_user_allow">
                            Team Members Allow
                          </label>
                          <input
                            type="text"
                            name="max_user_allow"
                            id="max_user_allow"
                            placeholder="Enter user"
                            className="form-control"
                            {...register("max_user_allow")}
                            disabled
                          />
                        </div>
                        <div className="form-group col">
                          <label htmlFor="max_customer"> Customer</label>
                          <input
                            type="text"
                            name="max_customer"
                            id="max_customer"
                            placeholder="Enter customer"
                            className="form-control"
                            {...register("max_customer")}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col">
                          <label htmlFor="max_file">File</label>
                          <input
                            type="text"
                            name="max_file"
                            id="max_file"
                            placeholder="Enter file"
                            className="form-control"
                            {...register("max_file")}
                            disabled
                          />
                        </div>
                        <div className="form-group col">
                          <label htmlFor="max_upload_size">
                            upload Size(mb)
                          </label>
                          <input
                            type="text"
                            name="max_upload_size"
                            id="max_upload_size"
                            placeholder="Enter upload Size"
                            className="form-control"
                            {...register("max_upload_size")}
                            disabled
                          />
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
                            <option value="1">3 months</option>
                            <option value="2">6 Months</option>
                            <option value="3">1 Yr</option>
                            <option value="4">2 Yr</option>
                          </select>
                          {displayError(errors?.plan_start_date?.message)}
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
                            className="form-control"
                            value={netAmount}
                            {...register("price")}
                            disabled
                          />
                        </div>
                        <div className="form-group col">
                          <label htmlFor="discount_price">Discount Price</label>
                          <input
                            type="text"
                            name="discount_price"
                            id="discount_price"
                            placeholder="Enter Discount price"
                            className={formclass(errors?.discount_price)}
                            {...register("discount_price", {
                              required: "Required",
                              pattern: {
                                value: floatPattern,
                                message: "Should be in number",
                              },
                              validate: (value) =>
                                value > 0 || "Should be greater than zero",
                            })}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                          />
                          {displayError(errors?.discount_price?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="gst">GST%</label>
                          <input
                            type="text"
                            name="gst"
                            id="gst"
                            placeholder="Enter gst in Percent"
                            className={formclass(errors?.gst)}
                            {...register("gst", {
                              required: "Required",
                              pattern: {
                                value: floatPattern,
                                message: "Should be in number",
                              },
                              validate: (value) =>
                                value > 0 || "Should be greater than zero",
                            })}
                            onChange={(e) => setGst(e.target.value)}
                          />
                          {displayError(errors?.gst?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="final_price">Final Price </label>
                          <input
                            type="text"
                            name="final_price"
                            id="final_price"
                            placeholder="Enter Final Price"
                            className="form-control"
                            value={finalPrice}
                            {...register("final_price")}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col">
                          <label htmlFor="filename">Start Date*</label>
                          <input
                            type="date"
                            name="start_date"
                            id="start_date"
                            value={startDate}
                            className={formclass(errors?.start_date)}
                            {...register("start_date", {
                              required: "Required",
                            })}
                            onChange={handleStartDateChange}
                          />
                          {displayError(errors?.start_date?.message)}
                        </div>
                        <div className="form-group col">
                          <label htmlFor="filename">End Date*</label>
                          <input
                            type="text"
                            name="end_date"
                            className="form-control"
                            id="end_date"
                            value={endDate}
                            {...register("end_date")}
                            disabled
                          />
                        </div>
                        {/* <div className="form-group col">
                        <label htmlFor="sell_price_year">Sell Price Year</label>
                        <input
                          type="text"
                          name="sell_price_year"
                          id="sell_price_year"
                          placeholder="Enter sell price year"
                          className={formclass(errors?.sell_price_year)}
                          {...register("sell_price_year", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > 0 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.sell_price_year?.message)}
                      </div> */}
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

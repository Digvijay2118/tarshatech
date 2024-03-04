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
import { GetDate, todayDate } from "../services/DateTimeService";
import { floatPattern } from "../services/pattern";
import toast from "react-hot-toast";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

//Deposit_Expense
const Add = () => {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

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
    // const storedPath = localStorage.getItem("customerpath");
    navigate.push("/dashboard");
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch("/api/mstplans", {
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

          navigate.push("/dashboard");
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
                        <label htmlFor="title">Plan Name</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter Name"
                          className={formclass(errors?.title)}
                          {...register("title", {
                            required: "Required",
                          })}
                        />
                        {displayError(errors?.title?.message)}
                      </div>

                      <div className="form-group col">
                        <label htmlFor="support_text">Support Text</label>
                        <input
                          type="text"
                          name="support_text"
                          id="support_text"
                          placeholder="Enter text"
                          className={formclass(errors?.support_text)}
                          {...register("support_text", {
                            required: "Required",
                          })}
                        />
                        {displayError(errors?.support_text?.message)}
                      </div>
                    </div>
                    <div className="row">
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
                              value > -1 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.gst?.message)}
                      </div>
                      {/* <div className="form-group col">
                        <label htmlFor="max_admin_allow">Max Admin Allow</label>
                        <input
                          type="text"
                          name="max_admin_allow"
                          id="max_admin_allow"
                          placeholder="Enter admin"
                          className={formclass(errors?.max_admin_allow)}
                          {...register("max_admin_allow", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > 0 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.max_admin_allow?.message)}
                      </div> */}
                    </div>
                    <div className="row">
                      <div className="form-group col">
                        <label htmlFor="max_user_allow">Max Team Members Allow</label>
                        <input
                          type="text"
                          name="max_user_allow"
                          id="max_user_allow"
                          placeholder="Enter user"
                          className={formclass(errors?.max_user_allow)}
                          {...register("max_user_allow", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > 0 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.max_user_allow?.message)}
                      </div>
                      <div className="form-group col">
                        <label htmlFor="max_customer">Max Customer</label>
                        <input
                          type="text"
                          name="max_customer"
                          id="max_customer"
                          placeholder="Enter customer"
                          className={formclass(errors?.max_customer)}
                          {...register("max_customer", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > 0 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.max_customer?.message)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col">
                        <label htmlFor="max_file">Max File</label>
                        <input
                          type="text"
                          name="max_file"
                          id="max_file"
                          placeholder="Enter file"
                          className={formclass(errors?.max_file)}
                          {...register("max_file", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > 0 || "Should be greater than zero",
                          })}
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
                          className={formclass(errors?.max_upload_size)}
                          {...register("max_upload_size", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > 0 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.max_upload_size?.message)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col">
                        <label htmlFor="price_per_month">Price Per Month</label>
                        <input
                          type="text"
                          name="price_per_month"
                          id="price_per_month"
                          placeholder="Enter price per month"
                          className={formclass(errors?.price_per_month)}
                          {...register("price_per_month", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > -1 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.price_per_month?.message)}
                      </div>
                      <div className="form-group col">
                        <label htmlFor="sell_price_month">
                          Sell Price Per Month
                        </label>
                        <input
                          type="text"
                          name="sell_price_month"
                          id="sell_price_month"
                          placeholder="Enter sell price"
                          className={formclass(errors?.sell_price_month)}
                          {...register("sell_price_month", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > -1 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.sell_price_month?.message)}
                      </div>
                      <div className="form-group col">
                        <label htmlFor="price_per_year">Price Per Year</label>
                        <input
                          type="text"
                          name="price_per_year"
                          id="price_per_year"
                          placeholder="Enter price per year"
                          className={formclass(errors?.price_per_year)}
                          {...register("price_per_year", {
                            required: "Required",
                            pattern: {
                              value: floatPattern,
                              message: "Should be in number",
                            },
                            validate: (value) =>
                              value > -1 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.price_per_year?.message)}
                      </div>
                      <div className="form-group col">
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
                              value > -1 || "Should be greater than zero",
                          })}
                        />
                        {displayError(errors?.sell_price_year?.message)}
                      </div>
                    </div>
                    {/* <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="plan_start_date">
                            Plan Start Date
                          </label>
                          <input
                            type="date"
                            name="plan_start_date"
                            id="plan_start_date"
                            {...register("plan_start_date", {
                              required: "Required",
                            })}
                            defaultValue={todayDate()}
                            className={formclass(errors?.plan_start_date)}
                          />
                          {displayError(errors?.plan_start_date?.message)}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="plan_expiry_date">
                            Plan Expiry Date{" "}
                          </label>
                          <input
                            type="date"
                            name="plan_expiry_date"
                            id="plan_expiry_date"
                            {...register("plan_expiry_date", {
                              required: "Required",
                            })}
                            defaultValue={todayDate()}
                            className={formclass(errors?.plan_expiry_date)}
                          />
                          {displayError(errors?.plan_expiry_date?.message)}
                        </div>
                      </div>
                    </div> */}

                    <div className="row">
                      <div className="form-group mb-0 col-md-2">
                        <button type="submit" className="btn">
                          Submit
                        </button>
                      </div>
                      <div className="form-group mb-0 col-md-4">
                        <button type="submit" onClick={goBack} className="btn">
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

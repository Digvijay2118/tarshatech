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
import Header from "../components/header";
import Sidebar from "../components/sidebar";

//Deposit_Expense
const Add = () => {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },

    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  const goBack = () => {
    navigate.push(`/notification`);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch("/api/notification", {
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
          navigate.push(`/notification`);
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
          <p className="mb-4">Notification</p>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-5">
              <div className="card-header bg-transparent border-0 mb-5 p-0">
                <div className="row align-items-center justify-content-between">
                  <div className="col-md-12">
                    <h6 className="title-line text-shadow-yellow mb-0 pb-3">
                      Add Notification
                    </h6>
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
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter title"
                          className={formclass(errors?.title)}
                          {...register("title", {
                            required: "Required",
                          })}
                        />
                        {displayError(errors?.title?.message)}
                      </div>
                      <div className="form-group col">
                        <label htmlFor="send_to">Send To</label>
                        <select
                          name="send_to"
                          id="send_to"
                          className={formclass(errors?.send_to)}
                          {...register("send_to", {
                            required: false,
                          })}
                        >
                          <option value={"0"}>--Please Select--</option>
                          <option value="1">All user</option>
                          <option value="2">Customer</option>
                        </select>
                        {displayError(errors?.support_text?.message)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col">
                        <label htmlFor="periodic">description</label>
                        <textarea
                          type="text"
                          name="description"
                          id="description"
                          placeholder="description"
                          cols={30}
                          rows={5}
                          className={formclass(errors?.description)}
                          {...register("description", {
                            required: "Required",
                          })}
                        />
                        {displayError(errors?.periodic?.message)}
                      </div>
                    </div>

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

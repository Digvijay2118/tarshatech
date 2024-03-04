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
  const navigate = useRouter();

  const [loading, setLoading] = useState(false);
  const [transcation, setTranscation] = useState({
    transaction_type: "",
    transcation_id: "",
    amount: "",
    gst: "",
    round_off: "",
    total: "",
    transcation_status: "",
  });

  const id = useParams();
  const Id = id.id;

  const {
    register,
    formState: { errors },

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
    setTranscation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const responseData = await axios.put(
        `/api/transcation/${Id}`,
        transcation
      );
      setTranscation({
        transaction_type: "",
        transcation_id: "",
        amount: "",
        gst: "",
        round_off: "",
        total: "",
        transcation_status: "",
      });

      if (!responseData.error) {
        setLoading(false);
        toast.success(responseData.message);
        const storedPath = localStorage.getItem("customerpath");
        navigate.push(storedPath);
      } else {
        setLoading(false);
        toast.error(responseData.message);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(
        err?.message ? err.message : "Something went wrong with the request"
      );
    }
  };

  useEffect(() => {
    if (Id) {
      // Make an API call to retrieve the user data
      const fetchOptions = async () => {
        try {
          const response = await axios.get(`/api/transcation/${Id}`);
          console.log("response===>", response.data.transcation[0][0]);
          const userData = response.data.user[0][0];

          setTranscation(userData);
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      };

      fetchOptions();
    }
  }, [Id]);

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content__wrapper">
        <section className="page-content">
          <div className="page-title mobile-title">
            <h1 className="h4 mb-0">Add</h1>
            <p className="mb-4">Transcation</p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-5">
                <div className="card-header bg-transparent border-0 mb-5 p-0">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-12">
                      <h6 className="title-line text-shadow-yellow mb-0 pb-3">
                        Add Transcation
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
                        <div className="col-lg-4">
                          <div className="form-group">
                            <label htmlFor="dropdown">Modes</label>
                            <select
                              id="transaction_type"
                              name="transaction_type"
                              className="form-control"
                              onChange={handleChange}
                              value={transcation?.transaction_type}
                            >
                              <option value="" disabled>
                                Select Transcation type
                              </option>
                              <option value="1">Online </option>
                              <option value="2">Cash</option>
                              <option value="3">Cheque</option>
                            </select>
                            {/* {displayError(errors?.payment_status?.message)} */}
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="form-group">
                            <label htmlFor="transcation_id">
                              Transcation_Id
                            </label>
                            <input
                              type="text"
                              name="transcation_id"
                              id="transcation_id"
                              placeholder="Enter Transcation Id"
                              onChange={handleChange}
                              value={transcation?.transcation_id}
                              className={formclass(errors?.transcation_id)}
                            />
                            {/* {displayError(errors?.transcation_id?.message)} */}
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input
                              type="text"
                              name="amount"
                              id="amount"
                              placeholder="Enter Amount"
                              onChange={handleChange}
                              value={transcation?.amount}
                              className={formclass(errors?.amount)}
                            />
                            {/* {displayError(errors?.amount?.message)} */}
                          </div>
                        </div>
                        {/* {displayError(errors?.payment_status?.message)} */}
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label htmlFor="gst">GST</label>
                              <input
                                type="text"
                                name="gst"
                                id="gst"
                                placeholder="Enter gst in Percent"
                                className={formclass(errors?.gst)}
                                onChange={handleChange}
                                value={transcation?.gst}
                              />
                              {displayError(errors?.gst?.message)}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label htmlFor="round_off">Round off</label>
                              <input
                                type="text"
                                name="round_off"
                                id="round_off"
                                placeholder="Enter Round Off"
                                onChange={handleChange}
                                value={transcation?.round_off}
                                className={formclass(errors?.round_off)}
                              />
                              {/* {displayError(errors?.transcation_id?.message)} */}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label htmlFor="total">Total</label>
                              <input
                                type="text"
                                name="total"
                                id="total"
                                placeholder="Enter  Total  Amount"
                                onChange={handleChange}
                                value={transcation?.total}
                                className={formclass(errors?.total)}
                              />
                              {displayError(errors?.total?.message)}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label htmlFor="transcation_status">
                                Transcation Status
                              </label>
                              <select
                                id="transcation_status"
                                name="transcation_status"
                                className="form-control"
                                onChange={handleChange}
                                value={transcation?.transcation_status}
                              >
                                <option value="1">Successful   </option>
                                <option value="2">UnSuccessful</option>
                              </select>
                              {/* {displayError(errors?.total?.message)} */}
                            </div>
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

export default Add;

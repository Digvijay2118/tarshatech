"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faEdit,
  faLock,
  faPlus,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { SwalAlert } from "../../UtilsComponent/SwalDialog";
import toast from "react-hot-toast";
import Link from "next/link";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";

const List = () => {
  const { id } = useParams();
  const Id = id;
  const navigate = useRouter();

  const [plans, setPlans] = useState([]);
  const [transcation, setTranscation] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data for Table 1
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/plans/${Id}`);
        const transactionsResponse = await axios.get(`/api/transcation/${Id}`);
        console.log("trabnsxayi==>", transactionsResponse);
        setPlans(response.data.plans[0]);
        setTranscation(transactionsResponse.data.transcation[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data for Table 1:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [Id]);

  // Fetch data for Table 2
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(`/api/transcation/${Id}`);
  //       setTranscation(response.data.user[0]);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data for Table 2:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [Id]);

  const goBack = () => {
    navigate.push("/companies");
    localStorage.removeItem("customerpath");
    localStorage.removeItem("userId");
  };

  const removeRow = (id) => {
    try {
      // setPlans((prevState) => {
      //   return prevState.filter((d) => {
      //     return parseInt(d?.id) != parseInt(id);
      //   });
      // });
      setPlans((prevState) => prevState.filter((plan) => plan.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const removetranscations = (id) => {
    try {
      // setTranscation((prevState) => {
      //   return prevState.filter((d) => {
      //     return parseInt(d?.id) != parseInt(id);
      //   });
      // });
      setTranscation((prevState) =>
        prevState.filter((transaction) => transaction.id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeDeposit = async (id) => {
    try {
      setLoading(true);

      const response = await axios.post(`/api/plans/${id}`);
      if (!response.data.error) {
        setLoading(false);
        removeRow(id);
        toast.success(response.data.message);
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (err) {
      setLoading(false);

      console.error(err);

      toast.error(err.response?.data?.message);
    }
  };

  const removetransction = async (id) => {
    try {
      setLoading(true);

      const response = await axios.post(`/api/transcation/${id}`);

      if (!response.data.error) {
        setLoading(false);
        removetranscations(id);
        toast.success(response.data.message);
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (err) {
      setLoading(false);

      console.error(err);

      toast.error(err.response?.data?.message);
    }
  };

  const onRemoveDeposit = (id) => {
    SwalAlert({})
      .then(async (result) => {
        if (result?.isConfirmed) {
          await removeDeposit(id);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to remove");
      });
  };
  const onRemovetrasncation = (id) => {
    SwalAlert({})
      .then(async (result) => {
        if (result?.isConfirmed) {
          await removetransction(id);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to remove");
      });
  };
  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Return empty string if date string is falsy
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    return `${day} ${month} ${year}`;
  };

  const handleAddTransaction = (planId) => {
    localStorage.setItem("plantId", planId); // Set the planId in localStorage
    // navigate.push("/addtranscation");
  };

  const getTransactionStatus = (status) => {
    switch (status) {
      case 1:
        return "Successful";
      case 2:
        return "Unsuccessful";
      default:
        return "Unknown";
    }
  };

  const getTransactionType = (type) => {
    switch (type) {
      case 1:
        return "Online";
      case 2:
        return "Cash";
      case 3:
        return "Cheque";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content__wrapper">
        <section className="page-content">
          <div className="page-title mobile-title">
            <h1 className="h4 mb-0">Plans</h1>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="text-shadow-yellow px-2 mb-0">Plans</h5>
                <div className="mb-2 d-flex justify-content-end">
                  <Link href="/addplans">
                    <button className="btn btn-primary mr-2 btn-sm">
                      <FontAwesomeIcon icon={faPlus} />
                      Add
                    </button>
                  </Link>
                  <button
                    className="btn btn-secondary mx-1 btn-sm"
                    onClick={goBack}
                  >
                    <FontAwesomeIcon icon={faBackward} />
                  </button>
                </div>
              </div>
              {plans.map((plan) => (
                <div className="card mb-3 h-auto" key={plan.id}>
                  <div className="card-body main_card">
                    <h5 className="text-shadow-yellow px-2 mb-4">Plan</h5>
                    <table className="table main_table">
                      <thead className="thead-black">
                        <tr>
                          <th>Sr.no</th>
                          <th>Team</th>
                          <th>Client</th>
                          <th>GST</th>
                          <th>Price</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Created at</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>{plan.max_users_allow}</td>
                          <td>{plan.max_customer}</td>
                          <td>{plan.gst}</td>
                          <td>{plan.final_price}</td>
                          <td>{formatDate(plan.start_date)}</td>
                          <td>{formatDate(plan.expiry_date)}</td>
                          <td>{formatDate(plan.created_at)}</td>

                          <td>{plan.status}</td>
                          <td>
                            {/* <Link href={`/addplans/${plan.id}`}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Link> */}
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => onRemoveDeposit(plan.id)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="mb-1 d-flex justify-content-end">
                      <Link href="/addtranscation">
                        <button
                          className="btn btn-primary mr-2 btn-sm"
                          onClick={() => handleAddTransaction(plan.id)}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add
                        </button>
                      </Link>
                    </div>
                    <h5 className="text-shadow-yellow px-2 mb-4">
                      Transactions
                    </h5>
                    <table className="table inner_table">
                      <thead className="thead-black">
                        <tr>
                          <th>Sr.no</th>
                          <th>Transaction Id</th>
                          <th>Mode</th>
                          <th>Payment Status</th>
                          <th>Final Price</th>
                          <th>Created at</th>
                          <th>Updated at</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transcation
                          .filter((transaction) => {
                            const result =
                              transaction.comp_plans_id === plan.id;
                            console.log("---->", result); // Log the result of the comparison
                            console.log(
                              "transaction==>",
                              transaction.comp_plans_id
                            );
                            console.log("plan.plans_id==>", plan.id);
                            return result;
                          })

                          .map((transaction, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{transaction.transcation_id}</td>
                              <td>
                                {getTransactionType(
                                  transaction.transaction_type
                                )}
                              </td>
                              <td>
                                {getTransactionStatus(
                                  transaction.transcation_status
                                )}
                              </td>
                              <td>{transaction.total}</td>
                              <td>{formatDate(transaction.created_at)}</td>
                              <td>{formatDate(transaction.updated_at)}</td>
                              <td>
                                <Link
                                  href={`/addtranscation/${transaction.id}`}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Link>
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  onClick={() =>
                                    onRemovetrasncation(transaction.id)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default List;

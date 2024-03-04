import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

function Support() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectStatus, setSelectStatus] = useState("Active");
  const [support, setSupport] = useState({
    name: "",
    status: selectStatus,
    email: "",
    subject: "",
    priority: selectedOption,
    message: "",
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  // Fetch name and email from localStorage on component mount
  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));

    if (userinfo) {
      setValue("name", userinfo.fullname); // assuming 'name' is the field name
      setValue("email", userinfo.user_email);
      setValue("firm_name", userinfo.firm_name);
      // setValue("message", supportData.message);
      // setValue("subject", supportData.subject);
      // setSelectStatus(supportData.status);
      // setSelectedOption(supportData.priority);
    }
  }, []); // Empty dependency array to run the effect only once on mount

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Form Data:", data);
      const userinfo = JSON.parse(localStorage.getItem("userinfo"));
      if (userinfo) {
        data.firm_name = userinfo.firm_name;
      }
      data.priority = selectedOption;
      data.status = selectStatus;
      const res = await fetch("/api/support", {
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
          reset();
          toast.success(responseData.message);

          handleClose();
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
  const handleClose = () => {
    setShowModal(false);
  };

  const handleSelect = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleStatus = (event) => {
    setSelectStatus(event.target.value);
  };



  return (
    <div>
      <div
        className="modal fade enquiry_modal"
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel1"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button
              type="button"
              className="close_modal"
              data-bs-dismiss="modal"
              onClick={() => setShowModal(false)}
            >
              <i className="fa-solid fa-xmark">x</i>
            </button>
            <div className="modal-body p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="part_form">
                    <div className="contact_part">
                      <h5 className="heading">Support request</h5>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="input_box">
                              <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                id="name"
                                {...register("name")}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input_box">
                              <select
                                id="status"
                                name="status"
                                value={selectStatus}
                                onChange={handleStatus}
                                className="form-control"
                              >
                                <option value="Active">Active</option>
                                <option value="In Active">In Active</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input_box">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                {...register("email")}
                                disabled
                              />
                            </div>
                          </div>
                          {/* Add similar event handlers for other fields */}
                          <div className="col-lg-6">
                            <div className="box">
                              <input
                                type="text"
                                name="subject"
                                id="subject"
                                className="form-control"
                                {...register("subject")} // Make sure register is associated with "subject"
                                // value={support.subject || ""} // Ensure default value is set
                                placeholder="Subject"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input_box">
                              <select
                                id="priority"
                                name="priority"
                                value={selectedOption}
                                onChange={handleSelect}
                                className="form-control"
                              >
                                <option value="" disabled>
                                  Select Your Priority
                                </option>
                                <option value="high">High Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input_box">
                              <textarea
                                name="message"
                                rows="5"
                                id="message"
                                className="form-control"
                                placeholder="Message"
                                {...register("message")}
                                // defaultValue={support.message || ""}
                                required
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="submit_row text-center">
                          <button
                            type="submit"
                            className="main-btn btn btn-primary"
                          >
                            Send Request
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

function EditSupport({ id }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectStatus, setSelectStatus] = useState("");
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
    }
  }, []); // Empty dependency array to run the effect only once on mount

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Form Data:==>", data);
      const updatedSupport = {
        ...support,
        status: selectStatus,
        priority: selectedOption,
      };
      const responseData = await axios.put(
        `/api/support/${id}`,
        updatedSupport
      );
      const userinfo = JSON.parse(localStorage.getItem("userinfo"));

      setSupport({
        name: "",
        status: selectStatus,
        email: "",
        subject: "",
        priority: selectedOption,
        message: "",
        firm_name: userinfo.firm_name,
      });

      console.log("datatatta--->", responseData);

      if (!responseData.error) {
        setLoading(false);
        reset();
        toast.success(responseData.message);

        handleClose();
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
  const handleClose = () => {
    setShowModal(false);
  };

  const handleSelect = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleStatus = (event) => {
    const selectedValue = event.target.value;
    console.log("Selected Status:", selectedValue);
    setSelectStatus(selectedValue);
  };

  useEffect(() => {
    if (id) {
      // Make an API call to retrieve the user data
      const fetchOptions = async () => {
        try {
          const response = await axios.get(`/api/support/${id}`);
          const supportData = response.data[0][0];
          console.log("supportData123==>", supportData);
          setSupport(supportData);

          setSelectStatus(supportData.status);
          setSelectedOption(supportData.priority);
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      };

      fetchOptions();
    }
  }, [id, setValue]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupport((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div
        className="modal fade enquiry_modal"
        id="exampleModal2"
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
                      <h5 className="heading">View Support request</h5>
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
                                value={support.subject} // Ensure default value is set
                                placeholder="Subject"
                                onChange={handleChange}
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
                                value={support.message}
                                onChange={handleChange}
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

export default EditSupport;

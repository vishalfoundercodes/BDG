import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IfscModification = () => {
  const [bankNumber, setBankNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!bankNumber.trim()) {
      newErrors.bankNumber = "Please enter Bank Card Number";
    }
    if (!ifsc.trim()) {
      newErrors.ifsc = "Please enter IFSC";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("bankNumber", bankNumber);
      formData.append("ifsc", ifsc);

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

    //   navigate("/customerservices");
      toast.success("IFSC updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/customerservices"),
      });
    }
  };

  return (
    <div className="bg-[#f9f9ff] min-h-screen px-4 py-6 max-w-md mx-auto font-sans text-black">
      {/* <h2 className="text-center font-semibold text-lg mb-6">
        IFSC Modification
      </h2> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bank Number Input */}
        <div>
          <label className="block text-sm mb-2">
            Bank number <span className="text-[#FF717B]">*</span>
          </label>
          <input
            type="number"
            value={bankNumber}
            onChange={(e) => {
              setBankNumber(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, bankNumber: "" }));
              }
            }}
            placeholder="Please enter Bank Card Number"
            className="w-full px-4 py-2 rounded-md text-sm bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] 
    focus:outline-none focus:ring-0 focus:border-none"
          />

          {errors.bankNumber && (
            <p className="text-[#FF717B] text-sm mt-1">{errors.bankNumber}</p>
          )}
        </div>

        {/* IFSC Input */}
        <div>
          <label className="block text-sm mb-2">
            Correct IFSC code <span className="text-[#FF717B]">*</span>
          </label>
          <input
            type="text"
            value={ifsc}
            onChange={(e) => {
              setIfsc(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, ifsc: "" }));
              }
            }}
            placeholder="Please enter IFSC"
            className="w-full px-4 py-2 rounded-md text-sm bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] 
              focus:outline-none focus:ring-0 focus:border-none"
          />
          {errors.ifsc && (
            <p className="text-[#FF717B] text-sm mt-1">{errors.ifsc}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-[#EDC100] hover:bg-[#EDC100] text-white rounded-full font-semibold text-sm"
        >
          Confirm
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default IfscModification;

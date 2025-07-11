import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangeBankName = () => {
  const [userId, setUserId] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!userId.trim()) newErrors.userId = "Please enter User ID";
    if (!bankName.trim()) newErrors.bankName = "Please enter correct bank  name";
    if (!bankNumber.trim())
      newErrors.bankNumber = "Please enter Bank Number";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("bankName", bankName);
      formData.append("bankNumber", bankNumber);

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      toast.success("Bank name request send successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/customerservices"),
      });
    }
  };

  return (
    <div className="bg-[#f9f9ff] min-h-screen px-4 py-6 max-w-md mx-auto font-sans text-black">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User ID */}
        <div>
          <label className="block text-sm mb-2">
            BDGWIN ID <span className="text-[#FF717B]">*</span>
          </label>
          <input
            type="number"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, userId: "" }));
              }
            }}
            placeholder="Please enter User ID"
            className="w-full px-4 py-3 rounded-md text-sm bg-white shadow-md focus:outline-none"
          />
          {errors.userId && (
            <p className="text-[#FF717B] text-sm mt-1">{errors.userId}</p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <label className="block text-sm mb-2">
            Correct bank name <span className="text-[#FF717B]">*</span>
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => {
              setBankName(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, bankName: "" }));
              }
            }}
            placeholder="Please enter correct bank name"
            className="w-full px-4 py-3 rounded-md text-sm bg-white shadow-md focus:outline-none"
          />
          {errors.bankName && (
            <p className="text-[#FF717B] text-sm mt-1">{errors.bankName}</p>
          )}
        </div>

        {/* Bank Number */}
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
            placeholder="Please enter Bank Number"
            className="w-full px-4 py-3 rounded-md text-sm bg-white shadow-md focus:outline-none"
          />
          {errors.bankNumber && (
            <p className="text-[#FF717B] text-sm mt-1">{errors.bankNumber}</p>
          )}
        </div>

        {/* Confirm Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#EDC100] text-white rounded-full font-semibold text-sm hover:opacity-90"
        >
          Confirm
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ChangeBankName;

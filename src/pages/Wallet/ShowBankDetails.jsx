// import React from 'react'

// export default function ShowBankDetails() {
//   return (
//     <div>
//       hii
//     </div>
//   )
// }

// import React from "react";
// import { Link } from "react-router-dom";
// import { MdKeyboardArrowLeft } from "react-icons/md";
// import { FaPlus } from "react-icons/fa6";


// export default function ShowBankDetails() {
//   return (
//     <div className="min-h-screen bg-[#] text-white font-roboto p-4 space-y-0">
//       {/* Header */}
//       <div className="flex px-0 items-center justify-between bg-[#333332] text-white h-[3.22rem]">
//         <Link to={-1}>
//           <MdKeyboardArrowLeft className="text-3xl" />
//         </Link>
//         <p className="text-sm font-medium">Add a bank account</p>
//         <div className="w-6" />{" "}
//         {/* Optional right action, leave blank for spacing */}
//       </div>

//       {/* Bank Account Box */}
//       <div className="bg-[#2c2c2c] rounded-xl overflow-hidden space-y-4">
//         {/* Gold Bar */}
//         <div className="h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-[#CFA554] flex items-center px-4">
//           {/* <span className="text-sm font-medium text-black">
//             Punjab National Bank
//           </span> */}
//         </div>

//         {/* Details */}
//         <div className="p-4 space-y-3">
//           <div className="flex justify-between bg-[#3a3a3a] p-2 rounded-md text-sm">
//             <span className="text-gray-300">Bank name</span>
//             <span>Punjab National Bank</span>
//           </div>
//           <div className="flex justify-between bg-[#3a3a3a] p-2 rounded-md text-sm">
//             <span className="text-gray-300">Bank account number</span>
//             <span>789654****230</span>
//           </div>
//           <div className="flex justify-between bg-[#3a3a3a] p-2 rounded-md text-sm">
//             <span className="text-gray-300">Phone number</span>
//             <span>91123****</span>
//           </div>

//           {/* Select Radio */}
//           <label className="flex items-center space-x-2 pt-1">
//             <input
//               type="radio"
//               className="accent-yellow-400"
//               name="selectedBank"
//               defaultChecked
//             />
//             <span>Select</span>
//           </label>
//         </div>
//       </div>

//       {/* Add Bank Account Box */}
//       <div className="bg-[#2c2c2c] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
//         <div className="border border-gray-500 rounded-lg p-3">
//           <FaPlus className="text-gray-400 text-xl" />
//         </div>
//         <p className="text-sm text-gray-400">Add a bank account number</p>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import showBankDetailsaddAccount from "../../assets/usaAsset/wallet/showBankDetails-addAccount.png";
import { useNavigate } from "react-router-dom";

export default function ShowBankDetails() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-roboto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 bg-[#333332] text-white h-[3.2rem]">
        <Link to={-1}>
          <MdKeyboardArrowLeft className="text-3xl" />
        </Link>
        <p className="text-sm font-medium">Bank account</p>
        <div className="w-6" />
      </div>

      {/* Body Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Bank Account Card */}
        <div className="bg-[#2c2c2c] rounded-xl overflow-hidden">
          {/* Gold Header Bar */}
          <div className="h-10 bg-gradient-to-r from-[#EDD188] to-[#C79744] flex items-center px-4">
            {/* <span className="text-sm font-medium text-black">
              Punjab National Bank
            </span> */}
          </div>

          {/* Bank Details */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between bg-[#3a3a3a] p-2 rounded-md text-sm text-[#9FA5A1]">
              <span className="text-[#9FA5A1]">Bank name</span>
              <span>Punjab National Bank</span>
            </div>
            <div className="flex justify-between bg-[#3a3a3a] p-2 rounded-md text-sm text-[#9FA5A1]">
              <span className="text-[#9FA5A1]">Bank account number</span>
              <span>789654****230</span>
            </div>
            <div className="flex justify-between bg-[#3a3a3a] p-2 rounded-md text-sm text-[#9FA5A1]">
              <span className="text-[#9FA5A1]">Phone number</span>
              <span>91123****</span>
            </div>

            {/* Select Option */}
            <label className="flex items-center space-x-2 pt-2">
              <input
                type="radio"
                className="accent-[#FFD24C]"
                name="selectedBank"
                defaultChecked
              />
              <span>Select</span>
            </label>
          </div>
        </div>

        {/* Add Bank Account Button */}
        <div className="bg-[#2c2c2c] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer">
          <div
            className=" rounded-lg p-3"
            onClick={() => navigate("/wallet/withdrawal/addbankaccount")}
          >
            {/* <FaPlus className="text-gray-400 text-xl" /> */}
            <img
              src={showBankDetailsaddAccount}
              alt="showBankDetailsaddAccount"
              className="w-10 h-10"
            />
          </div>
          <p className="text-sm text-gray-400">Add a bank account number </p>
        </div>
      </div>
    </div>
  );
}

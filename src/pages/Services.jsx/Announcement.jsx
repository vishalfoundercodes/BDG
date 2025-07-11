import { FaBullhorn } from "react-icons/fa";
import { useState } from "react";
import Loader from "../../reusable_component/Loader/Loader";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";

const announcements = [
  {
    title: "About Withdrawal - BDGWin Game Notify",
    description:
      "Please fill in the correct bank card information. The platform will process withdrawals within 1–24 hours or more. The withdrawal status is 'Completed' and the transaction has been approved by the platform. The bank will complete the transfer within 1–7 working days, but delays may occur, especially during holidays. But you are guaranteed to receive your funds.",
    date: "2024-03-24 16:23:27",
  },
  {
    title: "About Recharge - BDGWin Game Notify",
    description:
      "Please remember the UPI ID of your payment and fill in the correct UTR number and amount to submit. When you need to continue recharging, please be sure to go to BDGWin Game to get a new UPI account again! Please make sure to follow the above steps so that your transactions can be deposited into your account faster.",
    date: "2024-03-24 16:23:05",
  },
];

const AnnouncementPage = () => {
      const [loading, setLoading] = useState(false);
  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {loading && <Loader setLoading={setLoading} loading={loading} />}
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-700">
        <Link to={-1}>
          <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
        </Link>
        <h1 className="text-lg font-semibold">Announcement</h1>
      </div>

      {/* Announcement List */}
      <div className="p-4 space-y-4">
        {announcements.map((item, index) => (
          <div
            key={index}
            className="bg-[#2c2c2c] rounded-lg p-4 shadow-md space-y-2"
          >
            <div className="flex items-center gap-2 text-[#FFD700] text-sm font-semibold">
              <FaBullhorn className="text-yellow-400 text-base" />
              <span className="text-white">{item.title}</span>
            </div>
            <p className="text-sm text-[#A8A5A1] leading-relaxed">
              {item.description}
            </p>
            <p className="text-xs text-[#606462]">{item.date}</p>
          </div>
        ))}
        <p className="text-center text-sm text-gray-400 mt-6">No more</p>
      </div>
    </div>
  );
};

export default AnnouncementPage;

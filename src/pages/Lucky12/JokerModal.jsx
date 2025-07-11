import { ImCancelCircle } from "react-icons/im";
import joker from "../../assets/jackpot/joker.gif";

/* eslint-disable react/prop-types */
export default function JokerModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex items-center justify-between text-xsm mb-4">
        <ImCancelCircle
          onClick={onClose}
          className="text-gray hover:text-white cursor-pointer"
          size={20}
        />
      </div>
      <div
        style={{
          backgroundImage: `url(${joker})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="rounded-lg p-3 w-96 h-96 shadow-xl text-white font-serif"
      ></div>
    </div>
  );
}

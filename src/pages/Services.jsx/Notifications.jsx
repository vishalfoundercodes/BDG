import { RiDeleteBinLine } from 'react-icons/ri'
import pro_notification from "../../assets/icons/pro_notification.png"
function Notifications() {
  return (
    <div className="px-2">
      <div className="bg-[#333332] shadow-lg rounded-md mt-3 p-2">
        <div className="grid grid-cols-12">
          <div className="col-span-1">
            <img src={pro_notification} alt="sdf" className="w-6 h-6" />
          </div>
          <div className="col-span-8 flex items-center font-semibold text-white">
            Notification
          </div>
          <div className="col-span-3 flex items-center justify-end">
            <RiDeleteBinLine className="text-[#CAA14C]" size={25} />
          </div>
        </div>
        <p className="text-xs text-[#666462]">2025:07:05 12:35:15</p>
        <div className="mt-2">
          <p className="text-xs text-[#9DA597]">Welcome to the tiranga:</p>
          <p className="text-xs text-[#9DA597]">
            Get ready to immerse yourself in a colorfull predeiction game
            expereince like before.
          </p>
        </div>
      </div>
      <div className="bg-[#333332] shadow-lg rounded-md mt-2 p-2">
        <div className="grid grid-cols-12">
          <div className="col-span-1">
            <img src={pro_notification} alt="sdf" className="w-6 h-6" />
          </div>
          <div className="col-span-8 flex items-center font-semibold text-white">
            Tiranga Win
          </div>

          <div className="col-span-3 flex items-center justify-end">
            <RiDeleteBinLine className="text-[#CAA14C]" size={25} />
          </div>
        </div>
        <p className="text-xs text-[#666462]">2025:07:07 11:40:30</p>
        <div className="mt-2">
          <p className="text-xs text-[#9DA597]">Tiranga Win</p>
          <p className="text-xs text-[#9DA597]">
            Get ready to immerse yourself in a colorfull predeiction game
            expereince like before.
          </p>
          </div>
      </div>
    </div>
  );
}

export default Notifications
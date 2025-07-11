/* eslint-disable react/prop-types */
import { ImCancelCircle } from "react-icons/im";

function MyHistoryModal({ data, setIsHistoryModal }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center  bg-black bg-opacity-50">
      <div className=" text-white absolute p-2 top-10 w-[340px] border-gray border-[1px] bg-blackAviator4 shadow-lg rounded-lg ">
        <div className="flex items-center justify-between text-xsm">
          <h1>Bet history</h1>
          <ImCancelCircle
            onClick={() => setIsHistoryModal(false)}
            className="text-blackLight hover:text-white"
            size={20}
          />
        </div>

        <div className="overflow-x-auto hide-scrollbar mt-5 mb-2">
          <table className="w-full min-w-max">
            <thead>
              <tr className="text-[12px] border-gray border-y">
                <th className="py-2 px-1">Date</th>
                <th className="py-2 px-1">Period no</th>
                <th className="py-2 px-1">Amount, X</th>
                <th className="py-2 px-1">Cashout </th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((item, i) => (
                  <tr key={i} className={`text-[12px] ${item?.cashout_amount>0 ? "bg-[#123405] rounded-full bg-opacity-70 border-[1px] border-[#427F00]" : ""}`}>
                    <td className="py-1 text-center">{item?.created_at}</td>
                    <td className="py-1 text-center">{item?.game_sr_num}</td>
                    <td className="py-1 text-center">{item?.amount}, <span className="bg-black py-0.5 px-3 rounded-full">{item?.multiplier}</span></td>
                    <td
                      className={`py-1 text-center ${
                        item?.cashout_amount === 0 ? "text-redAviator" : "text-green"
                      }`}
                    >
                      {item?.cashout_amount === 0 ? 0 : Number(item?.win).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-1 text-center" colSpan={6}>
                    no data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyHistoryModal;

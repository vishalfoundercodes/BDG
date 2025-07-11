/* eslint-disable react/prop-types */
import { ImCancelCircle } from "react-icons/im";
const a = [2];
function MenuModal({ balls, data, setToggleMenu }) {
  console.log("data", data);
  return (
    <div className="fixed inset-0 z-50 flex justify-center  bg-black bg-opacity-50">
      <div className=" text-white absolute p-2 top-10 w-[310px] border-gray border-[1px] bg-blackAviator4 shadow-lg rounded-lg ">
        <div className="flex items-center justify-between text-xsm">
          <h1>Game history</h1>
          <ImCancelCircle
            onClick={() => setToggleMenu(false)}
            className="text-blackLight hover:text-white"
            size={20}
          />
        </div>

        <div className="overflow-x-auto hide-scrollbar mt-5 mb-2">
          <table className="w-full min-w-max">
            <thead>
              <tr className="text-[12px] border-gray border-y">
                <th className="py-2 px-1">S.no.</th>
                <th className="py-2 px-1">Game Type</th>
                <th className="py-2 px-1">Period no</th>
                <th className="py-2 px-1">Selected ticket</th>
                <th className="py-2 px-1">Status</th>
                <th className="py-2 px-1">Amount </th>
                <th className="py-2 px-1">Win Amount </th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((item, i) => {
                  const parsedTicket = JSON.parse(item?.selected_number);
                  return (
                    <tr key={i} className="text-[12px]">
                      <td className="py-1 text-center">{i + 1}</td>
                      <td className="py-1 text-center">
                        {item?.game_id === 27
                          ? "Every Hour"
                          : item?.game_id === 28
                          ? "Every 3 Hours"
                          : item?.game_id === 29
                          ? "Once A Day"
                          : ""}
                      </td>
                      <td className="py-1 text-center">{item?.games_no}</td>
                      <td className="py-1 flex  items-center gap-0.5 text-center">
                        {parsedTicket?.map((ticket, idx) => (
                          <p key={idx} className="relative py-1 text-center">
                            <img
                              className="w-5 h-5"
                              src={balls[ticket]}
                              alt="no"
                            />
                            <p className="absolute top-1 text-black left-1.5 font-bold">
                              {ticket}
                            </p>
                          </p>
                        ))}
                      </td>
                      <td
                        className={`py-1 text-center ${
                          item?.status === "0" ? "text-yellow" : "text-green"
                        }`}
                      >
                        {item?.status === "0" ? "Pending" : "Done"}
                      </td>
                      <td className="py-1 text-center">{item?.amount}</td>
                      <td
                        className={`py-1 text-center ${
                          item?.win_amount === 0
                            ? "text-redAviator"
                            : item?.win_amount === null
                            ? "text-white"
                            : "text-green"
                        }`}
                      >
                        {item?.win_amount === null ? "--" : item?.win_amount}
                      </td>
                    </tr>
                  );
                })
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

export default MenuModal;

/* eslint-disable react/prop-types */
import { ImCancelCircle } from "react-icons/im";

function MenuModal({ data,setToggleMenu }) {
    // console.log("data", data)
    return (
        <div className="fixed inset-0 z-50 flex justify-center  bg-black bg-opacity-50">
            <div className=" text-white h- absolute p-2 top-10 w-[310px] border-gray border-[1px] bg-blackAviator4 shadow-lg rounded-lg ">
                <div className='flex items-center justify-between text-xsm'>
                    <h1>Game history</h1>
                    <ImCancelCircle onClick={()=>setToggleMenu(false)} className="text-blackLight hover:text-white" size={20} />
                </div>
                {/* <div className="border-gray border-y py-0.5 my-5">
                    sdf
                </div> */}

                <div className="overflow-x-auto hide-scrollbar mt-5 mb-2">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="text-[12px] border-gray border-y">
                                <th className="py-2 px-2">S.no.</th>
                                <th className="py-2 px-2">Risk</th>
                                <th className="py-2 px-2">Bet </th>
                                <th className="py-2 px-2">Win </th>
                                <th className="py-2 px-2">Selected Number</th>
                                <th className="py-2 px-2">Win Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.length > 0 ? data.map((item, i) => (
                                <tr key={i} className="text-[12px]">
                                    <td className="py-1 text-center">{i + 1}</td>
                                    <td className="py-1 text-center">
                                        {item?.risk_level === "1"
                                            ? "Low"
                                            : item?.risk_level === "2"
                                                ? "Medium"
                                                : "High"}
                                    </td>
                                    <td className="py-1 text-center">{item?.amount}</td>
                                    <td className={`py-1 text-center ${item?.win_amount===0?"text-redAviator":"text-green"}`}>{item?.win_amount}</td>
                                    <td className="py-1 text-center">{item?.selected_numbers}</td>
                                    <td className="py-1 text-center">{item?.number}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td className="py-1 text-center" colSpan={6}>no data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default MenuModal
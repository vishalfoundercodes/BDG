import { ImCancelCircle } from "react-icons/im";

/* eslint-disable react/prop-types */
export default function ResultModal({ onClose, gameResultNumber, announcementData }) {
    if (!announcementData) return null;

    // Check the object structure
    console.log("Announcement data:", announcementData?.number);

    // const numberEntries = Object.entries(announcementData?.number).filter(([key]) => !isNaN(Number(key)));
    // console.log("numberEntries", numberEntries)
    const matchedNumbers = announcementData?.number
  ? Object.values(announcementData.number)
  : [];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div style={{ background: "linear-gradient(to bottom, #005500, #2b7009, #569123, #569123, #569123, #2b7009, #2b7009)" }} className=" rounded-lg p-3 w-96 shadow-xl text-white font-serif">
                <div className='flex items-center justify-between text-xsm mb-4'>
                    <h2 className="text-lg font-semibold"> {announcementData?.games_no}</h2>
                    <ImCancelCircle onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer" size={20} />
                </div>

                <div className="text-xsm space-y-2">
                    <p className="flex items-center justify-center">
                        <p className="flex items-center text-3xl">You {announcementData?.result === "win" ? "win" : "loose"}  </p>
                        {/* <p className="flex items-center justify-end">{announcementData?.result} </p> */}
                    </p>
                    <p className="flex items-center justify-center">
                        <p className="flex items-center justify-">  </p>
                        <p className="flex items-center text-xl font-bold justify-end">{announcementData?.win} </p>
                    </p>
                    <p className="flex items-center justify-center">
                        <p className="flex items-center justify-">Bet amount:  </p>
                        <p className="flex items-center justify-end">{announcementData?.amount} </p>
                    </p>
                    <div>
                        <p className="font-semibold mb-1"></p>
                        <div className="flex gap-1">
                            {gameResultNumber.map((item, i) => {
                                  const isMatched = matchedNumbers.includes(item);

                                return (
                                    <div
                                        key={i}
                                        className={`h-8 w-8 flex items-center justify-center border rounded-full text-white text-sm ${
                                            isMatched ? 'bg-[#003b09] border-black' : 'bg-[#005500]'
                                          }`}
                                    >
                                        {item}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react'
import { fetchAllGames, fetchAllGamesSpribe, fetchGameURL, fetchGameURLSpribe, updateUserWalletFromJili, updateUserWalletFromSpribe } from "../../reusable_component/gameApi";
import jilli1 from "../../assets/usaAsset/homeScreen/JILLI1.png"
import jilli2 from "../../assets/usaAsset/homeScreen/JILLI2.png"
import jilli3 from "../../assets/usaAsset/homeScreen/JILLI3.png"
import jilli4 from "../../assets/usaAsset/homeScreen/JILLI4.png"
import jilli5 from "../../assets/usaAsset/homeScreen/JILLI5.png"
import jilli6 from "../../assets/usaAsset/homeScreen/JILLI6.png"

// ssets/usaAsset/homeScreen/aviatornew.png

import lotterycategorywingo from "../../assets/usaAsset/homeScreen/lotterycategorywingo.png"
import lotterycategorytrx from "../../assets/usaAsset/homeScreen/lotterycategorytrx.png"
import k3 from "../../assets/usaAsset/homeScreen/kk3.png"
import d5d from "../../assets/usaAsset/homeScreen/d5d.png"
import gamecategoryminigames from "../../assets/usaAsset/homeScreen/aviatornew.png"
import minesnew from "../../assets/usaAsset/homeScreen/minesnew.png"
import aviatornew from "../../assets/usaAsset/homeScreen/aviatornew.png"
import dragontiger from "../../assets/usaAsset/homeScreen/dragontiger.png"
import hotgames1 from "../../assets/usaAsset/homeScreen/hotgames.png"
import hotgames2 from "../../assets/usaAsset/homeScreen/hotgames2.png"
import Plinko from "../../assets/usaAsset/homeScreen/Plinko.png"
import andharBahar from "../../assets/usaAsset/homeScreen/andharBahar.png"
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from '../../reusable_component/Loader/Loader';
function AllGames() {
    const [allGamesListView, setAllGamesListView] = useState(null)
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("userId")
    const [searchParams] = useSearchParams();
    const activeModalValue = searchParams.get('activeModalValue');
    const [activeModal, setActiveModal] = useState(activeModalValue);

    const toggleModal = (modalType) => {
        setActiveModal((prev) => (prev === modalType ? modalType : modalType));
    };
    const navigate = useNavigate()
    const payMethod = [{
        image: jilli6,
        image1: jilli5,
        name: "Lottery",
        type: 0
    },

     {
        image: hotgames1,
        image1: hotgames2,
        name: "Hot",
        type: 3
    },
    // {
    //     image: jilli3,
    //     image1: jilli2,
    //     name: "Jilli",
    //     type: 1
    // },
    // {
    //     image: jilli1,
    //     image1: jilli4,
    //     name: "Spribe",
    //     type: 2
    // }
    ]
    console.log("allGamesListView", allGamesListView)
    useEffect(() => {
        if (activeModal == 1) {
            fetchAllGames(setAllGamesListView);
        } else if (activeModal == 2) {
            fetchAllGamesSpribe(setAllGamesListView);
        }
    }, [activeModal]);
    // window.location.reload(); 

    useEffect(() => {
        const updateWallet = async () => {

            const statusJili = localStorage.getItem("jilligamePlayed") || "0";
            const statusSpribe = localStorage.getItem("spribegamePlayed") || "0";

            console.log("Status Jili:", statusJili);
            console.log("Status Spribe:", statusSpribe);

            if (statusJili === "1") {
                await updateUserWalletFromJili();
                localStorage.setItem("jilligamePlayed", "0");
            }

            if (statusSpribe === "1") {
                await updateUserWalletFromSpribe();
                localStorage.setItem("spribegamePlayed", "0");
            }
        };

        // Run on page load
        updateWallet();

        // Detect if user switches back to this tab/page
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                updateWallet();
            }
        };

        // Detect if localStorage was changed
        const handleStorageChange = (event) => {
            if (event.key === "jilligamePlayed" || event.key === "spribegamePlayed") {
                updateWallet();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);


    const LotteryGames = [
        { id: 1, name: "Win Go", image: lotterycategorywingo, route: "/lottery/wingo", description1: "Guess Number", description2: "Green/Red/Violet to win", bgColor: "bg-redLight" },
        { id: 2, name: "Trx Win", image: lotterycategorytrx, route: "/lottery/trxwingo", description1: "Guess Number", description2: "Green/Red/Violet to win", bgColor: "bg-redLight" },
        // { id: 3, name: "K3", image: k3, route: "/comingsoon", description1: "Guess Number", description2: "Big/Small/Odd/Even", bgColor: "bg-redLight" },
        // { id: 4, name: "5D", image: d5d, route: "/comingsoon", description1: "Guess Number", description2: "Big/Small/Odd/Even", bgColor: "bg-redLight" },
    ];

     const hotgames = [
   
       { id: 1, name: "Andar Bahar ", bgimage: andharBahar, image: k3, route: "/andarbahar", description1: "Guess Number", description2: "Green/Red/Violet to win", bgColor: "bg-gradient-to-l from-[#ff9a8e] to-[#f95959]" },
       { id: 2, name: "Dragon Tiger", bgimage: dragontiger, image: d5d, route: "/dragonTiger", description1: "Guess Number", description2: "Green/Red/Violet to win", bgColor: "bg-gradient-to-l from-[#ff9a8e] to-[#f95959]" },
       // { id: 3, name: "Avaitor", bgimage: aviatornew, image: lotterycategorywingo, route: "/comingsoon", description1: "Guess Number", description2: "Green/Red/Violet to win", bgColor: "bg-gradient-to-l from-[#ff9a8e] to-[#f95959]" },
        { id: 4, name: "Plinko", bgimage: Plinko, image: lotterycategorytrx, route: "/plinko", description1: "Guess Number", description2: "Green/Red/Violet to win", bgColor: "bg-gradient-to-l from-[#ff9a8e] to-[#f95959]" },
   
     ];
    console.log("allGamesListView", allGamesListView)
    return (
        <div>
            {loading && <Loader setLoading={setLoading} loading={loading} />}
            <div className="hide-scrollbar overflow-x-auto py-3 mx-3">
                <div className="flex gap-2 text-xsm font-bold">
                    {payMethod && payMethod?.map((item, i) => (
                        <div key={i}
                            className={`w-32  xsm:py-3 flex-shrink-0 flex flex-col items-center justify-between shadow-lg rounded-lg ${activeModal == item?.type ? "bg-gradient-to-l  from-customlightbtn to-customdarkBluebtn text-white" : "bg-customdarkBlue text-gray"
                                }  px-3 cursor-pointer`}
                            onClick={() => toggleModal(item?.type)}
                        >
                            <img className='w-24 h-8 xsm:h-10' src={activeModal == item?.type ? item?.image : item?.image1} alt="UPI Payment" />
                            <p className=" font-bold text-nowrap">{item?.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='px-2 lex items-center justify-center'>
                <div className={` grid grid-cols-${activeModal == 0 ? '1' : '3'} w-full`}>
                    {activeModal == 1 ? (
                        allGamesListView ? allGamesListView?.data?.data?.map((item, i) => (

                            <div onClick={() => fetchGameURL(item?.id, userId, navigate, setLoading)} key={i} className="flex flex-col items-center text-black p-2">
                                <img src={item?.img} className="w-36 h-32 rounded-lg" alt="sd" />
                            </div>
                        )) : <div className='text-white flex justify-center text-center mt-10 ml-28 w-full'> No data</div>
                    ) : activeModal == 2 ? (
                        allGamesListView ? allGamesListView?.data?.message?.data?.map((item, i) => (
                            <div onClick={() => fetchGameURLSpribe(item?.game_id_long, userId, navigate, setLoading)} key={i} className="flex flex-col items-center text-black p-2">
                                <img src={item?.game_image} className="w-36 h-32 rounded-lg" alt="sd" />
                            </div>
                        )) : <div className='text-white flex justify-center text-center mt-10 ml-28 w-full'> No data</div>
                    ) : activeModal==3?
                    (
                          hotgames?.map((item, i) => (
                            <Link className to={`${item?.route}`} key={item.id}>
                            <div className="flex flex-col items-center text-black p-2">
                                <img src={item?.bgimage} className="w-36 h-32 rounded-lg" alt="sd" />
                            </div> </Link>
                        )) 
                        // : <div className='text-white flex justify-center text-center mt-10 ml-28 w-full'> No data</div>
                    ):
                    (
                        <>
                            {LotteryGames?.map((item,) => (

                                <Link className="w-full mb-2  flex items-center justify-center" to={`${item?.route}`} key={item.id}>
                                    <div className={`${item.bgColor} flex justify-between px-1  pt-1 pb- w-full rounded-3xl`}>
                                        <div className="col-span-1 pl-3">
                                            <p className="font-bold text-lg">{item.name}</p>
                                            <p className="text-xs font-semibold text-slate-200 mt-2.5">
                                                {item.description1}
                                            </p>
                                            <p className="text-xs font-semibold text-slate-200 mt-1">
                                                {item.description2}
                                            </p>
                                        </div>
                                        <div className="col-span-1 w-[89px] h-[80px] flex justify-end ">
                                            <img className="w-full h-full" src={item?.image} alt="Win Go" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {/* <Link key={i} to={item?.route} > */}
                            {/* <div onClick={() => fetchGameURLSpribe(allGamesListView?.data?.message?.data[0]?.game_id_long, userId, navigate, setLoading)} className="flex flex-col items-center text-black p-2">
                                <img src={gamecategoryminigames} className="w-36 h-32 rounded-lg" alt="sd" />
                            </div>
                            <div onClick={() => fetchGameURLSpribe(allGamesListView?.data?.message?.data[6]?.game_id_long, userId, navigate, setLoading)} className="flex flex-col items-center text-black p-2">
                                <img src={minesnew} className="w-36 h-32 rounded-lg" alt="sd" />
                            </div> */}
                            {/* </Link> */}

                        </>)}
                </div>
            </div>
        </div>
    )
}

export default AllGames
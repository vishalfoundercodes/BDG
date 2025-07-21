import { HiArrowPathRoundedSquare } from 'react-icons/hi2'
import depo_wallet from '../../assets/icons/depo_wallet.png'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import plus from "../../assets/usaAsset/wallet/plus.png"
import withdrawBg from "../../assets/usaAsset/wallet/withdrawBg.png"
import axios from 'axios';
import apis from '../../utils/apis'
import { toast } from 'react-toastify';
import usdt_icon from '../../assets/images/usdt_icon.png';
// import razorpay_icon from '../../assets/razorpay2.png'
import Loader from '../../reusable_component/Loader/Loader';
import camlenios from "../../assets/usaAsset/wallet/camlenios.png"
import indianpay from "../../assets/usaAsset/wallet/indianpay.png"
import payzaar from "../../assets/payzaar.png";
import BankDetailsCard from './Bankdetails';
import UsdtBankDetail from './UsdtBankDetail';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";



function Withdrawal() {
    const [loading, setloading] = useState(false);
    const [amountError, setAmountError] = useState("");
    const [amountErrorCamlenio, setAmountErrorCamlenio] = useState("");
    const [amountErrorUSDT, setAmountErrorUSDT] = useState("");
    const [paymenLimts, setPaymenLimts] = useState({})
    const [upiAmount, setUpiAmount] = useState(300);
    const [upiAmountCamlenio, setUpiAmountCamlenio] = useState(500);
    const [usdtwalletaddress, setusdtwalletaddress] = useState("");
    const [usdtAmount, setUsdtAmount] = useState(10)
    const [activeModal, setActiveModal] = useState(0);
    // const [payModesList, setPayModesList] = useState(0);
    const [viewAccountDetails, setViewAccountDetails] = useState(null)
    const [viewAccountDetailsUSDT, setViewAccountDetailsUSDT] = useState(null)
    const [myDetails, setMyDetails] = useState(null)
    const [showDetailsUSDT, setShowDetailsUSDT] = useState(false);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const toggleModal = (modalType) => {
        setActiveModal((prev) => (prev === modalType ? modalType : modalType));
    };

    const getPaymentLimits = async () => {
        setloading(true)
        try {
            const res = await axios.get(`${apis.getPaymentLimits}`);
            if (res?.data?.status === 200) {
                setloading(false)
                setPaymenLimts(res?.data?.data)
            }
        } catch (err) {
            setloading(false)
            toast.error(err);
        }
    };
    // console.log("paymenLimts", paymenLimts)
    const validateAmount = (amount) => {
        // console.log("amount", amount)
        if (!paymenLimts) return;
        let minAmount, maxAmount;
        if (activeModal === 0) {
            minAmount = paymenLimts?.INR_minimum_withdraw;
            maxAmount = paymenLimts?.INR_maximum_withdraw;
        } else {
            minAmount = paymenLimts?.USDT_minimum_withdraw;
        }
        amount = Number(amount);
        if (isNaN(amount) || amount < minAmount || amount > maxAmount) {
            setAmountError(`Amount must be between ₹${minAmount} - ₹${maxAmount}`);
            setAmountErrorCamlenio(`Amount must be between ₹${minAmount} - ₹${maxAmount}`);
            setAmountErrorUSDT(`Amount must be between $${minAmount} - $${maxAmount}`);
        } else {
            setAmountError("");
            setAmountErrorUSDT("");
            setAmountErrorCamlenio("");
        }
    };
    useEffect(() => {
        if (activeModal == 1) {
            validateAmount(usdtAmount);
        } else if (activeModal == 0) {
            validateAmount(upiAmount);
        } else if (activeModal == 2) {
            validateAmount(upiAmountCamlenio);
        }
    }, [activeModal]);

    const accountView = async (userid) => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        try {
          console.log(`api of payZaar bank detail: ${apis.accountView}?user_id=${userid}`);
            const res = await axios.get(`${apis.accountView}?user_id=${userid}`)
            console.log('accountview payjaar ----',res.data.data)
            if (res?.data?.status === "200"||res?.data?.status === 200) {
                setViewAccountDetails(res?.data?.data)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const accountViewUSDT = async () => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        try {
            const res = await axios.get(`${apis.usdtaccountView}${userId}`);
            console.log(`usdt account view: ${apis.usdtaccountView}${userId}`);
            console.log("res for usdt account view:", res.data)
            if (res?.data?.status === 200||res?.data?.success===true) {
                console.log("res?.data?.data", res?.data?.data)
                setViewAccountDetailsUSDT(res?.data?.data);
            } else {
                // toast.error("Error: " + res?.data?.message);
            }
        } catch (err) {
            console.error("API Error:", err);
            // toast.error("Something went wrong");
        }
    };
    // console.log("myDetails", myDetails)
    const profileDetails = async (userId) => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        try {
            const res = await axios.get(`${apis.profile}${userId}`);
            if (res?.data?.success === 200) {
                setMyDetails(res?.data)
            }
        } catch (err) {
            toast.error(err);
        }
    };

    useEffect(() => {
        getPaymentLimits()
    }, [])
    useEffect(() => {
        if (userId) {
            profileDetails(userId);
            accountView(userId);
            accountViewUSDT();
        }
    }, [userId]);

    console.log("viewAccountDetails",viewAccountDetailsUSDT)
    const payoutWithdrawHandler = async () => {
        // alert("dfdf")
        setloading(true)
        if (!userId && !viewAccountDetails[0]?.id) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        // alert("dfdg")
        let payload;
        // let payload1

        if(activeModal === 1){
            payload = {
                user_id: userId,
                type: activeModal,
                amount: usdtAmount,
                usdt_wallet_address: usdtwalletaddress,
                amount_inr: usdtAmount == 0 ? "" : usdtAmount * (paymenLimts?.withdraw_conversion_rate || 1),
            }
            // console.log('wwwww',payloadusdt)
            // console.log("urlurl",activeModal===0? apis?.usdtpayout_withdraw:apis?.payout_withdraw,)
        } else if (activeModal === 0){
             payload = {
                user_id: userId,
                type: activeModal,
                amount:  upiAmount ,
                account_id: viewAccountDetails[0]?.id,
            }
        }
        // const payload = {
        //     user_id: userId,
        //     account_id: activeModal == 0 ? viewAccountDetails[0]?.id : activeModal == 1 ? viewAccountDetailsUSDT[0]?.id : null,
        //     type: activeModal,
        //     amount: activeModal == 0 ? upiAmount : activeModal == 1 ? usdtAmount : null
        // }
     

         console.log("payload", payload)
        //  console.log("payload11", payload1)
        try {
            // console.log("payout" ,payout_withdraw);
            //  console.log("payout_withdraw",apis?.payout_withdraw )
            const res = await axios.post(activeModal=== 0 ? apis?.payout_withdraw:apis?.usdtpayout_withdraw, payload)
            // const res = await axios.post(apis?.payout_withdraw,payload)
             console.log("response fghj",res )
            if (res?.data?.status === 200||res?.data?.status === true||res?.data?.status === '200'||res?.data?.success === true) {
                setloading(false)
                profileDetails()
                toast.success(res?.data?.message)
                setUpiAmountCamlenio("")
                setUsdtAmount("")
                setUpiAmount("")
                setusdtwalletaddress("")
            } else {
                setloading(false)
                toast.error(res?.response?.data?.message)
            }
        } catch (err) {
            console.log("wirthredr",err)
            setloading(false)
            toast.error(err?.response?.data?.message)
        }
    }
    // console.log("cricket match",myDetails)
  const payMethod = [{
           image: payzaar,
           name: "payzaar",
           type: 0
       },
       {
           image: usdt_icon,
           name: "USDT",
           type: 1
       },
    //    {
    //        image: indianpay,
    //        name: "UPI Payment",
    //        type: 1
    //    },
   
       ]
    return (
      <div className="px-3 h-full ">
        {loading == true && (
          <Loader setloading={setloading} loading={loading} />
        )}

        <div
          className="h-40 w-full object-fill bg-no-repeat  rounded-lg p-2"
          style={{
            backgroundImage: `url(${withdrawBg})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <p className="flex items-center gap-4 mt-5">
            <p>
              <img className="w-5 h-5" src={depo_wallet} alt="ds" />
            </p>
            <p className="text-[#8F5206]">Availale Balance</p>
          </p>
          <p className="mt-2 text-2xl flex items-center gap-2 font-bold text-[#8F5206]">
            <p>
              ₹ {myDetails?.data?.wallet + myDetails?.data?.third_party_wallet}
            </p>
            <HiArrowPathRoundedSquare
              onClick={() => profileDetails(userId)}
              className=" "
              size={22}
            />
          </p>
        </div>
        <div className="w-full grid grid-cols-3 gap-3 mt-2">
          {payMethod &&
            payMethod?.map((item, i) => (
              <div
                onClick={() => toggleModal(item?.type)}
                key={i}
                className={`col-span-1 mb-2 p-4 rounded-md flex flex-col items-center text-xsm justify-evenly ${
                  item?.type == activeModal
                    ? "bg-gradient-to-r from-[#EDD188] to-[#C79744] text-[#A45206] "
                    : "bg-redLight text-gray"
                } shadow-md `}
              >
                <img
                  className={`w-${item?.type === 2 ? 10 : 50} h-8`}
                  src={item.image}
                  alt="UPI Payment"
                />
                <p className="text-nowrap">{item?.name}</p>
              </div>
            ))}
        </div>

        {/* AR Notification */}
        {/* <div className="max-w-sm bg-[#333332] text-gray-200 rounded-lg shadow-md p-4 relative flex items-center space-x-4">
          <div className="flex-shrink-0">
            <svg
              className="w-12 h-12 text-[#FFF267]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.28 17.89L8.69 4.44a1.25 1.25 0 012.25 0l6.32 13.45a1.25 1.25 0 01-1.12 1.82H3.38a1.25 1.25 0 01-1.1-1.82zM15.4 9.68l-2.67 6.5h6.1a1.25 1.25 0 001.16-1.77L15.4 9.68z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-semibold text-lg">ARPay</h3>
            <p className="text-[#9D9AA1] text-sm">
              Supports UPI for fast payment, and bonuses for withdrawals
            </p>
          </div>
          <div className="absolute top-2 right-2 bg-[#FE3C3E] rounded-md px-2 py-0.5 flex items-center space-x-1 text-xs font-semibold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#FFF267]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.654 0-3-.672-3-1.5S10.346 5 12 5s3 .672 3 1.5S13.654 8 12 8zM9 10v6a3 3 0 006 0v-6"
              />
            </svg>
            <span>1%+3%</span>
          </div>
        </div> */}
        {/* Modals */}
        {activeModal === 2 && (
          <div className="mt-5">
            <div>
              {viewAccountDetailsUSDT && viewAccountDetailsUSDT.length > 0 ? (
                <div className="bg-redLight rounded-lg p-2">
                  {/* Use the reusable BankDetailsCard */}
                  <BankDetailsCard
                    viewAccountDetails={viewAccountDetailsUSDT}
                  />
                </div>
              ) : (
                <div>
                  <button className="w-full bg-redLight rounded-lg p-2">
                    <Link
                      to="/wallet/withdrawal/addbankaccount"
                      className="flex flex-col items-center rounded-l-full text-sm p-1"
                    >
                      <img className="w-12 h-12" src={plus} alt="Add" />
                      <h3 className="text-xsm mt-2 text-blackLight flex items-center">
                        Add a bank account number
                      </h3>
                    </Link>
                  </button>
                  <div>
                    <p className="text-xs text-bg2">
                      Need to add beneficiary information to be able to withdraw
                      money
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Withdrawal Input & Rules */}
            <div className="bg-redLight rounded-lg p-2 mt-3 mb-20">
              {amountErrorCamlenio && (
                <p className="text-red text-xs mt-2">{amountErrorCamlenio}</p>
              )}
              <div className="rounded-md p-3 flex mt-3 items-center justify-center">
                <div className="flex items-center bg-red w-full rounded-full text-sm p-2">
                  <div className="w-8 flex items-center justify-center text-xl font-bold text-customlightbtn">
                    ₹
                  </div>
                  <div className="w-[1px] mx-2 bg-lightGray h-5" />
                  <input
                    value={upiAmountCamlenio === 0 ? "" : upiAmountCamlenio}
                    onChange={(e) => {
                      const numericAmount = Number(e.target.value);
                      setUpiAmountCamlenio(numericAmount);
                      validateAmount(numericAmount);
                    }}
                    type="number"
                    placeholder="Please enter the amount"
                    className="w-full p-1 bg-red border-none focus:outline-none text-customlightbtn placeholder:text-customlightbtn text-xsm"
                  />
                </div>
              </div>

              <button
                onClick={payoutWithdrawHandler}
                className={`mt-4 w-full ${
                  upiAmountCamlenio >= paymenLimts?.INR_minimum_withdraw
                    ? "text-white bg-gradient-to-r from-customlightbtn to-customdarkBluebtn"
                    : "bg-gradient-to-l from-[#cfd1de] to-[#c7c9d9] text-gray"
                } py-3 rounded-full border-none text-xsm`}
              >
                Withdraw USDT
              </button>

              <div className="mt-10">
                <ul className="px-2 py-4 my-2 bg-redLight border-customlightbtn border-[0.5px] rounded-lg text-xs text-white">
                  <li className="flex items-start">
                    <span className="text-customlightbtn mr-2">◆</span>
                    Need to bet{" "}
                    <p className="text-[#D23838]">
                      &nbsp; ₹{myDetails?.data?.recharge}&nbsp;
                    </p>{" "}
                    to be able to withdraw.
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-customlightbtn mr-2">◆</span>
                    Withdraw time:{" "}
                    <p className="text-[#D23838]">&nbsp;00:00-23:59&nbsp;</p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-customlightbtn mr-2">◆</span>
                    Inday Remaining Withdrawal Times{" "}
                    <p className="text-[#D23838]">&nbsp;3&nbsp;</p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-customlightbtn mr-2">◆</span>
                    Withdrawal amount range{" "}
                    <p className="text-[#D23838]">
                      &nbsp;₹{paymenLimts?.INR_minimum_withdraw?.toFixed(2)} - ₹
                      {paymenLimts?.INR_maximum_withdraw?.toFixed(2)}&nbsp;
                    </p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-customlightbtn mr-2">◆</span>
                    Please confirm your beneficial account information before
                    withdrawing. If your information is incorrect, our company
                    will not be liable for the amount of loss.
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-customlightbtn mr-2">◆</span>
                    If your beneficial information is incorrect, please contact
                    customer service.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeModal == 0 && (
          <div className="mt-5 ">
            <div className="">
              {viewAccountDetails && viewAccountDetails.length > 0 ? (
                <div className="bg-redLight rounded-lg p-2">
                  {/* <div className="text-customlightbtn text-xs border-b-[1px] border-dotted py-2">
                    <p className="text-customlightbtn">
                      {" "}
                      <b>Bank name:</b>&nbsp;
                      <span className="text-white">
                        {viewAccountDetails[0]?.bank_name}
                      </span>{" "}
                    </p>
                    <p className="text-customlightbtn">
                      {" "}
                      <b>Branch name:</b>&nbsp;
                      <span className="text-white">
                        {viewAccountDetails[0]?.branch}
                      </span>{" "}
                    </p>
                    <p>
                      {" "}
                      <b>Recipient&apos;s Name:</b> &nbsp;
                      <span className="text-white">
                        {viewAccountDetails[0]?.name}
                      </span>{" "}
                    </p>
                    <p>
                      {" "}
                      <b>Account Number:</b> &nbsp;{" "}
                      <span className="text-white">
                        {viewAccountDetails[0]?.account_number}
                      </span>{" "}
                    </p>
                    <p>
                      {" "}
                      <b>IFSC:</b> &nbsp;{" "}
                      <span className="text-white">
                        {viewAccountDetails[0]?.ifsc_code}
                      </span>{" "}
                    </p>
                    <p>
                      {" "}
                      <b>UPI Id:</b> &nbsp;{" "}
                      <span className="text-white">
                        {viewAccountDetails[0]?.upi_id}
                      </span>{" "}
                    </p>
                  </div> */}
                  {/* <BankDetailsCard viewAccountDetails={viewAccountDetails} /> */}
                  <BankDetailsCard
                    viewAccountDetails={
                      activeModal === 2
                        ? viewAccountDetailsUSDT
                        : viewAccountDetails
                    }
                  />

                  {/* <Link
                    to="/customerservices"
                    className="text-xsm w-full flex items-end justify-end text-bg2"
                  >
                    Change bank card information
                  </Link> */}
                </div>
              ) : (
                <div className="">
                  <button className="w-full bg-redLight rounded-lg p-2">
                    <Link
                      to="/wallet/withdrawal/addbankaccount"
                      className="flex flex-col items-center rounded-l-full text-sm p-1"
                    >
                      <img className="w-12 h-12" src={plus} alt="sd" />
                      <h3 className="text-xsm mt-2 text-blackLight flex items-center ">
                        Add a bank account number
                      </h3>
                    </Link>
                  </button>
                  <div>
                    <p className="text-xs text-bg2">
                      Need to add beneficiary information to be able to withdraw
                      money
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-redLight rounded-lg p-2 mt-3 mb-20">
              {amountError && (
                <p className="text-[#D23834] text-xs mt-2 pl-2">
                  {amountError}
                </p>
              )}
              <div className=" rounded-md p-3 flex mt-3 items-center justify-center">
                <div className="flex items-center bg-red w-full rounded-full text-sm p-2">
                  <div className="w-8 flex items-center justify-center text-xl font-bold text-[#D9AC4F]">
                    ₹
                  </div>
                  <div className="w-[1px] mx-2 flex items-center justify-center bg-lightGray h-5"></div>
                  <input
                    value={upiAmount == 0 ? "" : upiAmount}
                    onChange={(e) => {
                      const numericAmount = Number(e.target.value);
                      setUpiAmount(numericAmount);
                      validateAmount(numericAmount);
                    }}
                    type="number"
                    placeholder="Please enter the amount"
                    className="w-full p-1 bg-red border-none focus:outline-none text-[#D9AC4F] placeholder:text-[#D9AC4F] text-xsm"
                  />
                </div>
              </div>
              <button
                onClick={payoutWithdrawHandler}
                className={`mt-4 w-full ${
                  upiAmount >= paymenLimts?.INR_minimum_withdraw
                    ? "bg-gradient-to-r from-[#EDD188] to-[#C79744] text-[#A45206] "
                    : "bg-gradient-to-l from-[#cfd1de] to-[#c7c9d9] text-gray"
                }   py-3 rounded-full border-none text-xsm `}
              >
                Withdraw new
              </button>

              <div className="mt-10">
                <ul className="px-2 py-4 my-2 bg-redLight   border-[#464553] border-[0.5px] rounded-lg text-xs  text-[#A8A5A1]">
                  <li className="flex items-start">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Need to bet{" "}
                    <p className="text-[#D23838]">
                      {" "}
                      &nbsp; ₹{myDetails?.data?.recharge}&nbsp;
                    </p>{" "}
                    to be able to withdraw.
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Withdraw time:{" "}
                    <p className="text-[#D23838]">&nbsp;00:00-23:59&nbsp;</p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Inday Remaining Withdrawal Times{" "}
                    <p className="text-[#D23838]">&nbsp;3&nbsp;</p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Withdrawal amount range{" "}
                    <p className="text-[#D23838]">
                      &nbsp;₹{paymenLimts?.INR_minimum_withdraw?.toFixed(2)} - ₹
                      {paymenLimts?.INR_maximum_withdraw?.toFixed(2)}&nbsp;
                    </p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Please confirm your beneficial account information before
                    withdrawing.If your information is incorrect, our company
                    will not be liable for the amount of loss
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    If your beneficial information is incorrect, please contact
                    to customer service.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeModal === 1 && (
          <div className="mt-5">
            <div className="p-2">
              {viewAccountDetailsUSDT && viewAccountDetailsUSDT.length > 0 ? (
                <div className="bg-redLight rounded-lg p-2">
                  {/* Toggleable Card */}
                  <UsdtBankDetail
                    viewAccountDetailsUSDT={viewAccountDetailsUSDT}
                  />
                  {/* <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setShowDetailsUSDT((prev) => !prev)}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-customlightbtn">
                        <b>Name:</b>{" "}
                        <span className="text-white">
                          {viewAccountDetailsUSDT[0]?.name}
                        </span>
                      </p>
                      <p className="text-xs text-customlightbtn">
                        <b>USDT:</b>{" "}
                        <span className="text-white">
                          {viewAccountDetailsUSDT[0]?.usdt_wallet_address.slice(
                            0,
                            6
                          )}
                          *****
                          {viewAccountDetailsUSDT[0]?.usdt_wallet_address.slice(
                            -4
                          )}
                        </span>
                      </p>
                    </div>
                    {showDetailsUSDT ? (
                      <MdKeyboardArrowDown size={20} className="text-white" />
                    ) : (
                      <MdKeyboardArrowRight size={20} className="text-white" />
                    )}
                  </div> */}
                  {/* Expandable Section */}
                  {/* {showDetailsUSDT && (
                    <div className="mt-3 text-xs border-t border-dotted pt-3 text-customlightbtn">
                      <p>
                        <b>Name:</b>{" "}
                        <span className="text-white">
                          {viewAccountDetailsUSDT[0]?.name}
                        </span>
                      </p>
                      <p>
                        <b>USDT Address:</b>{" "}
                        <span className="text-white">
                          {viewAccountDetailsUSDT[0]?.usdt_wallet_address}
                        </span>
                      </p>
                      <p>
                        <b>Created At:</b>{" "}
                        <span className="text-white">
                          {viewAccountDetailsUSDT[0]?.created_at}
                        </span>
                      </p>
                      <Link
                        to="/customerservices"
                        className="text-xsm mt-2 w-full flex items-end justify-end text-bg2"
                      >
                        Change USDT wallet information
                      </Link>
                    </div>
                  )} */}
                </div>
              ) : (
                <div>
                  <div className="bg-redLight rounded-lg">
                    <button className="w-full">
                      <Link
                        to="/wallet/withdrawal/addusdtwalletaddress"
                        className="flex flex-col items-center rounded-l-full text-sm mt-3 p-1"
                      >
                        <img className="w-12 h-12" src={plus} alt="sd" />
                        <h3 className="text-xsm mt-2 text-blackLight flex items-center ">
                          Add address
                        </h3>
                      </Link>
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-bg2">
                      Need to add beneficiary information to be able to withdraw
                      money
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-redLight rounded-lg pt-2 mt- mb-10">
              {amountErrorUSDT && (
                <p className="text-[#D23834] text-xs mt-2 pl-2">
                  {amountErrorUSDT}
                </p>
              )}
              <div className="bg-redLight rounded-md p-3 flex flex-col mt-3 items-center justify-center">
                <div className="flex items-center bg-red w-full rounded-full text-sm p-2">
                  <div className="w-8 flex items-center justify-center text-xl font-bold text-[#D9AC4F]">
                    $
                  </div>
                  <div className="w-[1px] mx-2 flex items-center justify-center bg-[#5A616F] h-5"></div>
                  <input
                    value={usdtAmount == 0 ? "" : usdtAmount}
                    onChange={(e) => {
                      const numericAmount = Number(e.target.value);
                      setUsdtAmount(numericAmount);
                      validateAmount(numericAmount);
                    }}
                    type="number"
                    placeholder="Please enter the amount"
                    className="w-full p-1 bg-red border-none focus:outline-none text-[#D9AC4F] placeholder:text-[#D9AC4F] text-xsm"
                  />
                </div>
                {/* INR Input */}
                <div className="flex items-center mt-3 bg-red w-full rounded-full text-sm p-2">
                  <div className="w-8 flex items-center justify-center text-xl font-bold text-[#D9AC4F]">
                    ₹
                  </div>
                  <div className="w-[1px] mx-2 bg-[#5A616F] h-5"></div>
                  <input
                    value={
                      usdtAmount == 0
                        ? ""
                        : usdtAmount *
                          (paymenLimts?.withdraw_conversion_rate || 1)
                    }
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setUsdtAmount(
                        value / (paymenLimts?.withdraw_conversion_rate || 1)
                      );
                      validateAmount(
                        value / (paymenLimts?.withdraw_conversion_rate || 1)
                      );
                    }}
                    type="number"
                    placeholder="Enter INR amount"
                    className="w-full p-1 bg-red border-none focus:outline-none text-[#D9AC4F] placeholder:text-[#D9AC4F] text-xsm"
                  />
                </div>
                {/* usdt address */}
                {/* <div className="flex items-center mt-3 bg-red w-full rounded-full text-sm p-2">
                  <div className="w-8 flex items-center justify-center text-xl font-bold text-[#D9AC4F]">
                    <img src={usdt_icon} alt="UPI Payment" />
                  </div>
                  <div className="w-[1px] mx-2 bg-[#5A616F] h-5"></div>
                  <input
                    value={usdtwalletaddress}
                    onChange={(e) => {
                      setusdtwalletaddress(e.target.value);
                      // validateAmount(value / (paymenLimts?.withdraw_conversion_rate || 1));
                    }}
                    type="text"
                    placeholder="Enter USDT Address"
                    className="w-full p-1 bg-red border-none focus:outline-none text-[#D9AC4F] placeholder:text-[#D9AC4F] text-xsm"
                  />
                </div> */}
                {/*  */}
              </div>
              <p className="text-[#D9AC4F] text-xsm pl-4">
                Withdrawable Balance {"  "}₹
                {myDetails?.data?.wallet + myDetails?.data?.third_party_wallet}
              </p>
              <button
                onClick={payoutWithdrawHandler}
                className={`mt-4 w-full ${
                  usdtAmount >= paymenLimts?.USDT_minimum_withdraw
                    ? "bg-gradient-to-r from-[#EDD188] to-[#C79744] text-[#A45206] "
                    : "bg-gradient-to-l from-[#cfd1de] to-[#c7c9d9] text-gray"
                }   py-3 rounded-full border-none text-xsm `}
              >
                Withdraw USDT
              </button>
              <div className="mt-10 mx-4">
                <ul className="px-2 py-4 my-2  border-[#464553] border-[0.5px]  rounded-lg text-xs text-[#7F7A88]">
                  <li className="flex items-start">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Need to bet{" "}
                    <p className="text-[#B43532]">
                      {" "}
                      &nbsp; ₹{myDetails?.data?.recharge}&nbsp;
                    </p>{" "}
                    to be able to withdraw.
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Withdraw time:{" "}
                    <p className="text-[#B43532]">&nbsp;00:00-23:59&nbsp;</p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Inday Remaining Withdrawal Times{" "}
                    <p className="text-[#B43532]">&nbsp;3&nbsp;</p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Withdrawal amount range{" "}
                    <p className="text-[#B43532]">
                      &nbsp;${paymenLimts?.USDT_minimum_withdraw} - $
                      {paymenLimts?.USDT_maximum_withdraw}&nbsp;
                    </p>
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    Please confirm your beneficial account information before
                    withdrawing.If your information is incorrect, our company
                    will not be liable for the amount of loss
                  </li>
                  <li className="flex items-start mt-2">
                    <span className="text-[#D9AC4F]  mr-2">◆</span>
                    If your beneficial information is incorrect, please contact
                    to customer service.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default Withdrawal
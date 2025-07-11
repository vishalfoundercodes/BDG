import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import apis from "../../utils/apis"
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Loader from '../../reusable_component/Loader/Loader'
function CommissionDetails() {
  const [loading, setLoading] = useState(false);
  const [commisionData, setCommisionData] = useState(null)
  const userId = localStorage.getItem("userId")
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const [confirmedDate, setConfirmedDate] = useState(getCurrentDate());
  const navigate = useNavigate()
  const comHandler = async () => {
    setLoading(true);

    if (!userId) {
        toast.error("User not logged in");
        navigate("/login");
        return;
    }

    try {
        const res = await axios.get(`${apis.commisionDetails}${userId}&subtypeid=23&date=${confirmedDate}`);
        
        console.log("commisionDetails", res);
        
        if (res?.data?.status === 200) {
            setLoading(false);
            // Filter by current date to match API date format
            const filteredData = res?.data?.data?.filter(item => 
                item.date.startsWith(confirmedDate) // Compare by date prefix
            );
            setCommisionData(filteredData);
        } else {
            setLoading(false);
            toast?.error(res?.data?.message);
        }
    } catch (err) {
        setLoading(false);
        toast.error("Failed to fetch data.");
    }
};
  // console.log("commisionData",commisionData)
  useEffect(() => {
    comHandler()
  }, [userId,confirmedDate])
  return (
    <div className='w-full h-full p-2'>
      {loading && <Loader setLoading={setLoading} loading={loading} />}
      <button
        className="bg-customdarkBlue text-white rounded-md text-xs  py-2.5  px-2 flex justify-center items-center shadow-md"
      >
        <input onChange={(e) => setConfirmedDate(e.target.value)} className='input-white-icon outline-none bg-customdarkBlue '  type="date" />
      </button>
      {commisionData?.length > 0 ? commisionData?.filter((item) => {

        if (confirmedDate !== "Select date" && !item?.settlement_date.startsWith(confirmedDate)) {
          return ;
        }
        return true;
      })?.map((item, i) => (
        <div key={i} className='bg-customdarkBlue px-2 py-3 text-xs text-white mt-3'>
          <p>Settlement successful</p>
          <p>{moment(item?.settlement_date).format("DD-MM-YYYY HH:mm:ss")}</p>
          <p>The commission has been automatically credited to your balance </p>
          <div className='mt-3 bg-white p-2 rounded-md flex items-center justify-between'>
            <p>Number of bettors</p>
            <p className='text-black font-semibold'>{item?.number_of_bettors ? item?.number_of_bettors : "0"} People</p>
          </div>
          <div className='mt-2 bg-white p-2 rounded-md flex items-center justify-between'>
            <p>Bet amount</p>
            <p className='text-black font-semibold'>{item?.bet_amount}</p>
          </div>
          <div className='mt-2 bg-white p-2 rounded-md flex items-center justify-between'>
            <p>commission payout</p>
            <p className='text-black font-semibold'>{item?.commission_payout}</p>
          </div>
          <div className='mt-2 bg-white p-2 rounded-md flex items-center justify-between'>
            <p>Date</p>
            <p className='text-black font-semibold'>{moment(item?.settlement_date).format("DD-MM-YYYY HH:mm:ss")}</p>
          </div>
        </div>
      )) : <p className='text-white flex justify-center items-center'>no data</p>}
    </div>
  )
}

export default CommissionDetails
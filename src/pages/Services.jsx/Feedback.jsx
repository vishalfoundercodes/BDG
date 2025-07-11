import feedbackImg from '../../assets/images/feedbackImg.png'

function Feedback() {
  return (
    <div className="text-xs px-3 text-[#666462]">
      <div className="shadow-lg bg-[#333332] rounded-lg p-2 mt-5 pb-20">
        Welcome to feedback,please give feedback-please describe the problem in
        detail when providing feedback, perfectly attach the screenshot of your
        problem you encountered,we will immediately process your feedback!
      </div>
      <h1 className="text-center font-bold mt-5  text-[#EEF3F0]">
        Send helpful feedback
      </h1>
      <h1 className="text-center font-bold mt-3 text-[#EEF3F0]">
        Change to win Mystery Rewards
      </h1>
      <div className="mt-5">
        <img src={feedbackImg} alt="ds" />
      </div>
      <div>
        <button className="w-full mt-10 tracking-wider bg-gradient-to-r from-[#EDD188] to-[#C79744]  text-[#985206] text-sm font-semibold py-3 rounded-full shadow-md ">
          Submit
        </button>
      </div>
    </div>
  );
}

export default Feedback
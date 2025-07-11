/* eslint-disable react/prop-types */
import winImage from '../../assets/usaAsset/plinko/winImage.png';
import lossImage from '../../assets/usaAsset/plinko/loseImage.png';
function ResultAnnouncement({ data }) {
    // console.log("lastResultslastResults", data)
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            {/* Modal Background */}
            <div
                className="relative w-80 z-50 bg-no-repeat h-[500px] bg-contain bg-center"
                style={{ backgroundImage: `url(${data && (data[0]?.status === "1" ? winImage :data[0]?.status === "2" ? lossImage:"")})` }}
            >
                <div className="absolute w-full z-50 inset-0 flex flex-col items-center justify-center text-center p-6 mt-60 font-bold">{data && (data[0]?.win_amount)}</div>
            </div>
        </div>
    )
}

export default ResultAnnouncement
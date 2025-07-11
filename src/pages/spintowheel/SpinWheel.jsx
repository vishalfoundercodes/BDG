/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import sp_show from "../../assets/spintowheel/sp_show.png"
import s_first_wheel from "../../assets/spintowheel/s_first_wheel.png"
import s_third_wheel from "../../assets/spintowheel/s_third_wheel.png"
import SpinSocket from "./SpinSocket";

function SpinWheel({ gameResultData }, ref) {
  const wheelRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const sectors = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const degreesPerSector = 360 / sectors.length;
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q?.timerBetTime);
    };
    SpinSocket.on("gameon_spin", handleSocket);
    return () => SpinSocket.off("gameon_spin", handleSocket);
  }, []);

  // 👉 Main spin function
  const spinWheel = () => {
    if (spinning || !gameResultData?.[0]?.win_number) return;

    setSpinning(true);
    const motations = 5;
    const selected = Number(gameResultData[0]?.win_number);
    const baseRotation = rotation % 360;
    const angleToCenter = 360 - (selected * degreesPerSector + degreesPerSector / 2);
    const spinAngle = motations * 360 + ((angleToCenter - baseRotation + 360) % 360);
    const totalRotation = rotation + spinAngle;
    setRotation(totalRotation);

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 6s cubic-bezier(0.1, 0.7, 0.1, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      setResult(selected);
      // localStorage.setItem("spin_user_r", String(selected));
    }, 6000);
  };

  // 🔗 Expose spinWheel if needed externally
  useImperativeHandle(ref, () => ({
    spinWheel,
  }));

  // ⏱ Auto-spin at 29 seconds
  useEffect(() => {
    if (timeLeft === 10 && !spinning) {
      spinWheel();
    }
    if (timeLeft === 1) {
      setResult(null);
    }
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center -mt-5 xs1:mt-[5px]">
      <img className="w-10  h-10" src={sp_show} alt="sd" />
      <div className="relative w-[250px] h-[250px] xs1:w-[320px] xs1:h-[320px] rounded-full overflow-hidden"
        style={{
          backgroundImage: `url(${s_first_wheel})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {result !== null && (
          <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] font-extrabold text-2xl z-50 text-black pointer-events-none">
            {sectors[result]}
          </p>
        )}

        <div
          ref={wheelRef}
          className="absolute inset-0 xs1:mx-4 m-[10px] xs1:my-4 rounded-full"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                #FF6347 0% 10%,
                #FC7C76 10% 20%,
                #1E90FF 20% 30%,
                #FFD700 30% 40%,
                #BA55D3 40% 50%,
                #20B2AA 50% 60%,
                #FF8C00 60% 70%,
                #8B0000 70% 80%,
                #FF1493 80% 90%,
                #ADFF2F 90% 100%
              )`,
            }}
          />
          {sectors.map((label, i) => {
            const angle = i * degreesPerSector + degreesPerSector / 2;
            const effectiveRotation = rotation % 360; 
            return (
              <div
                key={i}
                className="absolute top-1/2 left-[50%] -mt-4 -ml-1.5"
                style={{
                  transform: `rotate(${angle}deg) translate(-50%, -90px)`,
                  transformOrigin: "center center",
                }}
              >
                <div
                  className=" font-bold text-black"
                  style={{
                    transform: `rotate(-${angle + effectiveRotation}deg)`,
                    fontSize: "20px",
                    textShadow: "1px 1px 2px white",
                    textAlign: "center",
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}

          <img
            src={s_third_wheel}
            alt="center"
            className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[60px] h-[60px] z-10"
          />
        </div>
      </div>
    </div>
  );
}

export default forwardRef(SpinWheel);

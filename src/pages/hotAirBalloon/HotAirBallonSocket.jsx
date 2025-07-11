
import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const HotAirBallonSocket = io(domain);

export default HotAirBallonSocket;

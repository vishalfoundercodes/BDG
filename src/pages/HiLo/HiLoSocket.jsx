import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const HiLoSocket = io(domain);

export default HiLoSocket;

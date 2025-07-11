import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const RednBlackSocket = io(domain);

export default RednBlackSocket;

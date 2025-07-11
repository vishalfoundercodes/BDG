import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const DiceSocket = io(domain);

export default DiceSocket;

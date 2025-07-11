import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const TripleChanceSocket = io(domain);

export default TripleChanceSocket;

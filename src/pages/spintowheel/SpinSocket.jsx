import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const SpinSocket = io(domain);

export default SpinSocket;

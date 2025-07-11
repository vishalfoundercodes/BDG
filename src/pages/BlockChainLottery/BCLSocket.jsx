import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const BCLSocket = io(domain);

export default BCLSocket;

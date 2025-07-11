import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const hntSocket = io(domain);

export default hntSocket;

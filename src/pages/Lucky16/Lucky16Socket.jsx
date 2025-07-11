import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const Lucky16Socket = io(domain);

export default Lucky16Socket;

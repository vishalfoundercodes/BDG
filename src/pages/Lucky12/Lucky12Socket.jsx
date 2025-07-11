import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const Lucky12Socket = io(domain);

export default Lucky12Socket;

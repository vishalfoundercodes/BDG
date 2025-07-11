import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const kenoSocket = io(domain);

export default kenoSocket;

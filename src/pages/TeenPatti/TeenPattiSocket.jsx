import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const TeenPattiSocket = io(domain);

export default TeenPattiSocket;

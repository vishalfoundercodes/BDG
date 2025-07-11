import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const JackpotSocket = io(domain);

export default JackpotSocket;

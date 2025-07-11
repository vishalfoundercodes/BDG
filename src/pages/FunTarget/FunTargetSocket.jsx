import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const FunTargetSocket = io(domain);

export default FunTargetSocket;

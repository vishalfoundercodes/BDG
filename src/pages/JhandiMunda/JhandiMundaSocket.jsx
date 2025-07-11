import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const JhandiMundaSocket = io(domain);

export default JhandiMundaSocket;

import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const TitliSocket = io(domain);

export default TitliSocket;

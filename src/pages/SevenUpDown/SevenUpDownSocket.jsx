import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const SevenUpDownSocket = io(domain);

export default SevenUpDownSocket;

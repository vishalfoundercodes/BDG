import io from "socket.io-client";

const domain = "https://aviatorudaan.com/";
const MiniRouletteSocket = io(domain);

export default MiniRouletteSocket;

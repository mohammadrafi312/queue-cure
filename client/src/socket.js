import { io } from "socket.io-client";

const socket = io(
  "https://queue-cure-backend-eh9q.onrender.com"
);

export default socket;
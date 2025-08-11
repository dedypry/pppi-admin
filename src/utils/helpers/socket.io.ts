import { io } from "socket.io-client";

import config from "@/config/api";

export const socket = io(config.socket);

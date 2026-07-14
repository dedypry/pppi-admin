import Pusher from "pusher-js";

import config from "@/config/api";

export const pusher = new Pusher(config.pusherKey, {
  cluster: config.pusherCluster,
});

interface Config {
  api: string;
  gallery: string;
}

interface IConfigs {
  production: Config;
  local: Config;
}
type EnvKeys = keyof IConfigs;

const currentEnv = (import.meta.env.VITE_NODE_ENV || "local") as EnvKeys;

const configs: IConfigs = {
  local: {
    api: "http://127.0.0.1:3333",
    gallery: "http://127.0.0.1:3333",
  },
  production: {
    api: "https://api.dpn-pppi.org",
    gallery: "https://gallery.dpn-pppi.org",
  },
};

const config: Config = configs[currentEnv];

export default config;

const kv = await Deno.openKv();

export interface CmsConfig {
  title: string;
  about: string;
  demoMode: boolean;
}

const defaultConfig: CmsConfig = {
  title: "My Blog",
  about: "This is my blog",
  demoMode: false,
};

export async function getConfig() {
  const res = await kv.get<CmsConfig>(["config"]);
  if (!res || !res.value) {
    await setConfig(defaultConfig);
    return defaultConfig;
  }
  return res.value;
}
export async function setConfig(config: CmsConfig) {
  return await kv.set(["config"], config);
}

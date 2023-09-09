import getConfig from "next/config";
import path from "path";

const { serverRuntimeConfig } = getConfig()

export const jsonPath = 'pages/api/review.json';
export const rootPath = process.env.VERCEL === '1'
  ? '/tmp'
  : serverRuntimeConfig.PROJECT_ROOT;

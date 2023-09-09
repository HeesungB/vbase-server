import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig()

export const jsonPath = 'pages/api/review.json';
export const rootPath = serverRuntimeConfig.PROJECT_ROOT;

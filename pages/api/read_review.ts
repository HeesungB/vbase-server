// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'
import {jsonPath, rootPath} from "@/constant";
const { serverRuntimeConfig } = getConfig()

type Data = {
  file: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const jsonData = fs.readFileSync(path.join(rootPath, jsonPath), 'utf8')

  return res.status(200).json({file: JSON.stringify(jsonData)});
}

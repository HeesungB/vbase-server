// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'
import {jsonPath, rootPath} from "@/constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  fs.writeFileSync(path.join(rootPath, jsonPath), JSON.stringify([]),'utf8')

  return res.status(200)
}

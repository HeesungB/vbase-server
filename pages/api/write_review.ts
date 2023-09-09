// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'
import {jsonPath} from "@/constant";
import {Proposal} from "@/types";
const { serverRuntimeConfig } = getConfig()

type Data = {
  file: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const reviewFile = fs.readFileSync(path.join(process.cwd(), jsonPath), 'utf8')
    const reviewJson: Proposal[] = JSON.parse(reviewFile);

    const inputData = [...reviewJson]
    fs.writeFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, jsonPath), JSON.stringify(inputData),'utf8')

    return res.status(200).json({file: JSON.stringify(inputData)});
  }

  return res.status(400)


}

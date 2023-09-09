// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { promises as fs } from 'fs';
import path from 'path'
import {jsonPath, rootPath} from "@/constant";

type Data = {
  file: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const jsonData = await fs.readFile(path.join(rootPath, jsonPath), 'utf8')
  const jsonData = [
    {
      "chainId": "cosmoshub",
      "proposalId":"test",
      "review":[
        {
          "address": "cosmos1gah93cq7t477e0p06x76etvqw566g8efvcrzv9",
          "validatorAddress": "cosmos1gah93cq7t477e0p06x76etvqw566g8efvcrzv9",
          "review": "good",
          "voteResult": "yes"
        }
      ]
    }
  ]
  return res.status(200).json({file: JSON.stringify(jsonData)});
}

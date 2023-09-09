// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs';
import path from 'path'
import {jsonPath, rootPath} from "@/constant";
import {Proposal} from "@/types";

type Data = {
  file: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await fs.access(rootPath, (fs.constants || fs).R_OK | (fs.constants || fs).W_OK);
  } catch {
    await fs.mkdir(rootPath, { recursive: true });
  }

  try {
    const reviewFile = await fs.readFile(path.join(rootPath, jsonPath), 'utf8')
    const reviewJson: Proposal[] = JSON.parse(reviewFile);

    if(reviewJson.length === 0) {
      await fs.writeFile(path.join(rootPath, jsonPath), JSON.stringify([
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
      ]),'utf8')
    }

    const inputData = [...reviewJson]
    await fs.writeFile(path.join(rootPath, jsonPath), JSON.stringify(inputData),'utf8')

    return res.status(200)
  } catch {
    return res.status(400)
  }
}

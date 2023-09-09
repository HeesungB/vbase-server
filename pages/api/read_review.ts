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
  try {
    await fs.access(path.join(rootPath, jsonPath), (fs.constants || fs).R_OK | (fs.constants || fs).W_OK);
  } catch {
    await fs.mkdir(path.join(rootPath, jsonPath), { recursive: true });
  }

  const jsonData = await fs.readFile(path.join(rootPath, jsonPath), 'utf8')

  return res.status(200).json({file: JSON.stringify(jsonData)});
}

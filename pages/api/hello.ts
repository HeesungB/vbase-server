// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  key: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.query["key"]) {
    const keyValue = req.query["key"];

    res.status(200).json({key: keyValue.toString()})
  }

  res.status(200).json({key: ""})

}

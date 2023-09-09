import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const chainId = request.query.chainId as string;
    const proposalId = request.query.proposalId as string;
    const address = request.query.address as string;
    const validatorAddress = request.query.validatorAddress as string;
    const review = request.query.review as string;
    const voteResult = request.query.voteResult as string;

    await sql`INSERT INTO reviews (chainId, proposalId, address, validatorAddress, review, voteResult) VALUES (${chainId}, ${proposalId} , ${address} , ${validatorAddress} , ${review} , ${voteResult});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
}

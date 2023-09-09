import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const { rows } = await sql`SELECT * FROM reviews`;
    return response.status(200).json(rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}

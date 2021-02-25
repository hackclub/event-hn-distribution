import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state } = req.query;

  const slack = new WebClient();
  const token = await slack.oauth.v2.access({
    code: code as string,
    client_id: "2210535565.1797890986900",
    client_secret: process.env.SLACK_CLIENT_SECRET,
  });

  res.end((token.authed_user as any).id);
};

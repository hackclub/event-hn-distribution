import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";
import { Event, getEvent } from "./event/[code]";

import airtable from "airtable";
import axios from "axios";

const base = airtable.base("appBDzOsE0ng4xGwY");
const logs = base("Logs");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state: eventCode } = req.query;

  let event: Event;
  try {
    event = await getEvent(eventCode as string);
  } catch (e) {
    // Event either doesn't exist or isn't running
    res.redirect(`/${eventCode}`);
    return;
  }

  const slack = new WebClient();
  const token = await slack.oauth.v2.access({
    code: code as string,
    client_id: "2210535565.1797890986900",
    client_secret: process.env.SLACK_CLIENT_SECRET,
  });

  const user = (token.authed_user as { id: string }).id;

  // Check to see if they've already gotten their moolah
  const selectedLogs = await logs
    .select({
      maxRecords: 1,
      filterByFormula: `AND(Event = "${eventCode}", User = "${user}")`,
    })
    .all();

  if (selectedLogs.length > 0) {
    // They've already received it
    res.redirect("/error");
    return;
  }

  // send le hn
  try {
    let resp = await axios.post(
      "https://hn.rishi.cx",
      {
        query: `mutation ($to: String!, $from: String!, $amount: Float!) {
      send(data: {from: $from, to: $to, balance: $amount}) {
        id
      }
    }`,
        variables: {
          from: process.env.HN_USER_ID,
          to: user,
          amount: event.Amount,
        },
      },
      {
        headers: {
          secret: process.env.HN_TOKEN,
        },
      }
    );

    if (resp.data.data.errors && resp.data.data.errors.length > 0) {
      throw {
        response: resp,
      };
    }
  } catch (e) {
    console.log(e.response.data);
    res.status(500).send("internal server error :(");
    return;
  }

  await logs.create({
    Event: eventCode,
    User: user,
  });

  res.redirect("/yay");
};

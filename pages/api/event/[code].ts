import { NextApiRequest, NextApiResponse } from "next";

import airtable from "airtable";
const base = airtable.base("appBDzOsE0ng4xGwY");
const events = base("Events");

export interface Event {
  Code: string;
  Name: string;
  Running: boolean;
  Amount: number;
}

export async function getEvent(code: string): Promise<Event> {
  const matchingEvents = await events
    .select({
      maxRecords: 1,
      filterByFormula: `Code = "${code}"`,
    })
    .all();

  if (matchingEvents.length == 0) {
    throw {
      ok: false,
      err: "event_not_found",
    };
  }

  if (!matchingEvents[0].fields["Running"]) {
    throw {
      ok: false,
      err: "event_not_running",
      ...matchingEvents[0].fields,
    };
  }

  return { ok: true, ...matchingEvents[0].fields };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { code },
  } = req;

  try {
    const event = await getEvent(code as string);

    res.status(200).json({ ...event });
  } catch (e) {
    res.status(404).json(e);
  }
};

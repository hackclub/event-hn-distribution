import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

import { getEvent } from "./api/event/[code]";

export default function Home({ event }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hack Club</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>
        Woohoo, you've just received some shiny new HN! 🎉
        <br />
        Type /peek in Slack to check your balance, and join the{" "}
        <a href="https://hackclub.slack.com/archives/C01ECJRQKGT">#hn</a>{" "}
        channel for more info!
      </h1>
    </div>
  );
}

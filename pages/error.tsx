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

      <h1>Hmm... looks like you've already received HN for this event 😕</h1>
    </div>
  );
}

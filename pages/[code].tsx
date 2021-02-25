import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

import { getEvent } from "./api/event/[code]";

export default function Home({ event }) {
  const router = useRouter();
  const { code } = router.query;

  if (!event.ok && event.err == "event_not_found") {
    return (
      <div className={styles.container}>
        <h1>
          Event <b>{code}</b> not found 😢
        </h1>
      </div>
    );
  } else if (!event.ok && event.err == "event_not_running") {
    return (
      <div className={styles.container}>
        <h1>
          Event <b>{event.Name}</b> has ended 😢
        </h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Hack Club</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>
        Sign in to get some HN for attending <b>{event.Name}</b>! 💸
      </h1>

      <a
        href={`https://slack.com/oauth/v2/authorize?state=${code}&user_scope=identity.basic&client_id=2210535565.1797890986900`}
      >
        <img
          alt="Sign in with Slack"
          height="40"
          width="172"
          src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
          srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
        />
      </a>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { code } = context.query;

  try {
    const event = await getEvent(code as string);

    return {
      props: { event },
    };
  } catch (e) {
    return {
      props: { event: e },
    };
  }
}

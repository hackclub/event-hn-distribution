import { gql, GraphQLClient } from "graphql-request";

export async function send(to: string, from: string, amount: number) {
  const client = new GraphQLClient("https://hn.rishi.cx", {
    headers: {
      secret: process.env.HN_TOKEN,
    },
  });

  await client.request(
    gql`
      mutation($to: String!, $from: String!, $amount: Float!) {
        send(data: { from: $from, to: $to, balance: $amount }) {
          id
        }
      }
    `,
    {
      to,
      from,
      amount,
    }
  );
}

export async function userExists(user: string): Promise<boolean> {
  const client = new GraphQLClient("https://hn.rishi.cx");

  try {
    await client.request(
      gql`
        query($user: String!) {
          user(id: $user) {
            id
          }
        }
      `,
      { user }
    );

    return true;
  } catch (e) {
    return false;
  }
}

export async function createUser(id: string) {
  const client = new GraphQLClient("https://hn.rishi.cx", {
    headers: {
      admin: process.env.HN_ADMIN_TOKEN,
    },
  });

  await client.request(
    gql`
      mutation($id: String!) {
        createUser(id: $id) {
          id
        }
      }
    `,
    { id }
  );
}

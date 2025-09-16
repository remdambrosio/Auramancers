import process from "node:process";
import fs from "fs";
import fetch from "node-fetch";
import { subWeeks, getISOWeek, getYear } from "date-fns";

const endpoint = "https://api.github.com/graphql";
const token = process.env.GITHUB_TOKEN;

const query = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        commitContributionsByRepository {
          repository {
            name
          }
          contributions(first: 100) {
            nodes {
              occurredAt
              commitCount
            }
          }
        }
      }
    }
  }
`;

async function main() {
  const to = new Date();
  const from = subWeeks(to, 12); // last 12 weeks

  const variables = {
    username: "remdambrosio",
    from: from.toISOString(),
    to: to.toISOString(),
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    process.exit(1);
  }
  if (!result.data || !result.data.user) {
    console.error("No user data found in response:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const weekly = {};
  const repos = result.data.user.contributionsCollection.commitContributionsByRepository;
  for (const repo of repos) {
    for (const node of repo.contributions.nodes) {
      const date = new Date(node.occurredAt);
      const year = getYear(date);
      const week = getISOWeek(date);
      const key = `${year}-W${week.toString().padStart(2, "0")}`;
      weekly[key] = (weekly[key] || 0) + node.commitCount;
    }
  }

  const counts = [];
  for (let i = 0; i < 12; i++) {
    const d = subWeeks(to, i);
    const year = getYear(d);
    const week = getISOWeek(d);
    const key = `${year}-W${week.toString().padStart(2, "0")}`;
    counts.unshift(weekly[key] || 0);
  }

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/contributions.json", JSON.stringify(counts, null, 2));

  console.log("Saved weekly contribution counts to data/contributions.json");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

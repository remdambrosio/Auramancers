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

  // collect all contributions from all repositories
  const contributions = result.data.user.contributionsCollection
    .commitContributionsByRepository
    .flatMap(r => r.contributions.nodes);

  // aggregate by week
  const weekly = {};
  for (const c of contributions) {
    const date = new Date(c.occurredAt);
    const year = getYear(date);
    const week = getISOWeek(date);
    const key = `${year}-W${week.toString().padStart(2, "0")}`;
    weekly[key] = (weekly[key] || 0) + c.commitCount;
  }

  // create a sorted array for the last 12 weeks
  const weeks = [];
  for (let i = 0; i < 12; i++) {
    const d = subWeeks(to, i);
    const year = getYear(d);
    const week = getISOWeek(d);
    const key = `${year}-W${week.toString().padStart(2, "0")}`;
    weeks.unshift({ week: key, commits: weekly[key] || 0 });
  }

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/contributions.json", JSON.stringify(weeks, null, 2));

  console.log("Saved weekly contributions to data/contributions.json");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

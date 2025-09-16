import process from "node:process";
import fs from "fs";
import fetch from "node-fetch";
import { subWeeks } from "date-fns";

const endpoint = "https://api.github.com/graphql";
const token = process.env.GITHUB_TOKEN;

const query = `
  query($username: String!, $repo: String!, $from: DateTime!, $to: DateTime!) {
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
    repo: "Auramancers",
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

  // pull out only the contributions for the requested repo
  const repoData = result.data.user.contributionsCollection
    .commitContributionsByRepository
    .find(r => r.repository.name === variables.repo);

  const contributions = repoData ? repoData.contributions.nodes : [];

  // save to JSON file
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/contributions.json", JSON.stringify(contributions, null, 2));

  console.log("Saved contributions to data/contributions.json");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

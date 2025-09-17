import process from "node:process";
import fs from "fs";
import fetch from "node-fetch";
import Sentiment from "sentiment";
import { Buffer } from "buffer";

const clientId = process.env.REDDIT_CLIENT_ID;
const clientSecret = process.env.REDDIT_CLIENT_SECRET;

async function getAccessToken() {
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "AuramancersBot/1.0 by /u/biggestboys on github.com/Auramancers"
    },
    body: "grant_type=client_credentials"
  });
  if (!response.ok) throw new Error(`Reddit OAuth error: ${response.status}`);
  const data = await response.json();
  return data.access_token;
}

async function fetchPosts(token) {
  const url = "https://oauth.reddit.com/r/wow/top?t=month&limit=12";
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "User-Agent": "AuramancersBot/1.0 by /u/biggestboys on github.com/Auramancers"
    }
  });
  if (!response.ok) throw new Error(`Reddit API error: ${response.status}`);
  const data = await response.json();
  return data.data.children.map(post => post.data.title);
}

async function main() {
  const sentiment = new Sentiment();
  const token = await getAccessToken();
  const titles = await fetchPosts(token);
  const scores = titles.map(title => sentiment.analyze(title).score);

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/wow.json", JSON.stringify(scores, null, 2));
  console.log("Saved sentiment scores to data/wow.json");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

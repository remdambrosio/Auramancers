import process from "node:process";
import fs from "fs";
import fetch from "node-fetch";
import Sentiment from "sentiment";

async function fetchPosts() {
  const url = "https://www.reddit.com/r/wow/top.json?t=month&limit=12";
  const response = await fetch(url, {
    headers: { "User-Agent": "AuramancersBot/1.0" }
  });
  if (!response.ok) throw new Error(`Reddit API error: ${response.status}`);
  const data = await response.json();
  return data.data.children.map(post => post.data.title);
}

async function main() {
  const sentiment = new Sentiment();
  const titles = await fetchPosts();
  const scores = titles.map(title => sentiment.analyze(title).score);

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/wow.json", JSON.stringify(scores, null, 2));
  console.log("Saved sentiment scores to data/wow.json");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

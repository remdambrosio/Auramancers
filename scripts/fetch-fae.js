import fs from "fs";
import googleTrends from "google-trends-api";

const keyword = "fae";

const weeksAgo = 12;
const msInWeek = 1000 * 60 * 60 * 24 * 7;
const startTime = new Date(Date.now() - msInWeek * weeksAgo);

async function fetchFaeTrends() {
  try {
    const results = await googleTrends.interestOverTime({
      keyword: keyword,
      startTime: startTime,
      endTime: new Date(),
      geo: "",
      granularTimeResolution: true,
    });

    const data = JSON.parse(results);
    const interestArray = data.default.timelineData.map(point => point.value[0]);
    fs.mkdirSync("data", { recursive: true });
    fs.writeFileSync("data/fae.json", JSON.stringify(interestArray, null, 2));
    console.log("Saved fae trends data to data/fae.json");
  } catch (err) {
    console.error("Error fetching fae trends:", err);
  }
}

fetchFaeTrends();

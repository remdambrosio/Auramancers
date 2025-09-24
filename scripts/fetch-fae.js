import fs from "fs";
import googleTrends from "google-trends-api";

const keyword = "fae";

const weeksAgo = 12;
const msInWeek = 1000 * 60 * 60 * 24 * 7;
const startTime = new Date(Date.now() - msInWeek * weeksAgo);

function aggregateWeekly(data) {
  const weekly = [];
  for (let i = 0; i < data.length; i += 7) {
    const weekSum = data.slice(i, i + 7).reduce((a, b) => a + b, 0);
    weekly.push(weekSum);
  }
  return weekly;
}

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
    const weeklyAggregated = aggregateWeekly(interestArray);
    fs.mkdirSync("data", { recursive: true });
    fs.writeFileSync("data/fae.json", JSON.stringify(weeklyAggregated, null, 2));
    console.log("Saved fae trends data to data/fae.json (weekly aggregated)");
  } catch (err) {
    console.error("Error fetching fae trends:", err);
  }
}

fetchFaeTrends();

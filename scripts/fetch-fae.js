import fs from "fs";
import googleTrends from "google-trends-api";

const keyword = "fae";

const weeksAgo = 12;
const msInWeek = 1000 * 60 * 60 * 24 * 7;
const startTime = new Date(Date.now() - msInWeek * weeksAgo);

function aggregateLast12WeeklyAverages(data) {
  const fullWeeksLength = Math.floor(data.length / 7) * 7;
  const startIdx = fullWeeksLength - 12 * 7;
  const weekly = [];
  for (let i = startIdx; i < fullWeeksLength; i += 7) {
    const week = data.slice(i, i + 7);
    const weekAvg = week.reduce((a, b) => a + b, 0) / week.length;
    weekly.push(weekAvg);
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
    const weeklyAverages = aggregateLast12WeeklyAverages(interestArray);
    fs.mkdirSync("data", { recursive: true });
    fs.writeFileSync("data/fae.json", JSON.stringify(weeklyAverages, null, 2));
    console.log("Saved fae trends data to data/fae.json (last 12 weekly averages, excluding current week)");
  } catch (err) {
    console.error("Error fetching fae trends:", err);
  }
}

fetchFaeTrends();

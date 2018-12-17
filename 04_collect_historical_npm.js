// Imports
const fs = require("fs");

function loadFile() {
  try {
    return JSON.parse(fs.readFileSync("./analysis/npm-packages-by-date.json"));
  } catch (err) {
    return [];
  }
}

function saveFile(results) {
  fs.writeFileSync(
    "./analysis/historic-npm-data.json",
    JSON.stringify(results, null, "  ")
  );
}
function isLastDay(dt) {
  return dt.getDate() === 1;
}


console.log("* Date: " + new Date().toUTCString());
run();

function run() {
  // console.log("Seeded Analyzer with Modules:", modulePackages.length);
  const results = [];

  for (const [date, packagesNum] of loadFile()) {
    const dt = new Date(date);
    if (!isLastDay(dt)) {
      continue;
    } else {
    }
    results.push({
      x: new Date(date).toISOString(),
      y: packagesNum
    });
  }

  // console.log("Searched", i);
  console.log("Searching Done");
  saveFile(results);
  console.log("Done Done");
}

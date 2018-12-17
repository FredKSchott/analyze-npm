// Imports
const fs = require("fs");

function loadFile() {
  try {
    return JSON.parse(fs.readFileSync("./analysis/modules-by-publish-month.json"));
  } catch (err) {
    return [];
  }
}

function saveFile(results) {
  fs.writeFileSync("./analysis/historic-data.json", JSON.stringify(results, null, "  "));
}

console.log("* Date: " + new Date().toUTCString());
run();

function run() {
  // console.log("Seeded Analyzer with Modules:", modulePackages.length);

  const labels = [];
  const values = [];
  const results = [];

  const sortedPackagesByDate = Object.entries(loadFile()).sort(
    ([aDate], [bDate]) => {
      return new Date(aDate) - new Date(bDate);
    }
  );
  let lastValue = 0;
  for (const [date, packages] of sortedPackagesByDate) {
    labels.push(date);
    values.push(lastValue + packages.length);
    results.push({
      x: date,
      y: lastValue + packages.length})
    lastValue = lastValue + packages.length;
  }

  // console.log("Searched", i);
  console.log("Searczxsxwhing Done");
  saveFile({ labels, values, results });
  console.log("Done Done");
}

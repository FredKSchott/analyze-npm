// Configurable Values
const PAGE_SIZE = 100;
const PAGE_START = 0;
const PAGE_END = 10000001;

// Imports
const inputFileName = process.argv[2] || "./data/dependenciesGraph.out.graph";
const count = process.argv[3] || 100;
const centrality = require("ngraph.centrality");
const fromjson = require("ngraph.fromjson");
const fs = require("fs");
const got = require("got");
const errors = [];

function loadFile() {
  try {
    return JSON.parse(fs.readFileSync("./found-modules.json"));
  } catch (err) {
    return [];
  }
}

function saveFile(modulePackages) {
  fs.writeFileSync(
    "./found-modules.json",
    JSON.stringify(modulePackages, null, "  ")
  );
}

console.log("* Date: " + new Date().toUTCString());
console.log("* Input file: `" + inputFileName + "`");
const graph = fromjson(fs.readFileSync(inputFileName, "utf8"));
run(centrality.degree(graph, "in"));

async function analyzePackageForModule(pkgName) {
  let response;
  try {
    response = await got("http://registry.npmjs.org/" + pkgName, {
      json: true
    });
  } catch (err) {
    // console.log(err);
    errors.push([pkgName, err]);
    return false;
  }

  if (!response.body["dist-tags"] || !response.body["dist-tags"].latest) {
    return false;
  }

  const latestVersion = response.body["dist-tags"].latest;
  if (!response.body.versions || !response.body.versions[latestVersion]) {
    return false;
  }

  const body = response.body.versions[latestVersion];
  if (!body.module) {
    return false;
  }

  return pkgName;
}

async function run(stats) {
  const allKeys = Object.keys(stats);
  const modulePackages = new Set(loadFile());
  console.log(
    "Seeded Analyzer with Modules:",
    modulePackages.size
  );
  console.log("Total Packages to Analyze:", allKeys.length);

  for (let i = PAGE_START; i < allKeys.length && i < PAGE_END; i = i + PAGE_SIZE) {
    console.time(`page`);
    (await Promise.all(
      allKeys
        .slice(i, Math.min(i + PAGE_SIZE, allKeys.length))
        .map(analyzePackageForModule)
    ))
      .filter(Boolean)
      .map(pkgName => (modulePackages.add(pkgName)));
    console.timeEnd(`page`);

    if (i % 2000 === 0 && i !== PAGE_START) {
      console.log("Saving", i);
      saveFile(Array.from(modulePackages));
      console.log("Saved", i);
    }
    console.log("Searched", i);
  }
  console.log("Saving Done");
  saveFile(Array.from(modulePackages));
  console.log("Saved Done");
}

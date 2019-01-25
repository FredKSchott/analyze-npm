// For each known module package
// load it from the registry
// check each version in order, looking for "module" === undefined
// if undefined, get the published date of the previously checked version
// save that to a file: {'date': [package-name]}

// Configurable Values
const PAGE_SIZE = 100;
const PAGE_START = 0;
const PAGE_END = 10000001;

// Imports
const fs = require("fs");
const got = require("got");
const errors = [];

function loadFile() {
  try {
    return JSON.parse(fs.readFileSync("./analysis/found-modules.json"));
  } catch (err) {
    return {};
  }
}

function saveFile(modulePackages) {
  fs.writeFileSync(
    "./analysis/modules-by-publish-month.json",
    JSON.stringify(modulePackages, null, "  ")
  );
}

console.log("* Date: " + new Date().toUTCString());
run();

async function analyzePackageForModule([pkgName]) {
  let response;
  try {
    response = await got("http://registry.npmjs.org/" + pkgName, {
      json: true
    });
  } catch (err) {
    console.log("http://registry.npmjs.org/" + pkgName, err);
    // errors.push([pkgName, err]);
    return false;
  }
  if (!response.body.versions && !response.body.time) {
    console.log(`expected properties not found`, response.body);
    return false;
  }

  // sort response.body.time by value (alph.), filter out "modified" & "created"
  // for each, in order:
  // check "module" entrypoint
  // if it exists, return that date (.substring(0, '2018-09-12'.length));

  const sortedVersions = Object.entries(response.body.time).sort(
    ([aName, aDate], [bName, bDate]) => {
      return new Date(aDate) - new Date(bDate);
    }
  );

  for (const [version, publishDate] of sortedVersions) {
    if (!response.body.versions) {
      continue;
    }
    const packageData = response.body.versions[version];
    if (!packageData) {
      continue;
    }
    if (!packageData.module) {
      continue;
    }
    return [pkgName, publishDate.substring(0, "2018-XX".length)];
  }
  console.log(`couldn't figure it out`, response.body);
  return false;
}

async function run() {
  const modulePackages = Object.entries(loadFile());
  const modulePackagesTotal = modulePackages.length;
  console.log("Seeded Analyzer with Modules:", modulePackagesTotal);

  const results = {};
  for (
    let i = PAGE_START;
    i < modulePackagesTotal && i < PAGE_END;
    i = i + PAGE_SIZE
  ) {
    console.time(`page`);
    (await Promise.all(
      modulePackages
        .slice(i, Math.min(i + PAGE_SIZE, modulePackagesTotal))
        .map(analyzePackageForModule)
    ))
      .filter(Boolean)
      .map(([pkgName, date]) => {
        results[date] = results[date] || [];
        results[date].push(pkgName);
      });
    console.timeEnd(`page`);

    if (i % 1000 === 0 && i !== PAGE_START) {
      console.log("Saving", i);
      saveFile(results);
      console.log("Saved", i);
    }
  }
  // console.log("Searched", i);
  console.log("Searching Done");
  saveFile(results);
  console.log("Done Done");
}

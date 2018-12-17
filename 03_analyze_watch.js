/*
 * NOTE: THIS FILE IS STILL IN PROGRESS, RUN AT YOUR OWN RISK
 */
const fs = require("fs");
const forEachPackage = require('./lib/forEachPackage.js');

const currentRev = process.argv[2] || fs.readFileSync('./data/currentRev');
const modules = new Set();
console.log('Parsing npm packages file...');


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

// load https://skimdb.npmjs.com/registry/_changes?since=5513920 but with currentRev
// for each new ID, ask the registry

forEachPackage(inputFileName, (pkg) => {
    if(pkg.value.module) {
      modules.add(pkg.id);
    }
  },
  () => {
    console.log(`Done! Found ${modules.size} modules.`);
    fs.writeFileSync(
      "./analysis/found-modules.json",
      JSON.stringify(Array.from(modules), null, "  ")
    );
  }
);

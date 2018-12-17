const fs = require("fs");
const forEachPackage = require('./lib/forEachPackage.js');

const inputFileName = process.argv[2] || './data/byField.in.graph';
const modules = new Set();
console.log('Parsing npm packages file...');

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

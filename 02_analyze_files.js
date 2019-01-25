var fs = require('fs');
// 277000: First module is at 277026
// 8010766: last full sync
const STARTING_SEQ = 0;

function loadFile() {
  return JSON.parse(fs.readFileSync("./analysis/found-packages-with-files.json"));
}

function saveFile(contents) {
  fs.writeFileSync(
    "./analysis/found-packages-with-files.json",
    JSON.stringify(Array.from(contents), null, "  ")
  );
}

const results = new Set(loadFile());
const registry = require('package-stream')({since: STARTING_SEQ});
let count = 0;
console.time(count);
registry
  .on('package', (pkg, seq) => {
    count++;
    // console.log(seq);
    if (count % 1000 === 0) {
      console.timeEnd(count);
      console.log('Saving...', seq);
      saveFile(results);
      console.log('Saved.', Object.keys(results).length);
      console.time(count + 1000);
    }
    if(pkg.files) {
      results.add(pkg.name);
    } else {
      results.remove(pkg.name);
    }

  })
  .on('up-to-date', function (seq) {
    console.log(`[${seq}] Done! Found ${Object.keys(results).length} modules.`);
    saveFile(results);
    // The stream will remain open and continue receiving package
    // updates from the registry as they occur in real time.
  })
  .on('error', (err) => {
    console.log(err);
  })
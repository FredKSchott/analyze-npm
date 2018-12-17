# @pikapkg/analyze-npm

This repository searches the npm graph for the most popular "module" packages.  
Based on [@anvaka/npmrank](https://github.com/anvaka/npmrank).


# Setup

#### 1. Clone & Install
```
git clone https://github.com/pikapkg/npm-esm-analyze.git
cd npm-esm-analyze
npm install
```

#### 2. Download the npm graph data:

```
./01_get_graph.sh
```

This will download graph from skimdb and save it to `data` folder. As of
September 2016 this data is about 500MB.

#### 3. FInd all ES modules in the local graph data:

node --max-old-space-size=4096 02_analyze_new.js

#### 3. Create the graph for additional analysis:

Convert it to `ngraph.graph` format
for further analysis.

```
node --max-old-space-size=4096 02_create_graph.js
```

You are now ready to analyze the graph.

## Running additional analysis:

```
node --max-old-space-size=4096 03_analyze_historical.js
node --max-old-space-size=4096 04_collect_historical.js
node --max-old-space-size=4096 04_collect_historical_npm.js
```

This will write out a dictionary of "module" packages on npm, to the file called `found-modules.json`.

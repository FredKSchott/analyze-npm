# @pikapkg/analyze-npm

This repository searches the npm graph for the most popular "module" packages.

Based on the fantastic `npmrank` package by @anvaka: https://github.com/anvaka/npmrank


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

#### 3. Create the graph:

Convert it to `ngraph.graph` format
for further analysis.

```
node --max-old-space-size=4096 02_create_graph.js
```

You are now ready to analyze the graph.

## Running Analysis:

```
node --max-old-space-size=4096 03_analyze.js
```

This will write out a dictionary of "module" packages on npm, to the file called `found-modules.json`.

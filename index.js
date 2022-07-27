#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const metadataTemplate = require("./metadata-template.json");
const attributes = require("./attributes.json");

const extractPositionals = (args, map) => {
  for (let i = 0; i < map.length; i++) {
    const { name, required } = map[i];
    args[name] = args._[i + 1];
    console.log(args);
    if (required && !args[name]) {
      console.error(`${name} is required`);
      process.exit(1);
    }
  }
};

function resolveHome(filepath) {
  if (filepath[0] === "~") {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

const ensureOutDirExists = (outDir) => {
  try {
    fs.readdirSync(outDir);
  } catch (e) {
    fs.mkdirSync(outDir, { recursive: true });
  }
};

const generateImages = async (startId, endId, outDir) => {
  for (let tokenId = startId; tokenId <= endId; tokenId++) {
    console.log(`generating ${tokenId}.jpeg...`);
    const img = await jimp.create(512, 512, "#FF0000");
    img.color([
      {
        apply: "hue",
        params: [Math.random() * 360],
      },
    ]);
    await img.writeAsync(`${outDir}/${tokenId}.jpeg`);
  }
};

const generateMetadata = (startId, endId, outDir) => {
  for (let tokenId = startId; tokenId <= endId; tokenId++) {
    console.log(`generating ${tokenId}.json...`);
    const metadata = populateMetadata(tokenId);
    fs.writeFileSync(
      `${outDir}/${tokenId}.json`, // check with t10... I think we actually don't want the extension?
      JSON.stringify(metadata, null, 2)
    );
  }
};

const populateMetadata = (tokenId) => {
  const template = JSON.parse(JSON.stringify(metadataTemplate));
  return {
    tokenId,
    name: `${template.name}${tokenId}`,
    description: template.description,
    image: `${template.image}/${tokenId}.jpeg`,
    attributes: attributes.map((a) => {
      const roll = Math.round(Math.random() * (a.values.length - 1));
      const value = a.values[roll];
      return {
        trait_type: a.trait_type,
        value,
      };
    }),
  };
};

yargs(hideBin(process.argv))
  .option("startId", {
    alias: "s",
    demandOption: true,
    description: "the starting token ID for the output assets",
  })
  .option("endId", {
    alias: "e",
    demandOption: true,
    description: "the ending token ID for the output assets",
  })
  .positional("outDir", {
    description: "the directory in which to generate the placeholder assets",
  })
  .command({
    command: "images",
    handler: async (args) => {
      extractPositionals(args, [
        {
          name: "outDir",
          required: true,
        },
      ]);
      args.outDir = resolveHome(args.outDir);
      ensureOutDirExists(args.outDir);
      await generateImages(args.startId, args.endId, args.outDir);
    },
  })
  .command({
    command: "metadata",
    handler: async (args) => {
      extractPositionals(args, [
        {
          name: "outDir",
          required: true,
        },
      ]);
      args.outDir = resolveHome(args.outDir);
      ensureOutDirExists(args.outDir);
      await generateMetadata(args.startId, args.endId, args.outDir);
    },
  }).argv;

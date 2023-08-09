import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import debug from "debug";

import { getInputFiles, getOutputFile } from "./util.js";
import {
  transformCsvToJson,
  transformToArray,
  mergeStreams,
} from "./streams.js";

const log = debug("app:main");

const files = await getInputFiles();
if (!files.length) {
  throw new Error("There aren't files");
}

log("📦 processing...");

const fileName = files[0].match(/^.*\/(?<name>.*)\.csv$/).groups.name;
const streams = files.map((item) => createReadStream(item));
const input = mergeStreams(streams);
const output = createWriteStream(getOutputFile(fileName));
await pipeline(input, transformCsvToJson, transformToArray, output);

log(`📝 process finished and a document created`);

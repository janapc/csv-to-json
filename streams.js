import { Transform, PassThrough } from "stream";

let first = true;
const transformToArray = new Transform({
  flush: function (cb) {
    this.push("]");
    cb(null);
  },
  transform: function (chunk, encoding, cb) {
    let msg = chunk.toString();
    if (first) {
      msg = msg.replace(/^\,/, "[");
      first = false;
    }
    cb(null, msg);
  },
});

const transformCsvToJson = new Transform({
  transform: function (chunk, encoding, cb) {
    const str = chunk.toString();
    let lines = str.split("\n").map((item) => item.replace(/\r/g, ""));
    const headers = lines[0]
      .split(",")
      .map((item) => item.toLowerCase().replace(/\s/g, "_"));
    lines = lines.slice(1, lines.length);
    let response = "";
    lines.forEach((line) => {
      const msg = line.split(",");
      let data = {};
      msg.forEach((item, i) => {
        data[headers[i]] = item;
      });
      response += "," + JSON.stringify(data);
    });
    cb(null, response);
  },
});

function mergeStreams(streams) {
  let pass = new PassThrough();
  for (let stream of streams) {
    const end = stream === streams.at(-1);
    pass = stream.pipe(pass, { end });
  }
  return pass;
}

export { transformCsvToJson, transformToArray, mergeStreams };

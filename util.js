import { dirname, join } from "path";
import { readdir } from "fs/promises";

const getCurrentDir = () => {
  const { pathname } = new URL(import.meta.url);
  return dirname(pathname);
};

async function getInputFiles() {
  const currentDir = getCurrentDir();
  const dirFiles = `${currentDir}/files`;
  const files = await readdir(dirFiles);
  return files.map((item) => join(dirFiles, item));
}

function getOutputFile(fileName) {
  const currentDir = getCurrentDir();
  return `${currentDir}/${fileName}.json`;
}

export { getInputFiles, getOutputFile };

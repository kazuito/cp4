import { program } from "commander";
import { cp } from "fs/promises";
import { CopyOptions, watch, WatchOptions } from "fs";

async function main() {
  program
    .option("-r, --recursive", "copy directories recursively")
    .argument("<file>", "file/dir to copy")
    .argument("<dest>", "destination");

  program.parse();

  const options = program.opts();
  const [filePath, destPath] = program.args;

  const copyOptions: CopyOptions = {
    recursive: !!options.recursive,
  };
  const watchOptions: WatchOptions = {
    recursive: !!options.recursive,
  };

  const copy = async () => {
    await cp(filePath, destPath, copyOptions);
  };

  // watch for changes
  watch(filePath, watchOptions, async (eventType, filename) => {
    await copy();
    console.log(`[watch] copied "${filePath}/${filename}" to "${destPath}/${filename}"`);
  });

  // initial copy
  await copy();
  console.log(`[watch] copied "${filePath}" to "${destPath}"`);
}

try {
  main();
} catch (error) {
  console.error(error);
}

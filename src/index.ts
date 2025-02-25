import { program } from "commander";
import { cp } from "fs/promises";
import { CopyOptions, watch, WatchOptions } from "fs";

async function main() {
  program
    .option("-r, --recursive", "copy directories recursively")
    .argument("<source>", "file/dir to copy")
    .argument("<destination>", "destination");

  program.parse();

  const options = program.opts();
  const [srcPath, destPath] = program.args;

  const copyOptions: CopyOptions = {
    recursive: !!options.recursive,
  };
  const watchOptions: WatchOptions = {
    recursive: !!options.recursive,
  };

  const copy = async () => {
    await cp(srcPath, destPath, copyOptions);
  };

  // watch for changes
  watch(srcPath, watchOptions, async (_, filename) => {
    await copy();
    console.log(
      `[watch] copied "${srcPath}/${filename}" to "${destPath}/${filename}"`
    );
  });

  // initial copy
  await copy();
  console.log(`[watch] copied "${srcPath}" to "${destPath}", watching for changes...`);
}

try {
  main();
} catch (error) {
  console.error(error);
}

import { program } from "commander";
import { cp } from "fs/promises";
import { watch, CopyOptions, WatchOptions } from "fs";

program
  .option("-r, --recursive", "copy directories recursively")
  .option("-f, --force", "overwrite existing files (default: true)", true)
  .option("-n, --no-clobber", "do not overwrite existing files")
  .option("-p, --preserve-timestamps", "preserve modification and access times")
  .argument("<source>", "source file or directory")
  .argument("<destination>", "destination file or directory")
  .action(async (srcPath: string, destPath: string, options: any) => {
    const copyOptions: CopyOptions = {
      recursive: !!options.recursive,
      force: options.noClobber ? false : options.force,
      errorOnExist: !!options.noClobber,
      preserveTimestamps: !!options.preserveTimestamps,
    };

    const watchOptions: WatchOptions = {
      recursive: !!options.recursive,
    };

    async function performCopy() {
      try {
        await cp(srcPath, destPath, copyOptions);
      } catch (err) {
        console.error(`${err}`);
      }
    }

    // perform initial copy
    await performCopy();
    console.log(
      `[watch] copied "${srcPath}" to "${destPath}", watching for changes...`
    );

    // watch for changes
    watch(srcPath, watchOptions, async (_, filename) => {
      try {
        await performCopy();
        console.log(`[watch] copied "${srcPath}/${filename}" to "${destPath}"`);
      } catch (err) {
        console.error(`[watch] error during watching: ${err}`);
      }
    });
  });

program.parseAsync().catch((err) => {
  console.error(`${err}`);
});

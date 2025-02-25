import { program } from "commander";
import { cp } from "fs/promises";
import { watch, CopyOptions, WatchOptions } from "fs";

program
  .argument("<source>", "source file or directory")
  .argument("<destination>", "destination file or directory")
  .action(async (srcPath: string, destPath: string, options: any) => {
    const copyOptions: CopyOptions = {
      recursive: true
    };

    const watchOptions: WatchOptions = {
      recursive: true
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

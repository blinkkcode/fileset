#!/usr/bin/env node

import {ServeCommand} from './commands/serve';
import {UploadCommand} from './commands/upload';
import {createCommand} from 'commander';

async function main() {
  const program = createCommand();

  program
    .command('upload [dir]')
    .description('Uploads a directory to cloud storage')
    .option('-s, --site <site>', 'site', '')
    .option('-r, --ref <ref>', 'ref', '')
    .option('-b, --branch <branch>', 'branch', '')
    .option('-f, --force', 'force', false)
    .option('-t, --ttl <ttl>', 'ttl', undefined)
    .action(async (path, options) => {
      const cmd = new UploadCommand(options);
      await cmd.run(path);
    });

  program
    .command('serve')
    .description('Runs the server')
    .option('-s, --site <site>', 'site', '')
    .option('-r, --ref <ref>', 'ref', '')
    .action(options => {
      const cmd = new ServeCommand(options);
      cmd.run();
    });

  await program.parseAsync(process.argv);
}

main();

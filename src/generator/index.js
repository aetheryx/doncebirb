/**
 * doncebirb, a server to display rainbow gifs to clients through curl
 * Copyright (C) 2019 aetheryx
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

require('./dependencyCheck.js');
const { promisify } = require('util');
const { resolve }   = require('path');
const { mkdir }     = require('fs').promises;
const { exec }      = require('child_process');

const gifsDirPath = resolve(__dirname, '..', '..', 'gifs');
const execAsync   = promisify(exec);

const [ name, url, width = 64 ] = process.argv.slice(2);
if (!name || !url) {
  console.error('Missing gif name or url.\nExiting...');
  process.exit(1);
}

(async () => {
  const gifDirPath = resolve(gifsDirPath, name);
  const cwd = { cwd: gifDirPath };

  await mkdir(gifDirPath);
  console.log('Created', gifDirPath);

  await execAsync(`curl -L ${url} > ${name}.gif`, cwd);
  console.log('Downloaded', resolve(gifDirPath, `${name}.gif`));

  const frameCount = await execAsync(`ffmpeg \
    -i ${name}.gif \
    -vsync 0 \
    -start_number 0 \
    -filter_complex "\
      color=black,\
      format=rgb24[c];[c][0]scale2ref[c][i];[c][i]overlay=format=auto:shortest=1,\
      setsar=1,\
      scale=${width}:-1" \
    ./%02d.jpg`, cwd
  ).then(({ stderr }) => +stderr.match(/frame=\s+(\d+)/)[1]);
  console.log('Created', frameCount, 'jpg frames');

  await Promise.all(
    Array(frameCount).fill(0).map((_, i) =>
      execAsync(`jp2a --width=${width} ${String(i).padStart(2, '0')}.jpg --output=${String(i).padStart(2, '0')}.txt`, cwd)
    )
  );
  console.log('Created', frameCount, 'txt frames');

  await execAsync('rm *.jpg; rm *.gif', cwd);
  console.log('Cleaned up temporary files.\nDone!');
  process.exit(0);
})();

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

const AnsiCodes = require('./AnsiCodes.js');
const { readdir, readFile } = require('fs').promises;
const { resolve } = require('path');

module.exports = async () => {
  const gifDirPath = resolve(__dirname, '..', '..', 'gifs');
  const out = {};

  for (const gif of await readdir(gifDirPath)) {
    const framePaths = await readdir(resolve(gifDirPath, gif));
    out[gif] = await Promise.all(
      framePaths
        .map(async (framePath, index) =>
          Buffer.concat([
            Buffer.from(
              AnsiCodes.CURSOR_RESET +
              AnsiCodes.COLORS[index % AnsiCodes.COLORS.length]
            ),
            await readFile(resolve(gifDirPath, gif, framePath))
          ])
        )
    );
  }

  return out;
};

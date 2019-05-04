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

module.exports = {
  CURSOR_RESET: '\u001b[0;0H',
  CLEAR_BUFFER: '\u001b[2J',
  COLORS: [
    '\u001b[31m', // red
    '\u001b[32m', // green
    '\u001b[33m', // yellow
    '\u001b[34m', // blue
    '\u001b[35m', // magenta
    '\u001b[36m', // cyan
    '\u001b[37m'  // white
  ]
};

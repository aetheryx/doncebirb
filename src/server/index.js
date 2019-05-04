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

const { createServer } = require('http');
const ServerResponse   = require('./CustomServerResponse.js');
const { promisify }    = require('util');
const AnsiCodes        = require('./AnsiCodes.js');
const loadGifs         = require('./loadGifs.js');
const config           = require('../../config.json');

const server = createServer({ ServerResponse });
const sleep  = promisify(setTimeout);
const port   = +config.port || 8080;
let gifs;

loadGifs().then(_gifs => {
  gifs = _gifs;
  server.listen(port, () =>
    console.log('Loaded', Object.keys(gifs).length, 'gif(s) and listening to port', port)
  )
});

server.on('request', async (req, res) => {
  if (req.method !== 'GET') {
    return res.finish(405, {
      Allow: 'GET'
    }, '405 Method Not Allowed');
  }

  if (req.url === '/count') {
    return server.getConnections((_, connections) =>
      res.finish(200, {}, String(connections))
    );
  }

  if (req.headers['user-agent'] && !req.headers['user-agent'].includes('curl')) {
    return res.finish(200, {}, '$ curl donce.aeth.dev');
  }

  const gifName = req.url.slice(1);
  const gif = gifs[gifName] || gifs[config.default];

  await res.write(AnsiCodes.CLEAR_BUFFER);

  let currentFrameIndex = -1;
  while (!res.socket.destroyed) {
    await res.write(gif[++currentFrameIndex] || gif[currentFrameIndex = 0]);
    await sleep(60);
  }
});

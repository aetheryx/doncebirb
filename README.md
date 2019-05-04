# doncebirb
a server to display rainbow gifs to clients through curl
```bash
curl donce.aeth.dev
```  


While doncebirb does garner some inspiration from [hugomd/parrot.live](https://github.com/hugomd/parrot.live), it's rewritten from scratch with far less overhead. Frame paint logic is visibly more optimized ([comparison](https://aeth.dev/980ad6.mp4)) — not to mention doncebirb includes a module to convert gifs to ASCII frames, meaning you could set up this project for any gif at all rather than *just* partyparrot. I would be happy to PR these changes to parrot.live instead, but it's unmaintained. ¯\\_(ツ)\_/¯

# Hello board app-sample

Hello board app using express-ws, and [node-serialports](https://github.com/serialport/node-serialport) .

## Development

:warning: you need to have connexion with a board that send one data each `x` seconds.

```shell
$ git clone https://github.com/madjid-asa/hello-board-app.git
$ cd hello-board-app
$ yarn install # or npm i
$ node server.js
```

And access to [localhost:3000](http://localhost:3000/).

Based on the sample application [express-ws-chat-sample](https://github.com/y-temp4/express-ws-chat-sample)
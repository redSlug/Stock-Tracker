[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

# Stock Tracker

This app was created using [the React tutorial](http://facebook.github.io/react/docs/tutorial.html) as a starting point.

## To use

server.js serves static files from `public/` and handles requests to `/api/comments` to fetch or add data. Start a server with following:

```sh
npm install
node server.js
```

And visit <http://localhost:3000/>. Try opening multiple tabs!

## Changing the port

You can change the port number by setting the `$PORT` environment variable before invoking any of the scripts above, e.g.,

```sh
PORT=3001 node server.js
```

## Screenshot
![Screenshot of the stock tracker app](/trackerWithDate.png)

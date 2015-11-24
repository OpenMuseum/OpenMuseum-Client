# OpenMuseum-Client

## Install

Check out the code:
```
git clone git@github.com:OpenMuseum/OpenMuseum-Client.git
```

Install the npm dependencies
```
npm install
```

Install [gulp](http://gulpjs.com/)
```
npm install -g gulp bower
```

Install bower dependencies
```
bower install
```

[Configure](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode) your server to work with html5Mode.

## Run

Available Gulp tasks

- `gulp` or `gulp build` to build an optimized version of your application in `/dist`
- `gulp serve` to launch a browser sync server on your source files
- `gulp serve:dist` to launch a server on your optimized application
- `gulp test` to launch your unit tests with Karma
- `gulp test:auto` to launch your unit tests with Karma in watch mode
- `gulp protractor` to launch your e2e tests with Protractor
- `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

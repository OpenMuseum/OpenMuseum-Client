require.config({
    baseUrl: '../src/app/',
    paths: {
        'angular': '../lib/angular/angular',
        'angular-route': '../lib/angular-route/angular-route',
        'domReady': '../lib/requirejs-domready/domReady',
        'leaflet': '../lib/leaflet/dist/leaflet-src',
        'lodash': '../lib/lodash/lodash'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        }
    },
    deps: ['./bootstrap']
});

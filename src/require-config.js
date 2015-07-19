require.config({
    paths: {
        'angular': '../src/lib/angular/angular'
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
    },
    deps: ['app.module']
});

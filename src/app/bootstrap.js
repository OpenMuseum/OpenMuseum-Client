/**
 * Bootstraps Angular onto the window.document node
 */
define([
    'require',
    'angular',
    'app.module'
], function (require, angular) {
    'use strict';

    require(['domReady!'], function (document) {
        angular.bootstrap(document, ['app']);
    });
});

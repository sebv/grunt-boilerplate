/*global WelcomeCtrl:false*/

'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('', 
      {templateUrl: 'partials/welcome.html', controller: WelcomeCtrl});
    $routeProvider.when('/welcome', 
      {templateUrl: 'partials/welcome.html', controller: WelcomeCtrl});
  }]);


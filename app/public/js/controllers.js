'use strict';

/* Controllers */


function WelcomeCtrl($scope) {
  $scope.main = {
    heading: 'Hello, world!',
    time: (new Date()).getTime() % 1000,
    desc: 'This is a template for a simple marketing or informational ' + 
          'website. It includes a large callout called the hero unit and ' +
          'three supporting pieces of content. Use it as a starting point ' +
          'to create something more unique.'
  };
}
WelcomeCtrl.$inject = ['$scope'];

/*
function MyCtrl2() {
}
MyCtrl2.$inject = [];
*/

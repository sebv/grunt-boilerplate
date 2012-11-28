'use strict';

/* Controllers */


function WelcomeCtrl($scope) {
  $scope.main = {
    heading: 'Hello, world!',
    time: moment().format("HH:mm:ss") ,
    desc: 'This is a template for a simple marketing or informational ' + 
          'website. It includes a large callout called the hero unit and ' +
          'three supporting pieces of content. Use it as a starting point ' +
          'to create something more unique.'
  };
}
WelcomeCtrl.$inject = ['$scope'];


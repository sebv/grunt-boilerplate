'use strict';

/* jasmine specs for controllers go here */

describe('WelcomeCtrl', function(){
  var welcomeCtrl;

  beforeEach(inject(function($rootScope) {
    var $scope = $rootScope.$new();
    welcomeCtrl = new WelcomeCtrl($scope);
  }));

  it('should ....', function() {
    //spec body
  });
});


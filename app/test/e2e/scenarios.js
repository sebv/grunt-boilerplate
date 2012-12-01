'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {
  
  describe('navigate to root url', function() {
    
    beforeEach(function() {
      browser().navigateTo('/');
    });


    it('location should be empty', function() {
      expect(browser().location().url()).toBe("");
    });

  });

  describe('navigate to welcome url', function() {
    
    beforeEach(function() {
      browser().navigateTo('/#welcome');
    });


    it('location should be empty', function() {
      //pause();
      expect(browser().location().url()).toBe("/welcome");
    });

  });
});

// for autotest config and port see Gruntfile.js

basePath = '../..';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'public/lib/angular/angular.js',
  'public/lib/angular/angular-*.js',
  'public/lib/moment.js',
  'test/lib/angular/angular-mocks.js',
  'public/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = false;

// uncomment to automatically spawn browser
browsers = ['Chrome'];

// Auto run tests on start (when browsers are captured) and exit
singleRun = true;

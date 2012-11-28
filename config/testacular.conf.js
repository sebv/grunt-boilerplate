// for autotest config and port see Gruntfile.js

basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/public/lib/angular/angular.js',
  'app/public/lib/angular/angular-*.js',
  'app/public/lib/moment.js',
  'test/lib/angular/angular-mocks.js',
  'app/public/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = false;

// uncomment to automatically spawn browser
browsers = ['Chrome'];

// Auto run tests on start (when browsers are captured) and exit
singleRun = true;

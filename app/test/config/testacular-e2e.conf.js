basePath = '../..';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

urlRoot = '/__testacular/';

proxies = {
  '/': 'http://localhost:3004/'
};

autoWatch = false;

browsers = ['Chrome'];

singleRun = true;


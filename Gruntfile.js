'use strict';

var path = require('path');
/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    ///////////////////////////////
    //
    // Global Config
    //
    ////////////////////////////////
    
    pkg: '<json:package.json>',
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    dirs: {
      root: 'app/public',
      staging: 'temp/staging',
      dist: 'dist',
      sass: 'app/sass',
      test: 'test'
    },
    ///////////////////////////////
    //
    // Server/Reload
    //
    ////////////////////////////////
    
    server: {
      dev: {
        options: {
          port: 3001,
          base: '<%= dirs.root %>',
          keepalive: false
        }
      },
      build: {
        options: {
          port: 3002,
          base: '<%= dirs.staging %>/step3',
          keepalive: false
        }
      },
      dist: {
        options: {
          port: 3003,
          base: '<%= dirs.dist %>/public',
          keepalive: true
        }
      },
      'e2e-dev': {
        options: {
          port: 3004,
          base: '<%= dirs.root %>',
          keepalive: false
        }
      },
      'e2e-dist': {
        options: {
          port: 3004,
          base: '<%= dirs.dist %>/public',
          keepalive: false
        }
      },
    },
    reload: {
      port: 3000,
      proxy: {
          host: 'localhost',
          port: '3001'
      }
    },
    
    ///////////////////////////////
    //
    // Compass
    //
    ////////////////////////////////
    
    compass: {
      dev: {
        options: {
          config: '<%= dirs.sass %>/config.rb',
          sassDir: '<%= dirs.sass %>',
          cssDir: '<%= dirs.root %>/css',
          environment: 'development',
        }
      },
      dist: {
        options: {
          config: '<%= dirs.sass %>/config.rb',
          sassDir: '<%= dirs.sass %>',
          cssDir: '<%= dirs.staging %>/step1/css',
          environment: 'production',
          force: true
        }
      }
    },

    ///////////////////////////////
    //
    // Dev 
    //
    ////////////////////////////////
    watch: {
      options: {
        debounceDelay: 1000,
        spawn: false,
        rewatch: true,
        forceWatchMethod: 'new'
      },
      html: {
        files: ['<%= dirs.root %>/**/*.html'],
        tasks: ['reload']
      },
      js: {
        files: ['<%= dirs.root %>/js/**/*.js'],
        tasks: 'reload'
      },
      compass: {
        files: [ '<%= dirs.sass %>/*.sass' ],
        tasks: [ 'compass:dev', 'reload']
      },
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        //globalstrict: true,
        globals: {
          require: true,
          angular: true,
        }
      },
      all: [  'Gruntfile.js', 
                '<%= dirs.root %>/js/**/*.js' 
           ]
    },
    
    ///////////////////////////////
    //
    // Test 
    //
    ////////////////////////////////


    qunit: {
      files: ['test/**/*.html']
    },

    /////////////////////////////////
    //
    // Build
    //
    ////////////////////////////////
    clean: {
      dist: ['<%= dirs.staging %>','<%= dirs.dist %>']
    },
    copy: {
      'dist-step-1': {
         options: {
           cwd: '<%= dirs.root %>'
         },
         src: ['**','!css/**'],
         dest: '<%= dirs.staging %>/step1/'
      },
      'dist-step-2': {
         options: {
           cwd: '<%= dirs.staging %>/step1'
         },
         src: [
           "*",
           "partials/**",
           "**/*.min.*",
           "!lib/angular/angular-*.js",
           "ico/**"
         ],
         dest:  "<%= dirs.staging %>/step2/"
      },
      'dist-step-3': {
         options: {
           cwd: '<%= dirs.staging %>/step2'
         },
         src: [
           "**",
           "!**/*.html"
         ],
         dest:  "<%= dirs.staging %>/step3/"
      },
      'dist-final': {
         options: {
           cwd: '<%= dirs.staging %>/step3'
         },
         src: ["**"],
         dest:  "<%= dirs.dist %>/public/"
      }
    },
    'usemin-handler': {
      options: {
        basePath: '<%= dirs.staging %>/step1'
      },
      html: '*.html'
    },
    imgmin: {
      options: {
        basePath: '<%= dirs.staging %>/step1'
      },
      img: 'img/**'
    },
    usemin: {
      options: {
        basePath: '<%= dirs.staging %>/step2'
      },
      html: ['**/*.html'],
      css: ['**/*.css']
    },
    rev: {
      options: {
        basePath: '<%= dirs.staging %>/step2'
      },
      js: ['js/**/*.js', '!js/vendor/*.js'],
      css: 'css/**/*.css',
      img: 'img/**'
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          cwd: '<%= dirs.staging %>/step2'
        },
        files: {
          '<%= dirs.staging %>/step3/': '**/*.html'
        }
      }
    },
    manifest:{
      dest: '<%= dirs.staging %>/step3/manifest.appcache',
      port: 3002
    },
    testacularServer: {
      // manually open a browser window at http://localhost:4000 
      auto: {
        options: {
          keepalive: true
        },
        browsers: undefined,
        port: 4000,
        autoWatch: true,
        singleRun: false,
        configFile: 'config/testacular.conf.js'
      },
      unit: {
        options: {
          keepalive: true
        },
        configFile: 'config/testacular.conf.js'
      },
      e2e: {
        options: {
          keepalive: true
        },
        configFile: 'config/testacular-e2e.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-usemin');
  grunt.loadNpmTasks('grunt-contrib-rev');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-manifest');
  grunt.loadNpmTasks('grunt-testacular');

  // Default task.
  grunt.registerTask('default', 'dev');
  
  // Build task
  grunt.registerTask('build', [
      /*'jshint',*/ 'clean:dist',
      'copy:dist-step-1', 'compass:dist', 'usemin-handler', 'concat', 'mincss', 'uglify', 'imgmin',
      'copy:dist-step-2', 'rev', 'usemin', 
      'copy:dist-step-3', 'htmlmin:dist', 'server:build', 'manifest',
      'copy:dist-final', 'time'

  ]);
  
  grunt.registerTask('dev', [/*'jshint',*/ 'compass:dev', 'server:dev', 'reload', 'watch']);
  //grunt.registerTask('reload:safe', 'wait:10 reload wait:10');

  grunt.registerTask('dist', ['server:dist']);

  grunt.registerTask('test:auto', ['testacularServer:auto']);
  grunt.registerTask('test:unit', ['testacularServer:unit']);
  grunt.registerTask('test:e2e:dev', ['server:e2e-dev','testacularServer:e2e']);
  grunt.registerTask('test:e2e:dist', ['server:e2e-dist','testacularServer:e2e']);
  grunt.registerTask('test:e2e', ['test:e2e:dev']);
  grunt.registerTask('test', ['test:auto']);
  
  grunt.registerTask('wait', 'Wait for a set amount of time(ms).', function(delay) {
    if (delay) { 
      var done = this.async();
      setTimeout(done, delay ); 
    }
  });

  var now = +new Date();
  grunt.registerTask('time', 'Print sucess status with elapsed time', function() {
    grunt.log.ok('Build success. Done in ' + ((+new Date() - now) / 1000) + 's');
  });

  grunt.renameTask('connect', 'server');
};

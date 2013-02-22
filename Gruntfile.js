/*global require:false, module:false*/

'use strict';

var path = require('path');

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect['static'](path.resolve(point));
};

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
      test: 'app/test'
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
          keepalive: false,
          middleware: function(connect, options) {
            return [
              lrSnippet,
              folderMount(connect, options.base)
              ];
          }
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
      }
    },

    ///////////////////////////////
    //
    // Compass
    //
    ////////////////////////////////

    compass: {
      options: {
        sassDir: '<%= dirs.sass %>',
        raw:  'images_dir = "app/public/img"\n' +
              'http_images_path = "../img"\n' +
              'http_javascripts_path = "../js"\n' +
              'http_stylesheets_path = "."\n'
      },
      dev: {
        options: {
          cssDir: '<%= dirs.root %>/css',
          environment: 'development'
        }
      },
      dist: {
        options: {
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
    regarde: {
      html: {
        files: ['<%= dirs.root %>/**/*.html'],
        tasks: ['livereload'],
        spawn: false
      },
      js: {
        files: ['<%= dirs.root %>/js/**/*.js'],
        tasks: ['jshint:dev', 'livereload', 'wait:100' , 'testacularRun:auto'],
        spawn: false
      },
      compass: {
        files: [ '<%= dirs.sass %>/*.sass' ],
        tasks: [ 'compass:dev', 'livereload'],
        spawn: false
      },
      'test-unit': {
        files: ['<%= dirs.test %>/unit/**/*.js'],
        tasks: ['jshint:dev', 'wait:100' , 'testacularRun:auto'],
        spawn: false
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['wait:100', 'jshint:dev'],
        spawn: false
      }
    },

    jshint: {
      options: {
        jshintrc: './.jshintrc'
      },
      gruntfile: ['Gruntfile.js'],
      js: ['<%= dirs.root %>/js/**/*.js'],
      'test-unit': ['<%= dirs.test %>/unit/**/*.js'],
      'test-e2e': ['<%= dirs.test %>/e2e/**/*.js'],
      dev: {
        /*options: {
          warnOnly: true
        },*/
        src: [ '<%= jshint.gruntfile %>', 
               '<%= jshint.js %>' ,
               "<%= jshint['test-unit'] %>" ]
      },
      build: {
        src: [ '<%= jshint.gruntfile %>', 
               '<%= jshint.js %>' ]
      }
    },

    ///////////////////////////////
    //
    // Test 
    //
    ////////////////////////////////


    testacular: {
      auto: {
        // manually open a browser window at http://localhost:4000 
        // test trigerred by watch task
        options: {
          keepalive: true,
          port: 4000,
          runnerPort: 4001,
          singleRun: false,
          configFile: '<%= dirs.test %>/config/testacular.conf.js'
        }
      },
      unit: {
        options: {
          keepalive: true,
          browsers: ['Chrome'],
          configFile: '<%= dirs.test %>/config/testacular.conf.js'
        }
      },
      e2e: {
        options: {
          keepalive: true,
          browsers: ['Chrome'],
          configFile: '<%= dirs.test %>/config/testacular-e2e.conf.js'
        }
      }
    },
    testacularRun: {
      auto: {
        options: {
          runnerPort: 4001
          //nofail: true
        }
      }
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
         expand: true,
         cwd: '<%= dirs.root %>',
         src: ['**','!css/**'],
         dest: '<%= dirs.staging %>/step1/'
      },
      'dist-step-2': {
         expand: true,
         cwd: '<%= dirs.staging %>/step1',
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
         expand: true,
         cwd: '<%= dirs.staging %>/step2',
         src: [
           "**",
           "!**/*.html"
         ],
         dest:  "<%= dirs.staging %>/step3/"
      },
      'dist-final': {
         expand: true,
         cwd: '<%= dirs.staging %>/step3',
         src: ["**"],
         dest:  "<%= dirs.dist %>/public/"
      }
    },
    'useminPrepare': {
      options: {
        dest: '<%= dirs.staging %>/step2'
      },
      html: '<%= dirs.staging %>/step1/*.html'
    },
    imagemin: {
      dist: {
        expand: true,
        cwd: '<%= dirs.staging %>/step1',
        src: 'img/**',
        dest: '<%= dirs.staging %>/step2/'
      }
    },
    usemin: {
      options: {
        basedir: '<%= dirs.staging %>/step2'
      },
      html: {
        expand:true,
        cwd: '<%= dirs.staging %>/step2',
        src:['**/*.{html,css}']}
    },
    rev: {
      files: {
        expand: true,
        cwd: '<%= dirs.staging %>/step2',
        src: [  'js/**/*.js', '!js/vendor/*.js',
                'css/**/*.css',
                'img/**/*.{png,jpg}']
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: '<%= dirs.staging %>/step2',
        src: '**/*.html',
        dest: '<%= dirs.staging %>/step3/'
      }
    },
    manifest:{
      dest: '<%= dirs.staging %>/step3/manifest.appcache',
      port: 3002
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-manifest');
  grunt.loadNpmTasks('grunt-testacular');

  // Default task.
  grunt.registerTask('default', 'dev');

  // Build task
  grunt.registerTask('build', [
      'jshint:build', 'clean:dist',
      'copy:dist-step-1', 'compass:dist', 'useminPrepare', 'concat', 'cssmin', 'uglify', 
      'copy:dist-step-2', 'imagemin', 'rev', 'usemin',
      'copy:dist-step-3' , 'htmlmin:dist', 'server:build', 'manifest',
      'copy:dist-final', 'time'
  ]);

  grunt.registerTask('dev', ['jshint:dev', 'compass:dev', 'livereload-start' , 'server:dev', 'regarde']);

  grunt.registerTask('dist', ['server:dist']);

  grunt.registerTask('test:auto', ['testacular:auto']);
  grunt.registerTask('test:unit', 
    ['jshint:build', 'jshint:test-unit', 'testacular:unit']);
  grunt.registerTask('test:e2e:dev', 
    ['jshint:build', 'jshint:test-e2e', 'server:e2e-dev','testacular:e2e']);
  grunt.registerTask('test:e2e:dist', ['jshint:test-e2e', 'server:e2e-dist','testacular:e2e']);
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

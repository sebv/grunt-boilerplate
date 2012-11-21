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
      sass: 'app/sass'
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
          port: 3000,
          base: '<%= dirs.dist %>/public',
          keepalive: true
        }
      }
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
          config: '<%= dirs.sass %>/config.rb',
          src: '<%= dirs.sass %>',
          specify: '<%= dirs.sass %>/main.sass',
          dest: '<%= dirs.root %>/css',
          linecomments: true,
          forcecompile: false,
          debugsass: false
      },
      dist: {
          config: '<%= dirs.sass %>/config.rb',
          src: '<%= dirs.sass %>',
          specify: '<%= dirs.sass %>/main.sass',
          dest: '<%= dirs.staging %>/step1/css',
          outputstyle: 'compressed',
          linecomments: false,
          forcecompile: true,
          debugsass: false
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
         dest: '<%= dirs.staging %>/step1/',
         src: ['<%= dirs.root %>/**','!<%= dirs.root %>/css/**']
      },
      'dist-step-2': {
         dest:  "<%= dirs.staging %>/step2/",
         src: [
           "<%= dirs.staging %>/step1/*",
           "<%= dirs.staging %>/step1/partials/**",
           "<%= dirs.staging %>/step1/**/*.min.*",
           "!<%= dirs.staging %>/step1/lib/angular/angular-*.js",
           "<%= dirs.staging %>/step1/ico/**"
         ]
      },
      'dist-step-3': {
         dest:  "<%= dirs.staging %>/step3/",
         src: [
           "<%= dirs.staging %>/step2/**",
           "!<%= dirs.staging %>/step2/**/*.html"
         ]
      },
      'dist-final': {
         dest:  "<%= dirs.dist %>/public/",
         src: ["<%= dirs.staging %>/step3/**"]
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
          collapseWhitespace: true
        },
        files: {
          '<%= dirs.staging %>/step3/': '<%= dirs.staging %>/step2/**/*.html'
        }
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks( 'grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-usemin');
  grunt.loadNpmTasks('grunt-contrib-rev');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-manifest');

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
  
  grunt.registerTask('dev', [/*'jshint',*/ 'compass:dev', 'server:dev', 'reload' , 'watch']);
  //grunt.registerTask('reload:safe', 'wait:10 reload wait:10');

  grunt.registerTask('dist', ['server:dist']);

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

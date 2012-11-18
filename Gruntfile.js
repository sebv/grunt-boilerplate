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
        port: 3000,
        base: '<%= dirs.root %>',
        keepalive: true
      },
      build: {
        port: 3001,
        base: '<%= dirs.staging %>/step2',
        keepalive: false
      },
      dist: {
        port: 3002,
        base: '<%= dirs.dist %>/public',
        keepalive: true
      }
    },
    reload: {
      dev: {
        port: 4000,
        proxy: {
            host: 'localhost',
            port: '3000'
        }
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
      html: {
        files: ['<config:lint.files>','<%= dirs.root %>/*.html'],
        tasks: 'reload'
      },
      compass: {
        files: [ '<%= dirs.sass %>/*.sass' ],
        tasks: [ 'compass:dev', 'reload' ]
      }
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
        globals: {
          require: true
        }
      },
      all: [  'Gruntfile.js', 
                '<%= dirs.root %>/js/**/*.js', 
                '!<%= dirs.root %>/js/vendor/**']
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
           "<%= dirs.staging %>/step1/**/*.min.*"
         ]
      },
      'dist-final': {
         dest:  "<%= dirs.dist %>/public/",
         src: ["<%= dirs.staging %>/step2/**"]
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
      img: 'img/**',
      ico: 'ico/**'
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
      js: 'js/**/*.js',
      css: 'css/**/*.css',
      img: 'img/**',
      ico: 'ico/**'
    },
    // generate application cache manifest
    manifest:{
      dest: '<%= dirs.staging %>/step2/manifest.appcache',
      port: 3001
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
  grunt.loadNpmTasks('grunt-contrib-manifest');

  // Default task.
  grunt.registerTask('default', 'dev');
  
  // Build task
  grunt.registerTask('build', [
      'jshint',
      'clean:dist', 'copy:dist-step-1', 'compass:dist',
      'usemin-handler', 'concat', 'mincss', 'uglify', 'imgmin',
      'copy:dist-step-2', 'rev', 'usemin', 'server:build', 'manifest',
      'copy:dist-final'
  ]);
  
  grunt.registerTask('dev', ['jshint', 'compass:dev', 'reload:dev', 'server:dev', 'watch']);
  //grunt.registerTask('reload:safe', 'wait:10 reload wait:10');

  grunt.registerTask('wait', 'Wait for a set amount of time(ms).', function(delay) {
    if (delay) { 
      var done = this.async();
      setTimeout(done, delay ); 
    }
  });

  grunt.renameTask('connect', 'server');

  //TODO 
  // check grunt-contrib-htmlmin
  //
};

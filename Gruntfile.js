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
    
    ///////////////////////////////
    //
    // Server/Reload
    //
    ////////////////////////////////

    server: {
      port: 3010,
      base: './app/public',
      keepalive: true
    },
    reload: {
        port: 3000,
        proxy: {
            host: 'localhost',
            port: '3010'
        }
    },
    
    ///////////////////////////////
    //
    // Compass
    //
    ////////////////////////////////
    
    compass: {
      dev: {
          config: 'app/sass/config.rb',
          src: 'app/sass',
          specify: 'app/sass/main.sass',
          dest: 'app/public/css',
          linecomments: true,
          forcecompile: false,
          debugsass: false,
      },
      dist: {
          config: 'app/sass/config.rb',
          src: 'app/sass',
          specify: 'app/sass/main.sass',
          dest: 'temp/dist/public/css',
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
    
    lint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      html: {
        files: ['<config:lint.files>','app/public/*.html'],
        tasks: 'reload',
      },
      compass: {
        files: [ 'app/sass/*.sass' ],
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
        browser: true
      },
      globals: {}
    },
    //uglify: {}
    //
    
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
      dist: ['temp/staging','dist'],
    },
    copy: {
      dist: {
        'step-1': {
          files: {
            "temp/staging/": "app/public/**"
          }
        }
      }
    },
    rev: {
      js: 'temp/staging/js/**/*.js',
      css: 'temp/staging/css/**/*.css',
      img: 'temp/staging/img/**'
    },
    'usemin-handler': {
      options: {
        target: 'temp/staging/step1'
      },
      html: 'app/public/index.html',
      //img: 'temp/staging/img/**'
    },
    usemin: {
      html: ['temp/staging/**/*.html'],
      css: ['temp/staging/**/*.css']
    },
    /*

    
    mincss: {
      compress: {
        files: {
          "temp/dist/public/css/main.min.css": ["temp/dist/public/css/main.css"]
        }
      }
    },
    concat: {
      dist: {
        src: [],
        dest: 'temp/staging/js/app.js'
      }
    },
    min: {
      dist: {
        src: [],
        dest: 'temp/dist/js/app.min.js'
      }*/
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks( 'grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-usemin');

  // Default task.
  //grunt.registerTask('default', 'lint qunit concat min');
  
  // Build task
  grunt.registerTask('build', [
      'clean:dist', 'copy:dist:step1',
      //'compass:dist','mincss',
      'usemin-handler','concat','mincss', 'min', 'usemin'
  ]);
  
      grunt.registerTask('develop', 'reload server compass:dev watch');
  //grunt.registerTask('reload:safe', 'wait:10 reload wait:10');

  grunt.registerTask('wait', 'Wait for a set amount of time(ms).', function(delay) {
    if (delay) { 
      var done = this.async();
      setTimeout(done, delay ); 
    }
  });

  //TODO 
  // check grunt-contrib-htmlmin
  //
};

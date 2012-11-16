/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
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
          debugsass: false,
      }
    },
    'usemin-handler': {
       html: 'app/public/index.html'
    },
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },
    mincss: {
      compress: {
        files: {
          "temp/dist/public/css/main.min.css": ["temp/dist/public/css/main.css"]
        }
      }
    },
    lint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: [ 'app/public/js/boot/*.js',
               'app/public/js/*.js',
               'app/public/js/vendor/bootstrap/*.js' ],
        dest: 'temp/dist/js/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'temp/dist/js/<%= pkg.name %>.min.js'
      }
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
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks( 'grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');

  // Default task.
  //grunt.registerTask('default', 'lint qunit concat min');
  
  // Build task
  grunt.registerTask('build', [
      'clean', 
      'compass:dist','mincss',
      'concat','min'
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

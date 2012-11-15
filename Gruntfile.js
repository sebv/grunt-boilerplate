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
          dest: 'app/public/css',
          linecomments: true,
          forcecompile: false,
          debugsass: false,
      },
      prod: {
          config: 'app/sass/config.rb',
          src: 'app/sass',
          dest: 'dist/public/css',
          outputstyle: 'compressed',
          linecomments: false,
          forcecompile: true,
          debugsass: false,
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
        src: ['<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
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

  
  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('dev', 'reload server compass:dev watch');
  //grunt.registerTask('reload:safe', 'wait:10 reload wait:10');

  grunt.registerTask('wait', 'Wait for a set amount of time(ms).', function(delay) {
    if (delay) { 
      var done = this.async();
      setTimeout(done, delay ); 
    }
  });
};

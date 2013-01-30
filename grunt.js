/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-reload');

  grunt.initConfig({
    meta: {
      project: 'Bootstrap-Timepicker',
      version: '0.1.0',
      banner: '/*! <%= meta.project %> v<%= meta.version %> \n' +
        '* http://jdewit.github.com/bootstrap-timepicker \n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> Joris de Wit \n' +
        '* MIT License \n' +
        '*/'
    },
    lint: {
      files: ['js/bootstrap-timepicker.js', 'grunt.js', 'package.json', 'spec/js/*Spec.js']
    },
    less: {
      development: {
        options: {
          paths: ['css']
        },
        files: {
          'css/bootstrap-timepicker.css': 'less/*.less'
        }
      },
      production: {
        options: {
          paths: ['css'],
          yuicompress: true
        },
        files: {
          'css/bootstrap-timepicker.min.css': ['less/*.less']
        }
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>','js/bootstrap-timepicker.js'],
        dest: 'js/bootstrap-timepicker.min.js'
      }
    },
    jshint: {
      options: {
        browser: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        quotmark: true,
        sub: true,
        strict: true,
        trailing: true,
        undef: true,
        unused: true,
        white: false
      },
      globals: {
        jQuery: true,
        $: true,
        expect: true,
        it: true,
        beforeEach: true,
        afterEach: true,
        describe: true,
        loadFixtures: true,
        console: true
      }
    },
    uglify: {},
    watch: {
      master: {
        files: ['spec/js/*Spec.js', 'js/bootstrap-timepicker.js'],
        tasks: ['lint', 'jasmine'],
        options: {
          interrupt: true
        }
      },
      ghPages: {
        files: ['index.html'],
        tasks: ['reload'],
        options: {
          interrupt: true
        }
      }
    },
    jasmine: {
      src : ['spec/js/libs/jquery/jquery.min.js', 'spec/js/libs/bootstrap/js/bootstrap.min.js', 'spec/js/libs/autotype/index.js', 'js/bootstrap-timepicker.js'],
      specs : 'spec/js/*Spec.js',
      helpers : 'spec/js/helpers/*.js',
      timeout : 100,
      phantomjs : {
        'ignore-ssl-errors' : true
      }
    },
    reload: {
        port: 3000,
        proxy: {
            host: 'localhost'
        }
    },
    exec: {
      dump: {
        command: 'grunt lint; grunt min; grunt exec:deleteAssets; grunt less:production;'
      },
      copyAssets: {
        command: 'git checkout gh-pages -q; git checkout master css/bootstrap-timepicker.min.css; git checkout master js/bootstrap-timepicker.min.js;'
      },
      deleteAssets: {
        command: 'rm -rf css/bootstrap-timepicker.css; rm -rf css/bootstrap-timepicker.min.css; rm -rf js/bootstrap-timepicker.min.js;'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'watch:master');
  grunt.registerTask('test', 'jasmine lint');
  grunt.registerTask('dump', 'min less:production');
  grunt.registerTask('copy', 'exec:copyAssets');

};

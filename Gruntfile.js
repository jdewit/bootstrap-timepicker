module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exec');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      project: 'bootstrap-timepicker',
      version: '0.2.3'
    },
    exec: {
      dump: {
        command: 'grunt jshint; grunt uglify; grunt exec:deleteAssets; grunt less:production;'
      },
      copyAssets: {
        command: 'git checkout gh-pages -q; git checkout master css/bootstrap-timepicker.min.css; git checkout master js/bootstrap-timepicker.min.js;'
      },
      deleteAssets: {
        command: 'rm -rf css/bootstrap-timepicker.css; rm -rf css/bootstrap-timepicker.min.css; rm -rf js/bootstrap-timepicker.min.js;'
      }
    },
    jasmine: {
      build: {
        src : ['spec/js/libs/jquery/jquery.min.js', 'spec/js/libs/bootstrap/js/bootstrap.min.js', 'spec/js/libs/autotype/index.js', 'js/bootstrap-timepicker.js'],
        options: {
          specs : 'spec/js/*Spec.js',
          helpers : 'spec/js/helpers/*.js',
          timeout : 100
        }
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
        white: false,
        globals: {
          jQuery: true,
          $: true,
          expect: true,
          it: true,
          beforeEach: true,
          afterEach: true,
          describe: true,
          loadFixtures: true,
          console: true,
          module: true
        }
      },
      files: ['js/bootstrap-timepicker.js', 'Gruntfile.js', 'package.json', 'spec/js/*Spec.js']
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
    uglify: {
      options: {
        banner: '/*! <%= meta.project %> v<%= meta.version %> \n' +
          '* http://jdewit.github.com/bootstrap-timepicker \n' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> Joris de Wit \n' +
          '* MIT License \n' +
          '*/'
      },
      build: {
        src: ['<banner:meta.banner>','js/<%= pkg.name %>.js'],
        dest: 'js/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.registerTask('default', ['jasmine','jshint','uglify','less:production']);
  grunt.registerTask('test', ['jasmine','lint']);
  grunt.registerTask('copy', ['exec:copyAssets']);
};

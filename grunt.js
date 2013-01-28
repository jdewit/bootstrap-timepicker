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
      version: '0.1.0',
      banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://PROJECT_WEBSITE/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'YOUR_NAME; Licensed MIT */'
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
          'css/bootstrap-timepicker.min.css': 'less/*.less'
        }
      }
    },
    min: {
      dist: {
        src: ['js/bootstrap-timepicker.js'],
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
        latedef: true,
        newcap: true,
        noarg: true,
        quotmark: true,
        sub: true,
        strict: true,
        trailing: true,
        undef: true,
        unused: true
      },
      globals: {
        jQuery: true,
        $: true,
        expect: true,
        it: true,
        beforeEach: true,
        afterEach: true,
        describe: true,
        loadFixtures: true
      }
    },
    uglify: {},
    watch: {
      master: {
        files: ['spec/js/*Spec.js', 'js/bootstrap-timepicker.js'],
        tasks: ['jasmine', 'lint'],
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
      src : ['spec/js/libs/jquery/jquery.min.js', 'spec/js/libs/bootstrap/js/bootstrap.min.js', 'js/bootstrap-timepicker.js'],
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
      push: {
        command: 'grunt lint; grunt min; grunt less:production; git add .; git commit -m "update assets"; git push; git checkout gh-pages -q; git checkout master css/bootstrap-timepicker.min.css; git checkout master js/bootstrap-timepicker.min.js; git add .; git commit -m "update assets"; git push'
      },
      test: {
        command: 'bower install; grunt jasmine;'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'watch:master');

};

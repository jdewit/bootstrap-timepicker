/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-exec');
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
      files: ['grunt.js', 'js/*.js']
    },
    qunit: {
      files: ['tests/**/*.html']
    },
    less: {
      development: {
        options: {
          paths: ["css"]
        },
        files: {
          "css/bootstrap-timepicker.css": "less/*.less"
        }
      },
      production: {
        options: {
          paths: ["css"],
          yuicompress: true
        },
        files: {
          "css/bootstrap-timepicker.min.css": "less/*.less"
        }
      }
    },
    min: {
      dist: {
        src: ['js/bootstrap-timepicker.js'],
        dest: 'js/bootstrap-timepicker.min.js'
      }
    },
    watch: {
      files: 'js/bootstrap-timepicker.js',
      tasks: 'lint qunit'
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
      globals: {
        jQuery: true
      }
    },
    uglify: {},
    exec: {
      checkout_ghPages: {
        command: 'git checkout gh-pages -q'
      },
      copy_css: {
        command: 'git checkout master css/bootstrap-timepicker.min.css'
      },
      copy_js: {
        command: 'git checkout master js/bootstrap-timepicker.min.js'
      },
      notify: {
        command: 'echo "on branch gh-pages"'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'min less exec');

};





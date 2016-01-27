'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    jade: {
      debug: {
        options: {
          data: {
            debug: true
          },
          pretty: true
        },
        files: {
          "debug/layout.html": "src/jade/layout.jade",
        }
      },
      release: {
        options: {
          data: {
            debug: false
          },
          pretty: false
        },
        files: {
          "public/index.html": ["src/jade/sub/landing.jade"],
          "public/about.html": ["src/jade/sub/about.jade"],
          "public/projects.html": ["src/jade/sub/projects.jade"]
        },
        compile: {
          expand: true
        }
      },
      directives: {
        options: {
          data: {
            debug: false
          },
          pretty: false
        },
        files: [{
          expand: true,
          cwd: 'dev/jade/directives/',
          src: ['**/*.jade'],
          dest: 'public/directives',
          ext: '.html'
        }],
        compile: {
          expand: true
        }
      }
    },
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'public/static/css/main.css': 'src/sass/main.scss'
            }
        }
    },
    uglify: {
      js: {
        options: {
          preserveComments: false
        },
        files: {
          'public/assets/js/index.min.js': 'public/assets/js/index.js'
        }
      }
    },
    copy: {
      images: {
        files: [
          {expand: true, cwd:'dev/assets/images/', src: ['*'], dest: 'public/assets/img/', filter: 'isFile'},
        ]
      }
    },
    clean: {
      public: ["public/"]
    },
    watch: {
      jade: {
        files: ['**/*.jade'],
        tasks: ['jade'],
        options: {
          spawn: false,
        },
      },
      sass: {
        files: ['**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-ftp-deploy')
  //grunt.task.requires()
  grunt.registerTask('default', ['clean', 'jade', 'sass', 'watch']);

};

/*
# Only concat CSS files
grunt concat:css

# Concat CSS and JS files, but don't do anything else
grunt concat
*/

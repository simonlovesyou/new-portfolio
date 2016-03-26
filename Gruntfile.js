'use strict';
const fs = require('fs');
const dev = process.env.NODE_ENV ? !!process.env.NODE_ENV.match(/dev/) : true;

module.exports = grunt => {

  require('load-grunt-tasks')(grunt);

  let credentials = JSON.parse(fs.readFileSync('ftp-config/server.json', 'utf8'));

  grunt.initConfig({
    jade: {
      debug: {
        options: {
          data: {
            dev: true
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
            dev
          },
          pretty: false
        },
        files: {
          "public/index.html": ["src/jade/sub/landing.jade"],
          "public/about/index.html": ["src/jade/sub/about.jade"],
          "public/projects/index.html": ["src/jade/sub/projects.jade"],
          "public/contact/index.html": ["src/jade/sub/contact.jade"]
        },
        compile: {
          expand: true
        }
      }
    },
    sass: {
        dist: {
          files: [{
            expand: true,
            cwd: 'src/sass/',
            src: ['style.scss'],
            dest: 'public/static/css/',
            ext: '.css'
          }],
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
      "css-vendor": {
        files: [{
          expand: true, 
          cwd:'node_modules/normalize.css/', 
          src: ['normalize.css'], 
          dest: 'public/static/css/', 
          filter: 'isFile'},
          {
          expand: true, 
          cwd:'src/css/vendor', 
          src: ['**.css'], 
          dest: 'public/static/css/', 
          filter: 'isFile'
          }
        ]
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/static/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/static/css/',
          ext: '.min.css'
        }]
      }
    },
    'ftp-deploy': {
      build: {
        auth: {
          host: credentials.SERVER,
          port: credentials.PORT,
          authKey: 'key1'
        },
        src: credentials.SRC,
        dest: credentials.DEST,
        exclusions: ['public/**/.DS_Store']
      }
    },
    clean: {
      public: ["public/"],
      css: ["public/static/css/*.css", "public/static/css/*.map", "!public/static/css/style.min.css"]
    },
    watch: {
      options: {
        spawn: false,
      },
      jade: {
        files: ['**/*.jade'],
        tasks: ['jade'],

      },
      css: {
        files: ['**.*.css'],
        tasks: ['copy']
      },
      sass: {
        files: ['**/*.scss'],
        tasks: ['sass']
      },
      babel: {
        files: ['**/*.js'],
        tasks: ['babel']
      }
    },
  });

  
  grunt.registerTask('dev', ['clean:public', 'jade', 'sass', 'copy', 'cssmin', 'watch']);
  grunt.registerTask('build', ['clean:public', 'jade', 'sass', 'copy', 'cssmin', 'clean:css']);
  grunt.registerTask('deploy', ['ftp-deploy']);
};
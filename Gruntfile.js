'use strict';
const fs = require('fs');
module.exports = grunt => {

  require('load-grunt-tasks')(grunt);

  let credentials = JSON.parse(fs.readFileSync('ftp-config/server.json', 'utf8'));

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
          "public/projects.html": ["src/jade/sub/projects.jade"],
          "public/contact.html": ["src/jade/sub/contact.jade"]
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
      css: {
        files: ['**.*.css'],
        tasks: ['copy'],
        options: {
          spawn: false
        }
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

  grunt.registerTask('default', ['clean', 'jade', 'sass', 'copy', 'watch']);
  grunt.registerTask('deploy', ['ftp-deploy']);
};
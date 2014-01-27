module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    concat: {
      options: { seperator: ';' },
      dist: {
        src: [
          'resources/VisitorAPI.js',
          'resources/AppMeasurement.js',
          'src/omni.js'
        ],
        dest: 'dist/omni.build.js'
      },
      legacy: {
        src: [
          'resources/legacy/s_code.js',
          'src/omni.js'
        ],
        dest: 'dist/omni.build.legacy.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'omni-min.js': ['<%= concat.dist.dest %>']
        }
      },
      legacy: {
        files: {
          'omni-legacy-min.js': ['<%= concat.legacy.dest %>']
        }
      }
    },
    qunit: {
      files: ['tests/*.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('legacy', ['concat:legacy', 'uglify:legacy']);
  grunt.registerTask('new', ['concat:dist', 'uglify:dist']);
  grunt.registerTask('default', ['legacy', 'new', 'qunit']);

};

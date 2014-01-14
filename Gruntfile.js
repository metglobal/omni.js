module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    concat: {
      options: { seperator: ';' },
      dist: {
        src: [
          'resources/VisitorAPI.js',
          'resources/AppMeasurement.js',
          'omni.js'
        ],
        dest: 'dist/omni.build.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'omni-min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['tests/**/*.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['qunit']);

  grunt.registerTask('default', ['test', 'concat', 'uglify']);

};

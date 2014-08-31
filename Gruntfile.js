var globalConfig = {
    images: 'images',
    css: 'css',
    fonts: 'fonts',
    scripts: 'js/libs',
    bower_path: 'bower_components'
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    globalConfig: globalConfig,
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        main: {
            files: [
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/jquery/jquery.min.js', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/jquery/jquery.min.map', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/backbone/backbone.js', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/bootstrap/dist/js/bootstrap.min.js', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/bootstrap/dist/fonts/**', dest: '<%= globalConfig.fonts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/bootstrap/dist/css/*.min.css', dest: '<%= globalConfig.css %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/bootstrap/dist/css/*.css.map', dest: '<%= globalConfig.css %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/eonasdan-bootstrap-datetimepicker/build/js/**', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/eonasdan-bootstrap-datetimepicker/build/css/*.min.css', dest: '<%= globalConfig.css %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/json2/json2.js', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/moment/min/moment-with-locales.min.js', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/requirejs/require.js', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/underscore/underscore-min.js', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' },
                { expand: true, flatten: true, src: '<%= globalConfig.bower_path %>/underscore/underscore-min.map', dest: '<%= globalConfig.scripts %>/', filter: 'isFile' }
            ]
        }
    }
  });

    // Load the plugin that provides the "copy" task.
    //grunt.loadNpmTasks('grunt-contrib-copy');
    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['copy']);
};
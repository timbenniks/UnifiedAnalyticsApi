/*global module:false, grunt:true*/
module.exports = function(grunt)
{
    "use strict";

    grunt.initConfig(
    {
        pkg: '<json:package.json>',

        meta:
        {
            banner:
                '/*!\n'+
                '*	@Class: <%= pkg.title || pkg.name %>\n'+
                '*	@Version: <%= pkg.version %>\n'+
                '*	@Created on: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                '*	@Description: <%= pkg.description %>\n'+
                '*	@Author: <%= pkg.author.name %>\n'+
                ' ---------------------------------------------------------------------------- */'
        },

        concat:
        {
            js:
            {
                src: ['<%= pkg.dirs.js.src %>/*.js'],
                dest: '<%= pkg.dirs.js.dest %>/<%= pkg.name %>-<%= pkg.version %>.js'
            },

            css:
            {
                src: ['<%= pkg.dirs.css.src %>/*.css'],
                dest: '<%= pkg.dirs.css.dest %>/<%= pkg.name %>-<%= pkg.version %>.css'
            }
        },

        min:
        {
            dist:
            {
                src: ['<banner:meta.banner>', '<config:concat.js.dest>'],
                dest: '<%= pkg.dirs.js.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },

        uglify:
        {
            mangle: {toplevel: true},
            squeeze: {dead_code: false},
            codegen: {quote_keys: true}
        }
    });

    grunt.registerTask('default', 'concat min');
};
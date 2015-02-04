'use strict';

var paths = {
    js: ['*.js', 'server/**/*.js', 'public/**/*.js', 'test/**/*.js', '!test/coverage/**', '!public/system/lib/**', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/teacups/public/controllers/d3.v3.min.js'],
    html: ['public/**/views/**', 'server/views/**', 'packages/**/public/**/views/**', 'packages/**/server/views/**'],
    css: ['public/**/css/*.css', '!public/system/lib/**', 'packages/**/public/**/css/*.css']
};

module.exports = function(grunt) {

    //process.env.NODE_ENV = 'production';

    if (process.env.NODE_ENV !== 'production') {
        require('time-grunt')(grunt);
    }

    // Project Configuration
    if (process.env.NODE_ENV === 'production') {
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            assets: grunt.file.readJSON('server/config/assets.json'),
            clean: ['public/build'],                      
            uglify: {
                options: {
                    mangle: false
                },
                production: {
                    files: '<%= assets.js %>'
                }
            },
            cssmin: {
                combine: {
                    files: '<%= assets.css %>'
                }
            }, 
            nodemon: {
                prod: {
                    script: 'server.js',
                    options: {
                        args: [],
                        ignore: ['*.html', 'public/system/**', 'public/auth/**', 'test/coverage/**', 'node_modules/**'],
                        ext: 'js,html,css',
                        delayTime: 1,
                        env: {
                            PORT: require('./server/config/config').port
                        },
                        cwd: __dirname
                    }
                }
            },
            concurrent: {
                tasks: ['nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        });
    } else {
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            assets: grunt.file.readJSON('server/config/assets.json'),
            clean: ['public/build'],
            watch: {
                js: {
                    files: paths.js,
                    tasks: ['jshint'],
                    options: {
                        livereload: true
                    }
                },
                html: {
                    files: paths.html,
                    options: {
                        livereload: true
                    }
                },
                css: {
                    files: paths.css,
                    tasks: ['csslint'],
                    options: {
                        livereload: true
                    }
                }
            },
            jshint: {
                all: {
                    src: paths.js,
                    options: {
                        jshintrc: true
                    }
                }
            },
            uglify: {
                options: {
                    mangle: false
                },
                production: {
                    files: '<%= assets.js %>'
                }
            },
            csslint: {
                options: {
                    csslintrc: '.csslintrc'
                },
                src: paths.css
            },
            cssmin: {
                combine: {
                    files: '<%= assets.css %>'
                }
            },
            nodemon: {
                dev: {
                    script: 'server.js',
                    options: {
                        args: [],
                        ignore: ['*.html', 'public/system/**', 'public/auth/**', 'test/coverage/**', 'node_modules/**'],
                        ext: 'js,html,css',
                        nodeArgs: ['--debug'],
                        delayTime: 1,
                        env: {
                            PORT: require('./server/config/config').port
                        },
                        cwd: __dirname
                    }
                }
            },
            concurrent: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            mochaTest: {
                options: {
                    reporter: 'spec',
                    require: 'server.js'
                },
                src: ['test/mocha/**/*.js', 'packages/**/test/mocha/**/*.js']
            },
            env: {
                test: {
                    NODE_ENV: 'test'
                }
            },
            karma: {
                unit: {
                    configFile: 'test/karma/karma.conf.js'
                }
            }
        });
    }

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['clean','cssmin', 'uglify', 'concurrent']);
    } else {
        grunt.registerTask('default', ['clean', 'jshint', 'csslint', 'concurrent']);
        // Test task.
        // grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
    }    

    // For Heroku users only.
    // Docs: https://github.com/linnovate/mean/wiki/Deploying-on-Heroku
    grunt.registerTask('heroku:production', ['cssmin', 'uglify']);
};

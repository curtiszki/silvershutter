module.exports = function (grunt) {

	// load all grunt tasks using load-grunt-tasks

	/* NOTE: tasks not prefixed with 'grunt' don't get loaded :( */

	require('load-grunt-tasks')(grunt);

	// Load the remaining tasks

	var serveStatic = require('serve-static');	


	// config section START

	grunt.initConfig({

		/*	So here's the drill:
		*	
		*	All this grunt setup does is compile preprocessed languages, ship them to the root
		*	and minify the css/javascript files in the process.
		*
		*	There in a grunt-server that is used to preview the app first before sending it to github.
		*/


		/* This is in ALPHABETICAL order */


		// PREFIX css

		autoprefixer: {

			// prefix for all significantly used browsers and recent editions

			options: {

				browser: ['>1%', 'last 2 versions', 'ie9']
			},

			prefix: {

				files: {
					'_site/styles/main.css': '_site/styles/main.css'
				}
			}

		},

		// This is the preview server.

		// connect-livereload is used to consistently refresh served contents

		connect: {

			options: {

				port: 8080,
				livereload: 35729,
				hostname: 'localhost'
			},

			livereload: {

				options: {

					base: '.',
					keepAlive: true
				}
			}
		},

		// minify all cssnpm

		cssmin: {

			options: {

				keepSpecialComments: 0
			},

			compile: {

				files: {
					'styles/main.min.css':'_site/styles/main.css' 
				}
			}
		},

		// lint the js first...

		jshint: {

			options: {

				// use the jshint file in the root

				jshintrc: true,
				reporter: require('jshint-stylish')
			},

			lint: {

				files: [{

					expand: true,
					src: '_site/scripts'
				}]
			}
		},

		// compile .pug files

		pug: {

			compile: {

				options: {

					pretty: true,
					style: 'expanded',
					debug: false
				},

				files: {

					'index.html': '_site/index.pug'
				}
			}

		},

		// compile .scss files

		sass: {

			options: {

				sourcemap: 'none',
				precision: 6
			},

			compile: {

				files: {

					'_site/styles/main.css': ['_site/styles/*', '!_site/styles/main.css']

				}
			}

		},

		// minify javascript files

		uglify: {

			options: {

				preserveComment: /(?:^!|@(?:license|preserve|cc_on))/,
				screwIE8: true
			},

			// minify all javascript files

			minify: {

				files: [{

					expand: true,
					src: ['*.js'],
					dest: 'scripts',
					ext: '.min.js',
					extDot: 'last'
				}]
			}
		}
	});

	// Config END

	/* Set up some larger tasks using the ones above... */


	// Compile, prefix and then minify to root dir.

	grunt.registerTask('css', function(){

		grunt.log.writeln("Processing css/scss files...");

		grunt.task.run([

			'sass',
			'autoprefixer',
			'cssmin'
		]);
	});

	// Process .pug files

	grunt.registerTask('jade', function(){

		grunt.log.writeln("Processing html/pug files...");

		grunt.task.run([
			'pug'
		]);
	});

	// Lint and minify javascript files.

	grunt.registerTask('javascript', function(){

		grunt.log.writeln("Processing javascript files...");

		grunt.task.run([

			'jshint',
			'uglify'
		]);
	});

	// Merge the watch tasks now that the 'meta' tasks have been created.

	grunt.config.merge({

		watch: {

			js: {

				files: ['_site/scripts/*.js'],
				tasks: ['javascript']
			},

			css: {

				files: ['_site/styles/*.scss'],
				tasks: ['css']
			},

			index: {

				files: ['_site/index.pug'],
				tasks: ['pug']
			},

			livereload: {

				options: {

					livereload: 35729
				},

				files: [

					'_site/index.pug',
					'_site/scripts/*',
					'_site/styles/*'
				]
			}
		},

	concurrent: {

		serve: ['javascript', 'pug', 'css']
	}
	});


	// Tasks for building/serving

	grunt.registerTask('build', function(){
		grunt.task.run([

			'concurrent:serve'
		]);
	});

	grunt.registerTask('serve:watch', function(){

		grunt.task.run([

			'concurrent:serve',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('default', ['watch']);


}

module.exports = function(grunt) {
	grunt.initConfig({

		/*==========  Watch Tasks  ==========*/
		watch: {
			options: {
				nospawn: true,
				livereload: true
			},
			configFiles: {
				files: [ 'Gruntfile.js'],
				options: {
					reload: true
				}
			},
			jst: {
				files: [
					'app/**/*.html'
				],
				tasks: ['jst']
			},
			css: {
				files: 'app/styles/**/*.less',
				tasks: ['less']
			},
			livereload: {
				files: [
					'*.html',
					'app/styles/**/*.css',
					'app/**/*.js',
				]
			}
		},
		less: {
			dist: {
				files: {
					'app/styles/main.css': 'app/styles/main.less'
				},
				options: {
					compress: false,
					sourceMap: true,
					sourceMapFilename: 'app/styles/main.css.map',
					sourceMapURL: 'main.css.map'
				}
			}
		},
		autoprefixer: {
			dist: {
				files: {
					'app/styles/main.css': 'app/styles/main.css'
				}
			}
		},
		jst: {
			compile: {
				files: {
					'build/templates.js': ['app/**/*.html']
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					findNestedDependencies: false,
					baseUrl: 'app',
					mainConfigFile: 'app/main.js',
					include: 'main',
					//name: '../bower_components/almond/almond',
					name: '../bower_components/requirejs/require',
					out: 'build/prod.js',
					optimize : 'none',

					done: function(done, output) {
					var duplicates = require('rjs-build-analysis').duplicates(output);
					
					if (duplicates.length > 0) {
						grunt.log.subhead('Duplicates found in requirejs build:');
						grunt.log.warn(duplicates);
						done(new Error('r.js built duplicate modules, please check the excludes option.'));
					}
					
					done();
					}
				}
			}
		},

		/*==========  Build Tasks  ==========*/
		clean: {
			dist: ['build'],
		},



		fileblocks: {
			options: {
				templates: {
					'js': '<script data-main="./app/main" src="${file}"></script>',
				},
				removeFiles : true
			},
			prod: {
				src: 'index.html',
				blocks: {
					'app': { src: 'build/prod.js' }
				}
			},
			develop: {
				src: 'index.html',
				blocks: {
					'app': { src: 'bower_components/requirejs/require.js' }
				}
			},
		},

	});


	/*==========  Loaded Tasks  ==========*/

	grunt.loadNpmTasks('grunt-requirejs');

	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-contrib-jst');

	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.loadNpmTasks('grunt-file-blocks');

	/*==========  Regitred Tasks  ==========*/

	grunt.registerTask('build', [
		'clean:dist',
		'jst',
		'less',
		'requirejs',
	]);

	grunt.registerTask('dev', ['build', 'fileblocks:develop']);

	grunt.registerTask('release', ['build', 'fileblocks:prod']);


	grunt.registerTask('file', ['fileblocks:prod']);
};

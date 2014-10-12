var path = require('path');

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			assets:  ['www/assets/', 'tmp/assets/']
		},

		less: {
			app: {
				options: {
					paths: ['assets/less'],
					compress: true
				},
				files: {
					'tmp/assets/css/app-frontend.css': 'assets/less/frontend.less',
					'tmp/assets/css/app-backend.css':  'assets/less/backend.less'
				}
			}
		},

		concat: {
			vendor_js_backend: {
				options: {
					separator: '\n;\n'
				},
				src: [
					'assets/vendor/pickadate/lib/compressed/picker.js',
					'assets/vendor/pickadate/lib/compressed/picker.date.js',
					'assets/vendor/pickadate/lib/compressed/picker.time.js',
					'assets/vendor/moment/min/moment.min.js',
					'assets/vendor/bootstrap-growl/jquery.bootstrap-growl.min.js',
					'assets/js/html.sortable.patched.js',      // TODO: minify this manually
					'assets/js/knockout.x-editable.patched.js' // TODO: minify this manually
				],
				dest: 'tmp/assets/js/vendor-backend.js'
			},

			vendor_js_frontend: {
				options: {
					separator: '\n;\n'
				},
				src: [
					'assets/vendor/moment/min/moment.min.js',
				],
				dest: 'tmp/assets/js/vendor-frontend.js'
			},

			i18n_en_us: {
				options: {
					separator: '\n;\n',
					footer: 'var horaroTimeFormat = "H:i a";'
				},
				src: [/* english (US) is built in into all dependencies */],
				dest: 'tmp/assets/js/i18n/en_us.js'
			},

			i18n_de_de: {
				options: {
					separator: '\n;\n',
					footer: 'var horaroTimeFormat = "HH:i !U!h!r";'
				},
				src: [
					'assets/vendor/pickadate/lib/translations/de_DE.js',
					'assets/vendor/moment/locale/de.js'
				],
				dest: 'tmp/assets/js/i18n/de_de.js'
			},

			vendor_css_backend: {
				options: {
					separator: '\n'
				},
				src: [
					'assets/vendor/bootswatch/yeti/bootstrap.min.css',
					'assets/vendor/pickadate/lib/themes/classic.css',
					'assets/vendor/pickadate/lib/themes/classic.date.css',
					'assets/vendor/pickadate/lib/themes/classic.time.css',
				],
				dest: 'tmp/assets/css/vendor-backend.css'
			}
		},

		rig: {
			app_backend: {
				files: {
					'tmp/assets/js/app-backend.js': ['assets/js/backend.js']
				}
			},
			app_frontend: {
				files: {
					'tmp/assets/js/app-frontend.js': ['assets/js/frontend.js']
				}
			}
		},

		cssmin: {
			assets: {
				options: {
					keepSpecialComments: 0
				},
				files: [{
					expand: true,
					cwd: 'tmp/assets/css/',
					src: ['*.css', '!*.min.css'],
					dest: 'www/assets/css/',
					ext: '.min.css'
				}]
			}
		},

		copy: {
			themes: {
				files: [
					{
						expand: true,
						src: ['assets/vendor/bootswatch/*/*.min.css'],
						dest: 'www/assets/css',
						rename: function(dest, src) {
							return path.join(dest, 'theme-' + path.basename(path.dirname(src)) + '.min.css');
						}
					}
				]
			},
			images: {
				files: [
					{
						expand: true,
						src: ['assets/images/**/*'],
						dest: 'www'
					}
				]
			}
		},

		uglify: {
			assets: {
				files: [{
					expand: true,
					cwd: 'tmp/assets/js',
					src: '**/*.js',
					dest: 'www/assets/js',
					ext: '.min.js'
				}]
			}
		},

		filerev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},

			css: {
				src: 'www/assets/css/*.min.css',
				dest: 'www/assets/css'
			},

			js: {
				src: 'www/assets/js/*.js',
				dest: 'www/assets/js'
			},

			images: {
				src: 'www/assets/images/**/*',
				dest: 'www/assets/images'
			},

			i18n: {
				src: 'www/assets/js/i18n/*.js',
				dest: 'www/assets/js/i18n'
			}
		},

		filerev_assets: {
			ship: {
				options: {
					dest: 'tmp/assets.json',
					cwd: 'www/assets/'
				}
			}
		},

		shell: {
			schema: {
				command: 'php vendor/doctrine/orm/bin/doctrine orm:schema-tool:create --dump-sql > resources/schema.sql'
			},
			proxies: {
				command: 'php vendor/doctrine/orm/bin/doctrine orm:generate-proxies'
			},
			entities: {
				command: 'php vendor/doctrine/orm/bin/doctrine orm:generate:entities tmp'
			}
		},

		lineending: {
			schema: {
				files: {
					'resources/schema.sql': ['resources/schema.sql']
				}
			}
		},

		watch: {
			css: {
				files: ['assets/less/*.less'],
				tasks: ['less:app', 'cssmin']
			},
			app: {
				files: ['assets/js/**/*'],
				tasks: ['rig', 'uglify']
			}
		},

		'ftp-deploy': {
			src: {
				auth: {
					host: 'horaro.kabukiman.org',
					port: 21
				},
				src: 'src',
				dest: '/horaro.kabukiman.org/src'
			},
			views: {
				auth: {
					host: 'horaro.kabukiman.org',
					port: 21
				},
				src: 'views',
				dest: '/horaro.kabukiman.org/views'
			},
			assets: {
				auth: {
					host: 'horaro.kabukiman.org',
					port: 21
				},
				src: 'www/assets',
				dest: '/horaro.kabukiman.org/www/assets'
			},
			tmp: {
				auth: {
					host: 'horaro.kabukiman.org',
					port: 21
				},
				src: 'tmp',
				dest: '/horaro.kabukiman.org/tmp',
				exclusions: ['tmp/twig', 'tmp/assets']
			},
			resources: {
				auth: {
					host: 'horaro.kabukiman.org',
					port: 21
				},
				src: 'resources',
				dest: '/horaro.kabukiman.org/resources',
				exclusions: ['resources/config/parameters.yml']
			}
		}
	});

	// load tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-filerev-assets');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-lineending');
	grunt.loadNpmTasks('grunt-rigger');
	grunt.loadNpmTasks('grunt-shell');

	// register custom tasks
	grunt.registerTask('css',      ['less:app', 'concat:vendor_css_backend', 'copy:themes', 'cssmin']);
	grunt.registerTask('js',       ['concat:vendor_js_backend', 'concat:vendor_js_frontend', 'rig', 'i18n', 'uglify']);
	grunt.registerTask('i18n',     ['concat:i18n_en_us', 'concat:i18n_de_de']);
	grunt.registerTask('assets',   ['clean:assets', 'css', 'js', 'copy:images']);
	grunt.registerTask('doctrine', ['shell:schema', 'lineending:schema', 'shell:proxies']);
	grunt.registerTask('version',  ['filerev', 'filerev_assets']);
	grunt.registerTask('ship',     ['clean', 'assets', 'i18n', 'version']);
	grunt.registerTask('default',  ['assets']);
};

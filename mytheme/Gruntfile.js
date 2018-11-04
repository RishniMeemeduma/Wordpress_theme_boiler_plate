module.exports = function( grunt ) {
	'use strict';

	// Load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration
	grunt.initConfig( {
		pkg:		grunt.file.readJSON( 'package.json' ),
		cssmin: {
			all: {
				src: [
					'css/base.css',
					'css/layout.css',
					'css/module.css',
					'css/state.css',
					'css/theme.css',
				],
				dest: 'css/style.min.css',
				ext: '.min.css'
			}
		},
		uglify: {
			all: {
				options: {
					preserveComments: 'some',
					mangle: {
						except: ['jQuery']
					}
				},
				src: [
					'js/main.js',
				],
				dest: 'js/script.min.js',
				mangle: {
					except: ['jQuery']
				}
			}
		},
		md5: {
			options: {
				keepBasename: false,
				afterEach: function (fileChange, options) {
					var type = fileChange.newPath.indexOf('css/') >= 0 ? 'css' : 'js';
					var shortHash = fileChange.newPath.replace(type+'/', '').substr(0,8);
					grunt.file.copy(fileChange.newPath, type+'/'+shortHash+'.min.'+type);
					grunt.log.writeln('File \''+type+'/'+shortHash+'.min.'+type+'\' created.');
					grunt.file.delete(fileChange.newPath);
					grunt.file.delete(fileChange.oldPath);
					grunt.file.write('build/'+type+'build.php', "<?php define('"+type.toUpperCase()+"BUILD', '"+shortHash+"'); ?>");
					grunt.log.writeln('File \'build/'+type+'build.php\' updated.');
				}
			},
			css: {
				files: {
					'css/': 'css/style.min.css'
				}
			},
			js: {
				files: {
					'js/': 'js/script.min.js'
				}
			}
		},
		modernizr: {
			dist: {
				"dest" : "js/libs/modernizr.js",
				"parseFiles": true,
				"crawl": false,
				"customTests": [],
				"tests": [
					"audio",
					"cookies",
					"customevent",
					"eventlistener",
					"exiforientation",
					"fullscreen",
					"hashchange",
					"hiddenscroll",
					"history",
					"json",
					"pointerevents",
					"queryselector",
					"requestanimationframe",
					"svg",
					"touchevents",
					"video",
					"webintents",
					"animation",
					"webgl",
					"audioloop",
					"audiopreload",
					"cssall",
					"cssanimations",
					"backdropfilter",
					"backgroundblendmode",
					"backgroundcliptext",
					"bgpositionshorthand",
					"bgpositionxy",
					[
						"bgrepeatspace",
						"bgrepeatround"
					],
					"backgroundsize",
					"bgsizecover",
					"borderimage",
					"borderradius",
					"boxshadow",
					"boxsizing",
					"csscalc",
					"checked",
					"csschunit",
					"csscolumns",
					"cubicbezierrange",
					"display-runin",
					"displaytable",
					"ellipsis",
					"cssexunit",
					"cssfilters",
					"flexbox",
					"flexboxlegacy",
					"flexboxtweener",
					"flexwrap",
					"fontface",
					"generatedcontent",
					"cssgradients",
					[
						"csshyphens",
						"softhyphens",
						"softhyphensfind"
					],
					"lastchild",
					"cssmask",
					"mediaqueries",
					"multiplebgs",
					"nthchild",
					"opacity",
					"overflowscrolling",
					"csspointerevents",
					"csspositionsticky",
					"csspseudoanimations",
					"csspseudotransitions",
					"cssreflections",
					"cssremunit",
					"rgba",
					"cssscrollbar",
					"siblinggeneral",
					"textshadow",
					"csstransforms",
					"csstransforms3d",
					"preserve3d",
					"csstransitions",
					"cssvhunit",
					"cssvmaxunit",
					"cssvminunit",
					"cssvwunit",
					"wrapflow",
					"classlist",
					"sizes",
					"srcset",
					"lowbandwidth",
					"localstorage",
					"urlparser",
					"videoautoplay",
					"videoloop",
					"videopreload"
				],
				"options": [
					"domPrefixes",
					"prefixes",
					"addTest",
					"atRule",
					"hasEvent",
					"mq",
					"prefixed",
					"prefixedCSS",
					"prefixedCSSValue",
					"testAllProps",
					"testProp",
					"testStyles",
					"html5shiv",
					"setClasses"
				],
				"uglify": false
			}
		},
		clean: {
			css: ['css/*.min.css', 'build/cssbuild.php'],
			js: ['js/*.min.js', 'build/jsbuild.php'],
		}
	});

	// Build task
	grunt.registerTask( 'build-css',	 [ 'clean:css', 'cssmin', 'md5:css' ] );
	grunt.registerTask( 'build-js',	 [ 'clean:js', 'uglify', 'md5:js' ] );
	grunt.registerTask( 'build',	 [ 'build-css', 'build-js' ] );
	grunt.registerTask( 'default', [ 'build' ]);

	grunt.util.linefeed = '\n';
};

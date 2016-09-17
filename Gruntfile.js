module.exports = function (grunt) {

    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //style_sass_path: 'style/sass/',

        style_sass_path: 'src/style/',

        // style_src_path: 'style/src/',

        style_src_path: 'src/style/src/',

        //style_dist_path: 'style/dist/',

        style_dist_path: 'dist/style',

        transport: {
            options:{
                idleading:"",
                alias:'<%= pkg.spm.alias %>',
                paths : ['/'],
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            }
        },
        concat: {
            options:{
                include:'relative',
                paths : ['/']
            },
            merge: {
                files: [
                    {
                        expand: true,
                        cwd: 'script/build/',
                        src: ['**/*.js','!**/*-debug.js','!**/*-debug.css.js','!lib/**/*.js'],
                        dest: 'script/merge/'
                    }
                ]
            }
        },
        clean : ['script/build','script/merge'],
        compass: {
            dist: {
                options: {
                    sassDir: '<%= style_sass_path %>',
                    cssDir: '<%= style_dist_path %>',
                    imageDir: '<%= image_path %>',
                    assetCacheBuster: false, //开启关闭图片后时间戳
                    environment: 'production'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= style_sass_path %>',
                        src: ['**/*.scss', '!*/mod/**/*.scss'],
                        dest: '<%= style_dist_path %>',
                        ext: '.css'
                    }
                ]
            }
        },
        watch: {
            compass: {
                files: ['**/*.scss'],
                tasks: ['compass']
            }
        }
    });

    //提取依赖并设置模块ID
    grunt.loadNpmTasks('grunt-cmd-transport');
    //依赖合并  https://github.com/spmjs/grunt-cmd-concat
    grunt.loadNpmTasks('grunt-cmd-concat');
    //压缩
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //删除临时文件
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['compass','transport','concat','clean']);
    
    grunt.registerTask('script', ['transport','concat','clean']);

}
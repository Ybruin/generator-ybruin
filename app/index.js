var generators = require('yeoman-generator'),
    _ = require('yeoman-generator/node_modules/lodash'),
    glob = require('yeoman-generator/node_modules/glob'),
    chalk = require('yeoman-generator/node_modules/chalk'),
    log = console.log,
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    generatorName = 'gulp';

module.exports = generators.Base.extend({
    constructor: function(){
        generators.Base.apply(this, arguments);

        var dirs = glob.sync('+(src)');
        //now _.contains has been abandoned by lodash,use _.includes
        if(_.includes(dirs, 'src')){
            log(chalk.bold.green('资源已经初始化，退出...'));
            setTimeout(function(){
                process.exit(1);
            }, 200);
        }
    },
    prompting: function(){
        var questions = [
            {
                name: 'projectAssets',
                type: 'list',
                message: '请选择模板:',
                choices: [
                    {
                        name: 'PC模板',
                        value: 'pc',
                        checked: true
                    },{
                        name: 'mobile模板',
                        value: 'mobile'
                    }
                ]
            },
            {
                type: 'input',
                name: 'projectName',
                message: '输入项目名称',
                default: this.appname
            },
            {
                type: 'input',
                name: 'projectAuthor',
                message: '项目开发者',
                store: true,
                default: 'huangxiaoyan'
            },{
                type: 'input',
                name: 'projectVersion',
                message: '项目版本号',
                default: '0.0.1'
            }
        ]
        return this.prompt(questions).then(
            function(answers){
                for(var item in answers){
                    answers.hasOwnProperty(item) && (this[item] = answers[item]);
                }
            }.bind(this));
    },
    writing: function(){
        this.projectOutput = './dist';
        //拷贝文件
        this.directory(this.projectAssets,'src');
        this.copy('components.json', 'src/components.json');
        this.copy('ybruin-conf.js','src/ybruin-conf.js');
        this.copy('package.json', 'package.json');
        //模板
        // this.fs.copyTpl(
        //     this.templatePath(this.projectAssets+'/js/index.js'),
        //     this.destinationPath('src/js/'+this.componentName+'.js'),
        //     {
        //         componentName: this.componentName
        //     }
        // );
    },
    end: function(){
        del(['src/**/.gitignore','src/**/.npmignore','src/js/index.js']);
        // var dirs = glob.sync('+(node_modules)');
        // if(!_.includes(dirs, 'node_modules')){
        //     //创建软连接
        //     this.spawnCommand('ln', ['-s', '/usr/local/lib/node_modules/common-packages/'+generatorName+'/node_modules', 'node_modules']);
        // }
    }
})
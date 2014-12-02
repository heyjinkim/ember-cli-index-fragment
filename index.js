'use strict';
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

module.exports = {
  name: 'lc-addon',
  postBuild: function(result){
    var index = path.join(result.directory, 'index.html');
    var content = fs.readFileSync(index, {encoding: 'utf8'});

    var startHeader = content.indexOf('<!-- fragment:head -->');
    var endHeader = content.indexOf('<!-- /fragment:head -->');
    var pathHeader = path.join(this.project.root, 'dist', 'ember-fragment-head.html');
    if (startHeader >= 0 && endHeader >= 0){
      var contentHeader = content.slice(startHeader, endHeader);
      fs.writeFileSync(pathHeader, contentHeader);
      console.log(chalk.green('\nGenerated ' + pathHeader  + ' successfully.'));
    }else{
      console.log(chalk.red('\nCouldn\'t find ' + pathHeader  + '.'));
    }

    var startBody = content.indexOf('<!-- fragment:body -->');
    var endBody = content.indexOf('<!-- /fragment:body -->');
    var pathBody = path.join(this.project.root, 'dist', 'ember-fragment-body.html');
    if (startBody >= 0 && endBody >= 0){
      var contentBody = content.slice(startBody, endBody);
      fs.writeFileSync(pathBody, contentBody);
      console.log(chalk.green('Generated ' + pathBody  + ' successfully.'));
    }else{
      console.log(chalk.red('Couldn\'t find ' + pathHeader  + '.'));
    }
  }
};

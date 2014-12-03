'use strict';
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

var fragments = [
  {name: 'head', start: '<!-- fragment:head -->', end: '<!-- /fragment:head -->'},
  {name: 'body', start: '<!-- fragment:body -->', end: '<!-- /fragment:body -->'}
];

function warn(msg){
  console.log(chalk.yellow(msg));
}

function error(msg){
  console.log(chalk.red(msg));
}

function success(msg){
  console.log(chalk.green(msg));
}

function hasFragment(content, fragment){
  var start = content.indexOf(fragment.start),
      end   = content.indexOf(fragment.end);

  if (start === -1) {
    warn('Missing fragment start for ' + fragment.name + '. Looked for: ' + fragment.start);
  }

  if (end === -1) {
    warn('Missing fragment end for ' + fragment.name + '. Looked for: ' + fragment.end);
  }

  return start > -1 && end > -1;
}

function readFragment(content, fragment){
  return content.slice(
    content.indexOf(fragment.start) + fragment.start.length,
    content.indexOf(fragment.end) );
}

function writeFragment(html, fragment, root){
  var outputPath = 'dist';
  var indexOfOutput = process.argv.indexOf('--output-path'); 
  if (indexOfOutput > 0){
    outputPath = process.argv[indexOfOutput+1];
  }
  var filePath = path.join(root, outputPath, 'ember-fragment-' + fragment.name + '.html');
  fs.writeFileSync(filePath, html);
  success('Generated ' + filePath + ' successfully.');
}

module.exports = {
  name: 'ember-cli-index-fragment',

  postBuild: function(result){
    var root = this.project.root;
    var index = path.join(result.directory, 'index.html');
    var content = fs.readFileSync(index, {encoding: 'utf8'});

    fragments.forEach(function(fragment){
      if (!hasFragment(content, fragment)) {
        error('Missing fragment ' + fragment.name);
      } else {
        var html = readFragment(content, fragment);
        writeFragment(html, fragment, root);
      }
    });
  }
};

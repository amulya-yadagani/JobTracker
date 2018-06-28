/**
 * Snippet from
 * http://www.bilyachat.com/2017/01/angular-2-build-version.html
 */

var argv = require('yargs').argv;
var replace = require('replace-in-file');
var package = require("../package.json");

var env = argv.env ? argv.env : "prod";
var buildVersion = package.version;

const options = {
    files: `src/environments/environment.${env}.ts`,
    from: /version: '(.*)'/g,
    to: "version: '"+ buildVersion + "'",
    allowEmptyPaths: false,
};

try {
    let changedFiles = replace.sync(options);
    if (changedFiles == 0) {
        //throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
        console.log("Version was not updated");
    }
    console.log('Build version set: ' + buildVersion);
}
catch (error) {
    console.error('Error occurred:', error);
    throw error;
}

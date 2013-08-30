'use strict';

var fs = require('fs'),
    grunt = require('grunt');

exports.githooks = {};

/* Testing is done by matching files generated by the `grunt githooks` calls 
 * to expected files stored in the `test/expected` folder of the project. 
 * Use the following naming conventions:
 *  - name the test tasks `test.<testID>`
 *  - name expected hook `pre-commit.<testID>`
 *  - set `dest` option of your task to `tmp/<testId>`
 */

function addTest(testSuite, testID) {

  testSuite[testID] = function (test) {

    test.expect(2);
    var hookPath = 'tmp/' + testID + '/pre-commit';

    test.ok(fs.statSync(hookPath).mode.toString(8).match(/755$/), 'Should generate hook file with appropriate permissions (755)');

    var expected = grunt.file.read('test/expected/pre-commit.' + testID);
    var actual = grunt.file.read(hookPath);
    test.equal(actual, expected, 'Should create hook with appropriate content');
    test.done();
  };
}

require('../Gruntfile.js');
for (var target in grunt.config.data.githooks) {
  
  var TEST_TARGET = /^test.(.*)$/;
  var match = TEST_TARGET.exec(target);
  if (match) {
    addTest(exports.githooks, match[1]);
  }
}


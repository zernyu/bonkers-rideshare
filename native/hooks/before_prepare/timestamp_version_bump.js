#!/usr/bin/env node

var fs = require("fs"),
    path = require("path");

var rootdir = process.argv[2];
if (rootdir) {
    var replace = function(path, to_replace, replace_with) {
      var data = fs.readFileSync(path, "utf8");
      if (data.indexOf(replace_with) <= -1) {
        var result = data.replace(new RegExp(to_replace, "g"), replace_with);
        fs.writeFileSync(path, result, "utf8");
      }
    };

    var timestamp = (function() {
      var now = new Date();
      var year = now.getUTCFullYear().toString().substring(2, 4);
      var month = ("0" + (now.getUTCMonth() + 1)).slice(-2);
      var day = ("0" + now.getUTCDate()).slice(-2);
      var hours = ("0" + now.getUTCHours()).slice(-2);
      var min = ("0" + now.getUTCMinutes()).slice(-2);
      return year.toString() + month.toString() + day.toString() + hours.toString() + min.toString();
    })();

    var config = rootdir + '/config.xml';
    replace(config, 'android-versionCode=\"[0-9]*\"', 'android-versionCode="' + timestamp + '"');
    replace(config, 'ios-CFBundleVersion=\"[0-9]*\"', 'ios-CFBundleVersion="' + timestamp + '"');
}

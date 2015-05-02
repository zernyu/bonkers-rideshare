#!/usr/bin/env node

var fs = require("fs"),
    path = require("path");

var rootdir = process.argv[2];
if (rootdir) {

  module.exports = function(context) {

    var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util"),
        ConfigParser = context.requireCordovaModule("cordova-lib/src/configparser/ConfigParser"),
        platforms = context.requireCordovaModule("cordova-lib/src/cordova/platforms"),
        projectRoot = cordova_util.isCordova(),
        xml = cordova_util.projectConfig(projectRoot),
        cfg = new ConfigParser(xml);

    var getProjectFile = function(platform, relPath) {
      var platform_path = path.join(projectRoot, "platforms", platform);
      var parser = new platforms[platform].parser(platform_path);
      if (typeof parser.cordovaproj !== "undefined") {
        return path.join(parser.cordovaproj, relPath);
      }
      return path.join(parser.path, relPath);
    };

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

    var updateIOSCFBundleVersion = function() {
      var plist = getProjectFile("ios", cfg.name() + "-Info.plist");
      var shell = require(path.join(projectRoot, "platforms/ios/cordova/node_modules/shelljs"));
      shell.exec("/usr/libexec/PlistBuddy -c \"Set :CFBundleVersion " + timestamp + "\" \"" + plist + "\"");
    };

    var updateAndroidVersionCode = function() {
      var manifest = getProjectFile("android", "AndroidManifest.xml");
      var version_code = "android:versionCode=\"" + timestamp + "\"";
      replace(manifest, "android:versionCode=\"[0-9^\"]*\"", version_code);
    };

    context.opts.platforms.forEach(function(platform) {
      if (platform === "ios") {
        updateIOSCFBundleVersion();
      } else if (platform === "android") {
        updateAndroidVersionCode();
      }
    });

  };

}

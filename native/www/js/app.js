// TODO: check this out for ideas: https://github.com/alevicki/ionic-parse-starter/blob/master/www/js/controllers.js
// TODO: facebook-angular? http://brandid.github.io/parse-angular-demo/#/features/facebookSDK
angular.module('rideshare', [
  'ionic',
  'parse-angular', 'parse-angular.enhance',
  'rideshare.common.models',
  'rideshare.controllers',
  'rideshare.events.controllers'
])
    .run(function ($state, $rootScope, $ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });

      var currentUser = Parse.User.current();
      $rootScope.user = null;
      $rootScope.isLoggedIn = false;

      if (currentUser) {
        $rootScope.user = currentUser;
        $rootScope.isLoggedIn = true;
        $state.go('app');
      }
    })
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'js/common/html/main.html',
            controller: 'AppController'
          })
          .state('app.events', {
            url: '/events',
            views: {
              'content': {
                templateUrl: 'js/events/html/events.html',
                controller: 'EventsController',
                resolve: {
                  events: function () {
                    // get the collection from our data definitions
                    var events = new (Parse.Collection.getClass('Event'));
                    // use the extended Parse SDK to load the whole collection
                    return events.fetch();
                  }
                }
              }
            }
          })
          .state('app.search', {
            url: '/search',
            views: {
              'content': {
                templateUrl: 'templates/search.html'
              }
            }
          })
          .state('app.browse', {
            url: '/browse',
            views: {
              'content': {
                templateUrl: 'templates/browse.html'
              }
            }
          })
          .state('app.playlists', {
            url: '/playlists',
            views: {
              'content': {
                templateUrl: 'templates/playlists.html',
                controller: 'PlaylistsController'
              }
            }
          })
          .state('app.single', {
            url: '/playlists/:playlistId',
            views: {
              'content': {
                templateUrl: 'templates/playlist.html',
                controller: 'PlaylistController'
              }
            }
          });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/events');
    });

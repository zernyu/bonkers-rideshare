angular.module('rideshare.events.controllers', [])
    .controller('EventsController', function ($scope, events) {
        $scope.controller = {
            events: events
        };
    })
;

angular.module('rideshare.events.controllers', [])
    .controller('EventsController', function ($scope) {
        $scope.events = [
            {name: 'Hillsboro-Roubaix', date: new Date()}
        ]
    })
;

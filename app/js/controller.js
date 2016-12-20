(function() {
  'use strict';

 var app = angular.module('transitApp');
    app.controller('mainController', ['$scope', '$http', 'jsonFactory',
      function($scope, $http, jsonFactory) {
        $scope.stops = [];
        $scope.departureStationSelected = false;
        $scope.arrivalStationSelected = false;
        $scope.caltrainData = {};
        jsonFactory.getAll().success(function(data) {
          $scope.caltrainData = data;
          $.each(data.stops, function(i, el) {
            var flag = true;
            $.each($scope.stops, function(index, val) {
              if (val.parent_station === el.parent_station || val.stop_name === el.stop_name) {
                flag = false;
              }
            });
            if (flag) {
              $scope.stops.push(el);
            }
          });

          $scope.routeMap = '/images/map.png';
    
        });

        function toSeconds(time) {
          var t = time.split(':');
          var hour = parseInt(t[0]);
          var minute = parseInt(t[1]);
          var second = parseInt(t[2]);

          return hour * 60 * 60 + minute * 60 + second;
        }

        function getDuration(departure_time, arrival_time) {
          var dTime = toSeconds(departure_time);
          var aTime = toSeconds(arrival_time);
          var duration = (aTime - dTime) / 60;

          return duration.toString() + ' min';
        }

        function getSchedules() {
          $scope.trips = [];
          var departureStationStops = [];
          var arrivalStationStops = [];
          for (var i = 0; i < $scope.caltrainData.stopTimes.length; i++) {
            if (parseInt($scope.caltrainData.stopTimes[i].stop_id) === parseInt($scope.departureStation.stop_id) ||
              parseInt($scope.caltrainData.stopTimes[i].stop_id) === (parseInt($scope.departureStation.stop_id) + 1)) {
              departureStationStops.push($scope.caltrainData.stopTimes[i]);
            }
            if (parseInt($scope.caltrainData.stopTimes[i].stop_id) === parseInt($scope.arrivalStation.stop_id) ||
              parseInt($scope.caltrainData.stopTimes[i].stop_id) === (parseInt($scope.arrivalStation.stop_id) + 1)) {
              arrivalStationStops.push($scope.caltrainData.stopTimes[i]);
            }
          }
          for (var j = 0; j < departureStationStops.length; j++) {
            for (var k = 0; k < arrivalStationStops.length; k++) {
              if (departureStationStops[j].trip_id === arrivalStationStops[k].trip_id &&
                parseInt(departureStationStops[j].stop_sequence) < parseInt(arrivalStationStops[k].stop_sequence)) {
                var departureStation = departureStationStops[j];
                var arrivalStation = arrivalStationStops[k];
                var departureTime = departureStation.departure_time;
                var arrivalTime = arrivalStation.arrival_time;
                var tripId = departureStation.trip_id;
                var routeId = $scope.caltrainData.trips[tripId].route_id;
                var routeName = $scope.caltrainData.routes[routeId].route_long_name;
                var serviceId = $scope.caltrainData.trips[tripId].service_id;
                var totalTripTime = getDuration(departureTime, arrivalTime);

                var timePeriod = '';
                if (serviceId.includes('Weekday')) {
                  timePeriod = 'Weekday';
                } else if (serviceId.includes('Sunday')) {
                  timePeriod = 'Sunday';
                } else if (serviceId.includes('Saturday')) {
                  timePeriod = 'Saturday';
                }
           
                $scope.trips.push({
                  timePeriod: timePeriod,
                  routeName: routeName,
                  departureTime: departureTime,
                  arrivalTime: arrivalTime,
                  totalTripTime: totalTripTime,
                  tripId: tripId
                });
              }
            }
          }

        }

        $scope.getStopsForDepartureStation = function() {
          $scope.departureStationSelected = true;
          if ($scope.arrivalStationSelected === true) {
            getSchedules();
          }
        };
        
        $scope.getStopsForArrivalStation = function() {
          $scope.arrivalStationSelected = true;
          if ($scope.departureStationSelected === true) {
            getSchedules();
          }
        };

      }
    ]);
})();
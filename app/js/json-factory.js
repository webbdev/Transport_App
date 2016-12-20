(function() {
  'use strict';

  angular.module('transitApp')
    .factory('jsonFactory', ['$http', function($http) {
      var factory = {};
      factory.getAll = function() {
        return $http.get('./json/caltrain-data.json');
      };
      
      return factory;
    }]);
})();

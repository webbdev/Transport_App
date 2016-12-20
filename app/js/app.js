(function() {
	'use strict';

	if (navigator.serviceWorker){
  		navigator.serviceWorker.register('./sw.js').then(function(e){
    		console.log('Registration worked');
  		}).catch(function(){
    		console.log('Registration failed');
  		})
	}

	var app = angular.module('transitApp', ['ngRoute']);

		app.config([
			'$routeProvider',
			function($routeProvider) {
				$routeProvider
					.when("/", {
						templateUrl: "/templates/main.htm",
						controller: "mainController"
					})
					.when("/holidayservice", {
		                templateUrl : "/templates/holidayservice.htm"
		            })
		            .when("/pdf", {
		                templateUrl : "/templates/pdf.htm"
		            })
					.otherwise({
						redirectTo: "/"
					});
			}
		]);
})();
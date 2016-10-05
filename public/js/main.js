/**
 * HealthyTrackerUS Module
 *
 */
var app = angular.module('HealthyTrackerUS', []);
app.controller('MainController', ['$scope', '$http', 'CountyService', function($scope, $http, CountyService) {

    initController();

    function initController() {
        // $http.get('api/show').success(function(data) {
        //     $scope.data = data;
        //     console.log(data);
        // })
        CountyService.getAllCounties(function (counties) {
        	console.log(counties);
        	// body...
        });
    }

}])

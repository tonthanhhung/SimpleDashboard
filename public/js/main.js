/**
 * HealthyTrackerUS Module
 *
 */
var app = angular.module('HealthyTrackerUS', []);
app.controller('MainController', ['$scope', '$http', 'StateService', function($scope, $http, StateService) {

    initController();

    function initController() {
        // $http.get('api/show').success(function(data) {
        //     $scope.data = data;
        //     console.log(data);
        // })
        StateService.getAllCountyByState(48, function (data) {
        	console.log(data);
        	// body...
        });
    }

}])

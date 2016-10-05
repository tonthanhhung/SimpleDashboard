/**
 * HealthyTrackerUS Module
 *
 */
var app = angular.module('healthyTrackerUS', []);
app.controller('mainController', ['$scope', '$http', function($scope, $http) {
    $http.get('api/show').success(function(data) {
        $scope.data = data;
        console.debug(data);
    })
}])

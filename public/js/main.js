/**
 * HealthyTrackerUS Module
 *
 */
var app = angular.module('HealthyTrackerUS', []);
app.controller('MainController', ['$scope', '$http', 'StateService', 'HealthRankingService', function($scope, $http, StateService, HealthRankingService) {

    initController();

    function initController() {
        // $http.get('api/show').success(function(data) {
        //     $scope.data = data;
        //     console.log(data);
        // })
        StateService.getAllCountyByState(48, function(data) {
            console.log(data);
            // body...
        });

        HealthRankingService.getCompareHealthRankingCountiesResult(['24_011', '04_005', '04_012', '10_003', '10_005', '24_005'], 2015, 6)
            .success(function(data) {
                console.debug(data)
            });
    }

}])

/**
 * HealthyTrackerUS Module
 *
 */
var app = angular.module('HealthyTrackerUS', []);
app.controller('MainController', ['$scope', '$http', 'StateService', 'HealthRankingService', function($scope, $http, StateService, HealthRankingService) {

    initController();
    var healthyTracker = {
        usAllStates: [],
        selectedState: null,
        selectedCounty: null,
        updateSelectedState: updateSelectedState,
        updateSelectedCounty: updateSelectedCounty,
        measureFactors: {},
        comparingCounties: [],
        addCountyToCompare: addCountyToCompare,
    }
    $scope.healthyTracker = healthyTracker;


    function addCountyToCompare() {
        healthyTracker.comparingCounties.push(healthyTracker.selectedCounty);
        $scope.selectedStateId = -1;
        healthyTracker.selectedState = null;
        healthyTracker.selectedCounty={};
        console.debug("selected compare", healthyTracker.comparingCounties);
    }

    function updateSelectedState(stateId) {
        healthyTracker.selectedState = healthyTracker.usAllStates[+stateId];
        console.log("selectedstate", healthyTracker.selectedState);
    }

    function updateSelectedCounty(countyId) {
        healthyTracker.selectedCounty = healthyTracker.selectedState.counties[countyId];
    }

    function loadAllCoutyForState(states) {
        for (stateId in states) {
            var _state = states[stateId];

            StateService.getAllCountyByState(_state.id).success((function(state) {
                return function(data) {
                    state.counties = data.counties;
                }
            })(_state));
        }
    }

    function loadAllState() {
        StateService.getAllStates().success(function(data) {
            $scope.healthyTracker.usAllStates = data;
            loadAllCoutyForState(data);

        })
    }

    function initController() {
        loadAllState();
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

app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function(a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});

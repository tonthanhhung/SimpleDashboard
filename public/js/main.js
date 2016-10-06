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
        measureFactorsData: [],
        comparingCounties: [],
        addCountyToCompare: addCountyToCompare,
        removeCountyFromCompare: removeCountyFromCompare
    }
    $scope.healthyTracker = healthyTracker;


    function removeCountyFromCompare(county) {
        healthyTracker.comparingCounties.splice(healthyTracker.comparingCounties.indexOf(county), 1);
        updateCompareData();
    }

    function addCountyToCompare() {
        console.debug("healthyTracker.selectedCounty", healthyTracker.selectedCounty);
        if (healthyTracker.selectedCounty) {
            if (healthyTracker.comparingCounties.indexOf(healthyTracker.selectedCounty) == -1) {
                healthyTracker.comparingCounties.push(healthyTracker.selectedCounty);
                updateCompareData();
            }
            console.debug("we will remove the current selected");
            $scope.selectedStateId = -1;
            healthyTracker.selectedState = null;
            healthyTracker.selectedCounty = null;
        }

    }

    function updateCompareData() {
        var countyStateIDs = healthyTracker.comparingCounties.map(function(item) {
                return item.state_fips + "_" + item.county_fips;
            })
            // countyStateIDs (array), month year
        HealthRankingService.getCompareHealthRankingCountiesResult(countyStateIDs, 2015).success(function(data) {
            var _counties = data.counties;
            var newTable = [];
            var measuresTable = [];
            healthyTracker.measureFactors = data.measures;
            console.log('county avail:', _counties);
            for (id in _counties) {
                if (id == "000") continue;
                var _county = _counties[id];
                var _countyMeasure = _county.measures;
                var measuresForCounty = [];
                for (cmid in _countyMeasure) {
                    if (!_countyMeasure[cmid]) {
                        console.error(cmid, _countyMeasure);
                        continue;
                    }
                    if (_countyMeasure[cmid].data != '&nbsp;')
                        measuresForCounty.push((_countyMeasure[cmid].data));
                    else {
                        measuresForCounty.push('')
                    }
                }
                measuresTable.push(measuresForCounty);
            }
            var sortedMeasures = data.measures.sort(function(a, b) {
                return (+a.id) - (+b.id);
            });
            var arrayOfSorredMeasureFactor = sortedMeasures.map(function(item) {
                return item.nameFull;
            })
            if (measuresTable.length != 0) {
                var newMeasureTable = measuresTable[0].map(function(col, i) {
                    return measuresTable.map(function(row) {
                        return row[i];
                    })
                });
                newMeasureTable.map(function(row2, j) {
                    return row2.unshift(arrayOfSorredMeasureFactor[j]);
                });
                healthyTracker.measureFactorsData = newMeasureTable;
            } else {
                healthyTracker.measureFactorsData = [];
            }


        });
    }

    function updateSelectedState(stateId) {
        healthyTracker.selectedState = healthyTracker.usAllStates[+stateId];
        // console.log("selectedstate", healthyTracker.selectedState);
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

app.controller('MainController', ['$scope', '$http', 'StateService', 'HealthRankingService', '$location', '$stateParams', '$state',
    function($scope, $http, StateService, HealthRankingService, $location, $stateParams, $state) {

        /*
        this handles the code of click button 
        healthyTracker.addCountyToCompare()
        */
        function addCountyToCompare() {
            console.debug("healthyTracker.selectedCounty", healthyTracker.selectedCounty);
            if (!healthyTracker.selectedCounty) return;

            // add only new
            if (healthyTracker.comparingCounties.indexOf(healthyTracker.selectedCounty) == -1) {
                healthyTracker.comparingCounties.push(healthyTracker.selectedCounty);
                //healthyTracker.measureFactorsData=updateCompareData(healthyTracker.comparingCounties);
                updateCompareData(healthyTracker.comparingCounties);
            }
            // CODEREVIEW: thsi shell be probaly else
            // CODEREVIEW: +1 for using debug but how do you remove it from production code ?
            console.debug("we will remove the current selected");
            $scope.selectedStateId = -1;
            healthyTracker.selectedState = null;
            healthyTracker.selectedCounty = null;
        }

        function updateCompareData(comparingCounties /* already on screen */ ) {

            HealthRankingService.getCompareHealthRankingCountiesResult({
                countiesFips: comparingCounties.map(buildCountyFips),
                yearToCompare: 2015
            }).success(function(statistics){
                // purpose of function
                healthyTracker.measureFactorsData=calc(statistics);
            });

            // ---------------------------------------
        
            function calc(statistics) {
                // healthyTracker.measureFactorsData 
                var healthyTracker={};
                var _counties = statistics.counties;
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
                return healthyTracker.measureFactorsData;
            }
            function buildCountyFips(county) {
                return county.state_fips + "_" + county.county_fips;
            }
        }

        initController();
        var healthyTracker = {
            usAllStates: [],
            selectedState: null, // or {} of State 
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





        function updateSelectedState(stateId) {
            healthyTracker.selectedState = healthyTracker.usAllStates[+stateId];
            // console.log("selectedstate", healthyTracker.selectedState);
        }

        function updateSelectedCounty(countyId) {
            healthyTracker.selectedCounty = healthyTracker.selectedState.counties[countyId];
        }

        function loadAllCoutyForState(states) {
            for (stateId in states) { //CODEREVIEW: [] shell not be looped wit for in !!! see MDN
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
            console.log($stateParams.comparedCounties);
            loadAllState();
        }

    }
])

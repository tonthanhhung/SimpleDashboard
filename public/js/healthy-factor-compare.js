"use strict";

app.controller('HealthyFactorCompareController', ['$rootScope', '$scope', '$http', '$timeout', 'StateService', 'HealthRankingService', '$location', '$stateParams', '$state',
    function($rootScope, $scope, $http, $timeout, StateService, HealthRankingService, $location, $stateParams, $state) {

        var MSGCOUNTY_EXIST = "The selected county is added in compare!";

        var healthyTracker = {

            addCountyToCompare: addCountyToCompare,
            removeCountyFromCompare: removeCountyFromCompare,
            updateSelectedState: updateSelectedState,
            updateSelectedCounty: updateSelectedCounty,
            factorSelectChange: factorSelectChange,
            visializeChart: visializeChart,

            usAllStates: [],
            selectedFactors: [],
            selectedState: {},
            selectedCounty: {},

            measureFactorsData: [],
            comparingCounties: [],

            isChartView: false,
            selectedFactorType: '',

        }
        $scope.healthyTracker = healthyTracker;


        // @EventHandler (Trigger when 'add County to compare' clicked)
        function addCountyToCompare() {
            $rootScope.isLoading = true;
            // console.debug("healthyTracker.selectedCounty", healthyTracker.selectedCounty);
            if (!healthyTracker.selectedCounty) {
                $rootScope.isLoading = false;
                return;
            }
            // !~healthyTracker.comparingCounties.indexOf(healthyTracker.selectedCounty)
            if (!~indexOfCountyInComparingCounties(healthyTracker.comparingCounties, healthyTracker.selectedCounty)) {
                healthyTracker.comparingCounties.push(healthyTracker.selectedCounty);
                updateCompareData(healthyTracker.comparingCounties.map(buildCountyFips));
            } else {
                showNotification(MSGCOUNTY_EXIST);
                $rootScope.isLoading = false;
            }
        }

        // @EventHanlder (Trigger when 'remove from compare' button clicked)
        function removeCountyFromCompare(county) {
            healthyTracker.comparingCounties.splice(indexOfCountyInComparingCounties(healthyTracker.comparingCounties, county), 1);
            if (healthyTracker.comparingCounties.length != 0)
                $rootScope.isLoading = true;
            updateCompareData(healthyTracker.comparingCounties.map(buildCountyFips));
        }

        // @EventHandler (Trigger when State selector updated)
        function updateSelectedState(stateId) {
            healthyTracker.selectedState = healthyTracker.usAllStates[+stateId];
            if (healthyTracker.selectedState.counties) {
                return;
            }
            StateService.getAllCountyByState(healthyTracker.selectedState.id).success((function(currentState) {
                return function(countiesOfState) {
                    currentState.counties = countiesOfState.counties;
                }
            })(healthyTracker.selectedState));
        }

        // @EventHandler (Trigger when County selector updated)
        function updateSelectedCounty(countyId) {
            healthyTracker.selectedCounty = healthyTracker.selectedState.counties[countyId];
        }

        // @EventHandler (Trigger when check box click)
        function factorSelectChange(factorId) {
            var factor = healthyTracker.measureFactorsData[factorId];
            var selectedFactors = healthyTracker.selectedFactors //alias
            if (factor[0].isSelected) {
                if (!~selectedFactors.indexOf(factorId)) {
                    selectedFactors.push(factorId);
                }
                healthyTracker.selectedFactorType = factor[0].unitType;
            } else {
                if (~selectedFactors.indexOf(factorId)) {
                    selectedFactors.splice(selectedFactors.indexOf(factorId), 1);
                }
                if (selectedFactors.length == 0) {
                    healthyTracker.selectedFactorType = "";
                }
            }
        }

        // @EventHanlder (Trigger when visualize chart click)
        function visializeChart() {
            healthyTracker.isChartView = !healthyTracker.isChartView;
            if (!healthyTracker.isChartView) return;
            healthyTracker.myChartObject = buildChartobject(healthyTracker.measureFactorsData, healthyTracker.selectedFactors);

        }


        function buildChartobject(measureFactorsData, selectedFactors) {
            var templateObj = {
                "type": "LineChart",
                "displayed": false,
                "data": {
                    "cols": [{
                        "id": "month",
                        "label": "Month",
                        "type": "string",
                        "p": {}
                    }, {
                        "id": "laptop-id",
                        "label": "Laptop",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "desktop-id",
                        "label": "Desktop",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "server-id",
                        "label": "Server",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "cost-id",
                        "label": "Shipping",
                        "type": "number"
                    }],
                    "rows": [{
                        "c": [{
                                "v": "January"
                            }, {
                                "v": 19,
                                "f": "42 items"
                            }, {
                                "v": 12,
                                "f": "Ony 12 items"
                            }, {
                                "v": 7,
                                "f": "7 servers"
                            }, {
                                "v": 4
                            },
                            null
                        ]
                    }, {
                        "c": [{
                                "v": "February"
                            }, {
                                "v": 13
                            }, {
                                "v": 1,
                                "f": "1 unit (Out of stock this month)"
                            }, {
                                "v": 12
                            }, {
                                "v": 2
                            },
                            null
                        ]
                    }, {
                        "c": [{
                                "v": "March"
                            }, {
                                "v": 24
                            }, {
                                "v": 5
                            }, {
                                "v": 11
                            }, {
                                "v": 6
                            },
                            null
                        ]
                    }]
                },
                "options": {
                    "title": "Healthy Factor Visualization",
                    "isStacked": "true",
                    "fill": 20,
                    'height': 360,
                    "displayExactValues": true,
                    "vAxis": {
                        "title": "",
                        "gridlines": {
                            "count": 10
                        }
                    },
                    "hAxis": {
                        "title": ""
                    },
                    "tooltip": {
                        "isHtml": false
                    }
                },
                "formatters": {},
                "view": {}
            };
            // Build cols data base on each county
            templateObj.data.cols = [{
                id: "fatorId",
                label: "Healty Factor",
                type: "string"
            }];
            // console.debug("healthyTracker.comparingCounties",healthyTracker.comparingCounties);
            templateObj.data.cols = templateObj.data.cols.concat(healthyTracker.comparingCounties.map(function(county) {
                return {
                    id: county.name + "_" + county.state_abbr,
                    label: county.name + " " + county.state_abbr,
                    type: 'number',
                }
            }));
            console.debug("templateObj.data.cols", templateObj.data.cols);

            templateObj.data.rows = measureFactorsData.filter(function(factor, index) {
                return ~selectedFactors.indexOf(index);
            }).map(function(row) {
                return {
                    c: row.map(function(col) {
                        return {
                            v: col.data ? getNumbeValue(col.data) : col.nameFull,
                            f: col.data ? col.data : col.nameFull
                        }
                    })
                };

            });
            console.debug("templateOb", templateObj);
            return templateObj;
        }


        // Entry point
        initController();

        // Initialize Controller
        function initController() {

            loadAllStates();

            if (!!($state.params.compareIds)) {
                updateCompareData($state.params.compareIds.split('+'), function(compareResult) {
                    healthyTracker.comparingCounties = Object.keys(compareResult.counties).filter(function(key) {
                        return key != "000";
                    }).map(function(countyStateKey) {
                        var county = compareResult.counties[countyStateKey];
                        var abbreviation = healthyTracker.usAllStates ? healthyTracker.usAllStates[+county.state_fips].abbreviation : "";
                        return {
                            name: county.name,
                            state_abbr: abbreviation,
                            state_fips: county.state_fips,
                            county_fips: county.county_fips
                        }
                    })
                });

            }

        }

        function loadAllStates() {
            StateService.getAllStates().success(function(statesById) {
                $scope.healthyTracker.usAllStates = statesById;
            })
        }

        function updateCompareData(countyStateIds, callbackFn) {
            console.debug("countyStateIds", countyStateIds);
            var countyStateIdsJoined = countyStateIds.join("+");

            if ($state.params.compareIds != countyStateIdsJoined) {
                $state.go('.', { compareIds: countyStateIdsJoined }, { notify: false });
            }

            HealthRankingService.getCompareHealthRankingCountiesResult({
                countyStateIds: countyStateIds,
                yearToCompare: 2015
            }).success(function(compareResult) {
                healthyTracker.measureFactors = convertMapObjectToArray(compareResult.measures)
                healthyTracker.measureFactors.sort(function(f1, f2) {
                    return (+f1.id) - (+f2.id);
                })
                var measureValuesByCounty = convertMapObjectToArray(compareResult.counties).filter(function(county) {
                    return !!county.id;
                });

                healthyTracker.measureFactorsData = buildCompareTable(healthyTracker.measureFactors, measureValuesByCounty);
                $timeout(function() {
                    $rootScope.isLoading = false;
                });
                callbackFn && callbackFn(compareResult);
                // console.debug("measureFactorsData",healthyTracker.measureFactorsData);
            });

            function buildCompareTable(measureFactors, measureValuesByCounty) {
                return measureFactors.map(function(factor, index) {
                    factor.isSelected = !!~healthyTracker.selectedFactors.indexOf(index);
                    var factorRow = [factor];
                    var theValues = measureValuesByCounty.map(function(valueFromCounty) {
                        return valueFromCounty.measures[factor.id];
                    });

                    factor.unitType = getTypeOfUnitFromValue(theValues);

                    // console.debug("theValues", theValues);
                    setMaxMinIntoTheValues(theValues);
                    factorRow = factorRow.concat(theValues);

                    return factorRow;
                })
            }

            function getTypeOfUnitFromValue(values) {
                for (var i = values.length - 1; i >= 0; i--) {
                    if (values[i].data == "&nbsp;") continue;
                    return !!~values[i].data.indexOf("%") ? "%" :
                        !!~values[i].data.indexOf("$") ? "$" :
                        !~values[i].data.indexOf(":") ? "N" : 'N/A';
                }
            }



            function setMaxMinIntoTheValues(measureVals) {
                if (!measureVals || !measureVals.length) {
                    return;
                }

                var maxId = 0;
                var minId = 0;
                measureVals.forEach(function(val, index) {
                    if (getNumbeValue(val.data) > getNumbeValue(measureVals[maxId].data)) {
                        maxId = index;
                    }
                    if (getNumbeValue(val.data) < getNumbeValue(measureVals[minId].data)) {
                        minId = index;
                    }
                });

                if (maxId == minId) {
                    return;
                }
                measureVals[maxId].isMax = true;
                measureVals[minId].isMin = true;
            }

            function convertMapObjectToArray(objectsByKey) {
                return Object.keys(objectsByKey).map(function(key) {
                    return objectsByKey[key];
                })
            }


        }



        function showNotification(message) {
            console.info("the selected county is existed !");
            healthyTracker.isAddDuplicate = true;
            $timeout(function() {
                healthyTracker.isAddDuplicate = false;
            }, 2200);
        }

        function getNumbeValue(strNumber) {
            return +(strNumber.replace(/[|&;$%@"<>()+,:]/g, ''));
        }

        function buildCountyFips(county) {
            return county.state_fips + "_" + county.county_fips;
        }

        function indexOfCountyInComparingCounties(comparingCounties, county) {
            return comparingCounties.map(function(county) {
                return county.state_fips.concat(",", county.county_fips);
            }).indexOf(county.state_fips.concat(',', county.county_fips));
        }
    }
])

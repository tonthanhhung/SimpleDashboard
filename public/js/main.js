"use strict";

var app = angular.module('healthyFactorCompare', ["ui.router", "ngRoute", "googlechart"]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.isLoading = false;
    //TODO: Put our initialize for this Angular Web Application here.
}])

app.config(function($stateProvider) {
    $stateProvider
        .state('home', {
            name: 'healthyFactorCompareDefault',
            url: '/home?compareIds',
            templateUrl: '../module/healthy-factor-compare/view/healthy-factor-compare.html'
        });

});

// Custom Filter for HashMap Obect Sorting
app.filter('orderObjectBy', function() {
    return function(itemsById, field, reverse) {
        var reverseFactor = (!reverse) ? 1 : -1;
        var itemsToSort = [];
        // Clone map of objects
        angular.forEach(itemsById, function(item) {
            itemsToSort.push(item);
        });
        itemsToSort.sort(function(a, b) {
            return reverseFactor * (a[field] >= b[field] ? 1 : -1);
        });
        return itemsToSort;
    };
});


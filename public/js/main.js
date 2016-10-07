/**
 * HealthyTrackerUS Module
 *
 */
var app = angular.module('HealthyTrackerUS', ["ui.router", "ngRoute"]);


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

// app.config(function($routeProvider) {
//     $routeProvider
//         .when("/", {
//             templateUrl: "../template/healthyRankingCompare.html",
//             controller: "MainController",
//             reloadOnSearch: false,
//         })
//         .when("/red", {
//             templateUrl: "../template/red.html"
//         });
// });

app.config(function($stateProvider) {


    var healthyRankingCompare = {
        name: 'healthyRankingCompare',
        url: '/healthyRankingCompare/:comparedCounties',
        templateUrl: '../template/healthyRankingCompare.html'
    }

    var healthyRankingCompareDefault = {
        name: 'healthyRankingCompareDefault',
        url: '/healthyRankingCompare',
        templateUrl: '../template/healthyRankingCompare.html'
    }

    var aboutState = {
        name: 'about',
        url: '/about',
        template: '<h3>This is about page</h3>'
    }

    $stateProvider.state(healthyRankingCompare);
    $stateProvider.state(healthyRankingCompareDefault);

    $stateProvider.state(aboutState);
});

app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])
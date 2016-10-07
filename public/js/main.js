/**
 * HealthyTrackerUS Module
 *
 */

var app = angular.module('HealthyTrackerUS', ["ui.router", "ngRoute"]);


app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {

        // CODEREVIEW: how to clone array
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function(a, b) {
            // CODEREVIEW: how to write sort functions ?
            return a[field] > b[field] ? 1 : -1;
        });
        // CODEREVIEW: performance
        if (reverse) filtered.reverse();
        //
        /* CODEREVIEW: elabprate on this
        reverse = reverse ? -1 : 1;
        array.slice().sort(function() {
            return reverse * a[field] > b[field] ? 1 : -1;
        });

        items.clone().sort(reverse?asc:desc);
        items.clone().sort(byField.bind(null,reverse:?-1,1));
        
        function byField(order,a,b){
            return order * a[field] > b[field] ? 1 : -1 ;
        } 
        */

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
    // CODEREVIEW: minor, do I need this to e called 3 times ?
    // no API to set them with one call ?    
    $stateProvider.state({
        name: 'healthyRankingCompare',
        url: '/healthyRankingCompare/:comparedCounties',
        templateUrl: '../template/healthyRankingCompare.html'
    });
    $stateProvider.state({
        name: 'healthyRankingCompareDefault',
        url: '/healthyRankingCompare',
        templateUrl: '../template/healthyRankingCompare.html'
    });
    $stateProvider.state({
        name: 'about',
        url: '/about',
        template: '<h3>This is about page</h3>'
    });
});

app.run(['$route', '$rootScope', '$location', function($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function(path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function() {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])

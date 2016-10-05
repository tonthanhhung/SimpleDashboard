app.factory('StateService', ['$http', function($http) {
    var stateService = {
        getAllStates: getAllStates,
        getAllCountyByState: getAllCountyByState
    };

    function getAllStates() {
        return $http.get('/api/common/states');
    }

    function getAllCountyByState(stateId) {
        return $http.get('/api/common/counties/' + stateId);
    }

    return stateService;
}]);

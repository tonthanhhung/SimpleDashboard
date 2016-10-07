app.factory('StateService', ['$http', function($http) {
    var stateService = {
        getAllStates: getAllStates,
        getAllCountyByState: getAllCountyByState
    };

    // @webservice
    function getAllStates() {
        return $http.get('/api/common/states');
    }

    // @webservice
    function getAllCountyByState(stateId) {
        return $http.get('/api/common/counties/' + stateId);
    }

    return stateService;
}]);

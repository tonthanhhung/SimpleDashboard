app.factory('StateService', ['$http', function($http) {
   var stateService = {
   	getAllStates: getAllStates,
   	getAllCountyByState : getAllCountyByState
   };
   
   function getAllStates(callback) {
   	$http.get('/api/common/states').success(callback);
   }

   function getAllCountyByState(stateId, callback) {
   	$http.get('/api/common/counties/'+stateId).success(callback);
   }
   
   return stateService;
}]); 
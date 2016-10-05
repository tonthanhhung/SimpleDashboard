app.factory('CountyService', ['$http', function($http) {
   var service = {};
   
   service.getAllCounties = function getAllCounties(callback) {
   	$http.get("/api/common/states").success(callback);
   }
   
   return service;
}]); 
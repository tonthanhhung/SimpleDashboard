app.factory('HealthRankingService', ['$http', function($http){
	var healthRankingService = {
		getCompareHealthRankingCountiesResult: getCompareHealthRankingCountiesResult
	};
	function getCompareHealthRankingCountiesResult(countyStateIds, year) {
		var countyStateIdsStr = countyStateIds.join('+');
		console.log("countyStateIdsStr",countyStateIdsStr);
		var url='/api/health/compare/'+year+'?counties='+countyStateIdsStr;
		return $http.get(url);
	}
	return healthRankingService
}])
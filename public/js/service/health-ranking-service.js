app.factory('HealthRankingService', ['$http', function($http){
	var healthRankingService = {
		getCompareHealthRankingCountiesResult: getCompareHealthRankingCountiesResult
	};
	function getCompareHealthRankingCountiesResult(countyStateIds, month, year) {
		var countyStateIdsStr = countyStateIds.join('+');
		var url='/api/health/compare/'+year+'/'+month+'?counties='+countyStateIds;
		return $http.get(url);
	}
	return healthRankingService
}])
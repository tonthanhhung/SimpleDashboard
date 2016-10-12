app.factory('HealthRankingService', ['$http', function($http){
	var healthRankingService = {
		getCompareHealthRankingCountiesResult: getCompareHealthRankingCountiesResult
	};

	// @webservice
	function getCompareHealthRankingCountiesResult(compareOptions) {
		var url='/api/health/compare/'+compareOptions.yearToCompare+'?counties='+compareOptions.countyStateIds.join('+');
		return $http.get(url);
	}
	return healthRankingService;
}])
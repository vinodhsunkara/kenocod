require('./main.js');

angular.module('kenocod').controller('mindmapsCtrl', function($scope, $state, $http) {
    console.log("in mindmapsCtrl");
	$scope.readData = function() {
 		$http({
			url: 'data/qlist.json',
			method: 'GET',
			transformResponse: undefined
		}).then($scope.processData);
 	};
 	$scope.processData = function(response) {
		$scope.qData = JSON.parse(response.data);
		$scope.setQuestionContainer();
	};
	$scope.setQuestionContainer = function() {
		var ansSubmit = Session.get("qSubmit");
		var answeredQuestions = [];
		answeredQuestions.push($scope.qData[ansSubmit]);
		console.log(ansSubmit);
		$scope.answeredQuestions = answeredQuestions;
	};
	$scope.readData();
});
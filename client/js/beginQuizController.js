require('./main.js');

angular.module('kenocod').controller('BeginQuizCtrl', function($scope, $state, $http) {
    console.log("in beginQuizCtrl");
	$scope.qTextNoExists = 0;
	$scope.qText = "First question?";
	$scope.qImgNoExists = 1;
	Session.set("qno", "1");
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
	$scope.selectOnlyThis = function(cbno) {
		$scope.selected = cbno;
	};
	$scope.isChecked = function(cbno) {
		return $scope.selected === cbno;
	};
	$scope.setQuestionContainer = function() {
		var qData = $scope.qData[Session.get("qno")];
		$scope.qTextNoExists = qData["qText"] ? 0 : 1;
		$scope.qText = qData["qText"];
		$scope.qImgNoExists = qData["qImg"] ? 0 : 1;
		$scope.qImg = qData["qImg"];
		$scope.qSolTextNoExists = qData["qSolText"] ? 0 : 1;
		$scope.qSolText = qData["qSolText"];
		$scope.qSolImgNoExists = qData["qSolImg"] ? 0 : 1;
		$scope.qSolImg = qData["qSolImg"];
		
		$scope.ansATextNoExists = qData["ansAText"] ? 0 : 1;
		$scope.ansAText = qData["ansAText"];
		$scope.ansAImgNoExists = qData["ansAImg"] ? 0 : 1;
		$scope.ansAImg = qData["ansAImg"];
		
		$scope.ansBTextNoExists = qData["ansBText"] ? 0 : 1;
		$scope.ansBText = qData["ansBText"];
		$scope.ansBImgNoExists = qData["ansBImg"] ? 0 : 1;
		$scope.ansBImg = qData["ansBImg"];
		
		$scope.ansCTextNoExists = qData["ansCText"] ? 0 : 1;
		$scope.ansCText = qData["ansCText"];
		$scope.ansCImgNoExists = qData["ansCImg"] ? 0 : 1;
		$scope.ansCImg = qData["ansCImg"];
		
		$scope.ansDTextNoExists = qData["ansDText"] ? 0 : 1;
		$scope.ansDText = qData["ansDText"];
		$scope.ansDImgNoExists = qData["ansDImg"] ? 0 : 1;
		$scope.ansDImg = qData["ansDImg"];
	}
	$scope.readData();
	$scope.previousNoExists = function() {
		console.log(parseInt(Session.get("qno")));
		return parseInt(Session.get("qno")) == 1;
	}
	$scope.nextNoExists = function() {
		return parseInt(Session.get("qno")) == 10;
	}
	$scope.submitQuiz = function() {
		console.log("Submit Quiz");
		Session.set("qSubmit", "1");
	}
	$scope.getNext = function() {
		var qno = parseInt(Session.get("qno"));
		Session.set("qno", qno+1);
		$scope.setQuestionContainer();
	}
	$scope.getPrevious = function() {
		var qno = parseInt(Session.get("qno"));
		Session.set("qno", qno-1);
		$scope.setQuestionContainer();
	}
});
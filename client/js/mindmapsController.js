require('./main.js');

import { UserMemMap } from '../../imports/api/UserMemMap';

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
		var userAnsweredQues = UserMemMap.findOne({user_id: Meteor.userId()});
		var answeredQuestions = [];
		if(userAnsweredQues) {
			if(userAnsweredQues.ans_ques_l1 != "") {
				console.log("Level 1 questions are:"+userAnsweredQues.ans_ques_l1);
				var ansQuesL1Arr = userAnsweredQues.ans_ques_l1.split(",");
				ansQuesL1Arr.forEach(function(value) {
					answeredQuestions.push($scope.qData["Level 1"][value]);
				});
			}
			if(userAnsweredQues.ans_ques_l2 != "") {
				console.log("Level 2 questions are:"+userAnsweredQues.ans_ques_l2);
				var ansQuesL2Arr = userAnsweredQues.ans_ques_l2.split(",");
				ansQuesL2Arr.forEach(function(value) {
					answeredQuestions.push($scope.qData["Level 2"][value]);
				});
			}
		}
		$scope.answeredQuestions = answeredQuestions;
	};
	$scope.readData();
});
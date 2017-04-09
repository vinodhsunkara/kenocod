require('./main.js');

import { Scores } from '../../imports/api/Scores';

angular.module('kenocod').controller('scoresCtrl', function($scope, $state, $http) {
    console.log("in scoresCtrl");
	var userId = Meteor.userId();
	var userScores = Scores.find({}, { sort: { 'earn_score': -1 } }).fetch();
	console.log(userScores);
	userScores.forEach(function(scoreEntry) {
		console.log(scoreEntry);
	});
	$scope.scores = userScores;
});
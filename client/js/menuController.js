require('./main.js');

angular.module('kenocod').controller('MenuCtrl', function($scope, $state) {
    console.log("in menuCtrl");
	$scope.isLoggedOut = Meteor.userId() ? 0 : 1;
	console.log($scope.isLoggedOut);
	$scope.levels = ["Level 1", "Level 2"];
	
	$scope.selectedLevel = "Level 1";
	Session.set("level", $scope.selectedLevel);
	
	$scope.saveLevel = function() {
		Session.set("level", $scope.selectedLevel);
	}
});
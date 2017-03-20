require('./main.js');

angular.module('kenocod').controller('MenuCtrl', function($scope, $state) {
    console.log("in menuCtrl");
	$scope.isLoggedOut = Meteor.userId() ? 0 : 1;
	console.log($scope.isLoggedOut);
});
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Template } from 'meteor/templating';

var myApp = angular.module('kenocod', [
    angularMeteor, uiRouter, 'accounts.ui'
]);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	var homeState = {

        name: 'home',
        url: '/home',
        views: {
            menu: {
                templateUrl: 'client/html/menu.html',
				controller: 'MenuCtrl'
            },
            content: {
                templateUrl: 'client/html/home.html',
                controller: 'HomeCtrl'
            }
        },

    }
	var beginQuizState = {

        name: 'quiz',
        url: '/quiz',
        views: {
            content: {
                templateUrl: 'client/html/beginquiz.html',
                controller: 'BeginQuizCtrl'
            }
        },

    }
	var mindmapsState = {

        name: 'mindmaps',
        url: '/mindmaps',
        views: {
            content: {
                templateUrl: 'client/html/mindmaps.html',
                controller: 'mindmapsCtrl'
            }
        },

    }
	$stateProvider.state(homeState);
	$stateProvider.state(beginQuizState);
	$stateProvider.state(mindmapsState);
    $urlRouterProvider.otherwise('/home');

}
]);

function onReady() {
    angular.bootstrap(document, ['kenocod']);
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}
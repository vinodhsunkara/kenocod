require('./main.js');

import { UserMemMap } from '../../imports/api/UserMemMap';

import { Scores } from '../../imports/api/Scores';

angular.module('kenocod').controller('BeginQuizCtrl', function($scope, $state, $http) {
    console.log("in beginQuizCtrl");
	console.log(UserMemMap.find({}));
	Session.set("qno", "1");
	$scope.qans = {};
	$scope.level = Session.get("level");
	console.log($scope.level);
	Session.set('fbk', '2');
	$scope.readData = function() {
 		$http({
			url: 'data/qlist.json',
			method: 'GET',
			transformResponse: undefined
		}).then($scope.processData);
 	}
 	$scope.processData = function(response) {
		$scope.qData = JSON.parse(response.data);
		$scope.setQuestionContainer();
	}
	$scope.selectOnlyThis = function(cbno) {
		if($scope.oneans === "true") {
			$scope.selected = cbno;
		}
	}
	$scope.isChecked = function(cbno) {
		if($scope.oneans === "true") {
			return $scope.selected === cbno;
		}
	}
	$scope.initData = function() {
		$scope.oneans = "false";
		$scope.selected = -1;
		var checkBoxElements = document.getElementsByClassName("anscheckbox");
		for(var i=0;i<checkBoxElements.length;i++) {
			checkBoxElements[i].checked = false;
		}
	}
	$scope.initData();
	$scope.readData();
	$scope.setQuestionContainer = function() {
		$scope.initData();
		var qData = $scope.qData[$scope.level][Session.get("qno")];
		$scope.oneans = qData["oneans"];
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
	$scope.previousNoExists = function() {
		console.log(parseInt(Session.get("qno")));
		return parseInt(Session.get("qno")) == 1;
	}
	$scope.nextNoExists = function() {
		return parseInt(Session.get("qno")) == 2;
	}
	$scope.submitNoExists = function() {
		return parseInt(Session.get("qno")) != 2;
	}
	$scope.feedbackNoExist = function() {
		return parseInt(Session.get("fbk")) != 1;
	}
	$scope.updateUserAnsweredQues = function(ansQues) {
		var userId = Meteor.userId();
		var userAnsweredQues = UserMemMap.findOne({user_id: userId});
		var level = $scope.level;
		console.log("user id is: "+userId);
        console.log("ans ques list is: "+ansQues);
        if(!userAnsweredQues) {
			var objInsert = {};
			if(level == "Level 1") {
				objInsert = {user_id: userId, ans_ques_l1: ansQues, ans_ques_l2: ""};
			} else if (level == "Level 2") {
				objInsert = {user_id: userId, ans_ques_l1: "", ans_ques_l2: ansQues};
			}
            UserMemMap.insert(
                objInsert,
				function(error, id) {
                   if (error) {
                      console.log('Insert of user answered question list failed: ' + userId);
                      console.log('Error: ' + error);
                   } else {
                      console.log('Successfully inserted user answered question list');
                   }
                }
            );
        } 
        else
        {
			console.log(userAnsweredQues);
			var oldAnsweredQuesStr = "";
			var objUpdate = {};
			if(level == "Level 1" && userAnsweredQues.ans_ques_l1 != "") {
				oldAnsweredQuesStr = userAnsweredQues.ans_ques_l1;
			}
			if(level == "Level 2" && userAnsweredQues.ans_ques_l2 != "") {
				oldAnsweredQuesStr = userAnsweredQues.ans_ques_l2;
			}
			if(oldAnsweredQuesStr != "") {
				var oldAnsQuesSet = new Set(oldAnsweredQuesStr.split(","));
				var newAnsQuesSet = new Set(ansQues.split(","));
				newAnsQuesSet.forEach(function(value) {
					oldAnsQuesSet.add(value);
				});
				console.log(oldAnsQuesSet);
				var ansQuesUpdated = Array.from(oldAnsQuesSet).join(",");
				console.log("Updated with ansques set:"+ansQuesUpdated);
				if(level == "Level 1") {
					objUpdate = {ans_ques_l1: ansQuesUpdated};
				} else if(level == "Level 2") {
					objUpdate = {ans_ques_l2: ansQuesUpdated};
				}
			}
			
            UserMemMap.update(
                {_id: userAnsweredQues._id},
                {$set: objUpdate},
                function(error, id) {
                  if (error) {
                      console.log('Update of user answered question list failed: ' + userId);
                      console.log('Error: ' + error);
                  } else {
                      console.log('Successfully updated user answered question list with _id: ' + userAnsweredQues._id);
                  }
                }
            );
        }
	}
	$scope.updateUserScores = function() {
		var ansQues = Object.keys($scope.qans);
		count = 0;
		$scope.feedbacks = [];
		ansQues.forEach(function(key) {
			var feedbackObj = {'status':'incorrect', 'submitted answer': $scope.qans[key], 'correct answer': $scope.qData[$scope.level][key]["qRightAns"]};
			if($scope.qans[key] == $scope.qData[$scope.level][key]["qRightAns"]) {
				count++;
				feedbackObj.status = 'correct';
			}
			$scope.feedbacks.push(feedbackObj);
		});
		Session.set('fbk', '1');
		var time = new Date();
		var userName =Meteor.user().username;
		time = time.toString();
		var score = count+"/"+ansQues.length;
		$scope.score = score;
		console.log("Score for this round is: "+score+"; Date: "+time);
		var scoreEntry = Scores.findOne({user_name: userName});
		if(!scoreEntry) {
			Scores.insert(
				{user_name:userName, earn_score: count, part_score: ansQues.length},
				function(error, id) {
					if (error) {
						console.log('Insertion of scores failed: ' + userName);
						console.log('Error: ' + error);
					} else {
						console.log('Successfully inserted user scores');
					}
				}
			);
		} else {
			Scores.update(
                {_id: scoreEntry._id},
                {$set: {earn_score:scoreEntry.earn_score+count, part_score:scoreEntry.part_score+ansQues.length}},
                function(error, id) {
                  if (error) {
                      console.log('Update of user score failed: ' + userName);
                      console.log('Error: ' + error);
                  } else {
                      console.log('Successfully updated user score with _id: ' + scoreEntry._id);
                  }
                }
            );
		}
	}
	$scope.submitQuiz = function() {
		console.log("Submit Quiz");
		var qno = parseInt(Session.get("qno"));
		var saved = $scope.saveCheckedAnswers(qno);
		if(saved) {
			// Write the userid and answered questions to UserMemMap collection
			var ansQues = Object.keys($scope.qans);
			ansQues = ansQues.join(',');
			$scope.updateUserAnsweredQues(ansQues);
			$scope.updateUserScores();
		}
	}
	$scope.getNext = function() {
		var qno = parseInt(Session.get("qno"));
		// Save the checked answers
		var saved = $scope.saveCheckedAnswers(qno);
		if(saved) {
			Session.set("qno", qno+1);
			$scope.setQuestionContainer();
		}
	}
	$scope.saveCheckedAnswers = function(qno) {
		// Save the checked answers
		var checkedOptions = "";
		var checkBoxElements = document.getElementsByClassName("anscheckbox");
		var len = checkBoxElements.length;
		for(var i=0;i<len;i++) {
			if(checkBoxElements[i].checked) {
				checkedOptions  = checkedOptions + checkBoxElements[i].name + ",";
			}
		}
		if(checkedOptions === "") {
			alert("Choose at least one of the answer choices");
			return 0;
		}
		checkedOptions = checkedOptions.slice(0,-1);
		$scope.qans[qno] = checkedOptions;
		console.log($scope.qans);
		return 1;
	}
	$scope.getPrevious = function() {
		var qno = parseInt(Session.get("qno"));
		var saved = $scope.saveCheckedAnswers(qno);
		if(saved) {
			Session.set("qno", qno-1);
			$scope.setQuestionContainer();
		}
	}
});
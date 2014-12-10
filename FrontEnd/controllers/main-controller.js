
//Define an angular module for our app
var app = angular.module("languageApp", ["ngRoute"])
 

app.factory('myFactory', function($http){
	
	var instance = {};
	var languages = {};
	$http.get('http://operationlanguagerescue.com:8080/selectall/languages')
        .success(function(data){
            languages.listed = data.json;
        }).error(function()
        {
			alert('failure');
            console.error('failed to retrieve data');
        });
	
	languages.listed = [
		{
			language_name: "Hiligaynon",
			numEntries: 11
		},
		{
			language_name: "Aklanon",
			numEntries: 197
		},
		{
			language_name: "Karay-a",
			numEntries: 233
		},
		{
			language_name: "Samoan",
			numEntries: 244
		},
		{
			language_name: "Tongan",
			numEntries: 756
		},
		{
			language_name: "Navajo",
			numEntries: 43
		},
		{
			language_name: "Ilokano",
			numEntries: 56
		},
		{
			language_name: "Ati",
			numEntries: 23
		},
		{
			language_name: "Maori",
			numEntries: 87
		},
		{
			language_name: "Rotuman",
			numEntries: 57
		},
		{
			language_name: "Fijian",
			numEntries: 398
		}
	];
	
	
	
	
	
	var entries = {};
	entries.listed = [
		{
			entry: "Kumusta",
			definitions: [
			"Hello",
			"How are you?",
			"How is it?"
			],
			type: "Greeting"
		},
		{
			entry: "Kumusta ka?",
			definitions: [
			"How are you?"
			],
			type: "Greeting"
		},
		{
			entry: "Oy",
			definitions: [
			"Hey"
			],
			type: "Interjection"
		},
		{
			entry: "Maayo",
			definitions: [
			"Good",
			"Well",
			"Great"
			],
			type: "Adjective"
		},
		{
			entry: "Maayong aga",
			definitions: [
			"Good Morning"
			],
			type: "Greeting"
		},
		{
			entry: "Maayong udto",
			definitions: [
			"Good noon"
			],
			type: "Greeting"
		},
		{
			entry: "Maayong gab-i",
			definitions: [
			"Good evening"
			],
			type: "Greeting"
		},
		{
			entry: "Karabao",
			definitions: [
			"Water buffalo"
			],
			type: "Noun"
		},
		{
			entry: "hatag",
			definitions: [
			"give"
			],
			type: "Verb"
		},
		{
			entry: "Diin ka magkadto?",
			definitions: [
			"Where are you going?"
			],
			type: "Greeting"
		},
		{
			entry: "Diin ka naghalin?",
			definitions: [
			"Where are you coming from?"
			],
			type: "Greeting"
		}
	];
	
	instance.entries = entries;
	
	
	instance.languages = languages;

	return instance;
}) 
 
 
app.config(function($routeProvider) {
    $routeProvider.when('/ChooseQuiz', {
        templateUrl: 'views/choose_quiz.html',
        controller: 'MainController'
      }).when('/PreQuiz', {
        templateUrl: 'views/pre_quiz.html',
        controller: 'MainController'
    }).when('/Quiz', {
        templateUrl: 'views/quiz.html',
        controller: 'MainController'
      }).when('/Results', {
        templateUrl: 'views/results.html',
        controller: 'MainController'
    }).
	  otherwise({
        redirectTo: '/ChooseQuiz'
      })
})
 
 

app.controller('MainController', 
	
function($scope, $http, myFactory) {
  	$scope.languages = myFactory.languages;
	$scope.entries = myFactory.entries;
	$scope.view = "loginView";
	$scope.selectedLanguage = $scope.languages.listed[0];
	$scope.selectedEntry = $scope.entries.listed[0];

	$scope.user = {};
	$scope.password = null;
	$scope.newUser = null;
	$scope.newPassword = null;
	$scope.confirmPassword = null;
	$scope.email = null;
	$scope.entryTerm = "";
	$scope.entryDefinition = "";
	
	$scope.getAllLanguages = function()
	{
		$http.get('http://operationlanguagerescue.com:8080/selectall/languages')
			.success(function(data){
				myFactory.languages.listed = data.json;
	            $scope.languages = myFactory.languages;
			}).error(function()
			{
				alert('failure');
				console.error('failed to retrieve data');
			});
	}
	
	$scope.setSelectedLanguage = function(l)
	{
		console.log(l);
		$scope.selectedLanguage = l;	
		$http.get('http://operationlanguagerescue.com:8080/selectwhere/entries/language_id/'+l.id)
        .success(function(data){
			myFactory.entries.listed = data.json;		
            $scope.entries = myFactory.entries;
			$scope.selectedEntry = $scope.entries.listed[0];

			//alert('success');
			//alert(data);
        }).error(function()
        {
			alert('failure');
            console.error('failed to retrieve data');
        });
		
		
		$scope.view = "mainView";
		$scope.editing = false;
	}
	
	$scope.setSelectedEntry = function(e)
	{
		$scope.selectedEntry = e;
		$scope.editing = false;
	}
	
	$scope.startEditing = function()
	{
		//$scope.contribution = $scope.selectedEntry.definition;
		$scope.editing = true;
		$scope.adding = false;
	}
	
	$scope.startAdding = function()
	{
		$scope.view = "addingEntryView";
		$scope.newEntry = "temp";
		//$scope.contribution = $scope.selectedEntry.definition;
		$scope.adding = true;
		$scope.editing = false;

	}
	
	$scope.contribute = function()
	{
		alert($scope.contribution);
		$scope.editing = false;
		$scope.adding = false;

	}
	
	$scope.contributeEntry = function()
	{
		if ($scope.entryTerm == '')
		{
			alert("please enter a term");
		}
		else if ($scope.entryDefinition == '')
		{
			alert("please enter a definition");
		}
		else
		{
			// CHECK IF ENTRY ALREADY EXISTS IN CURRENT LANGUAGE
			$http.get('http://operationlanguagerescue.com:8080/check/entries/term/'+$scope.entryTerm)
			.success(function(data){
				//var exists = data.exists;
				var exists = false;
				for (var i = 0; i < data.json.length; i++)
				{
					if (data.json[i].language_id == $scope.selectedLanguage.id)
					{
						exists = true;
					}
				}
				if (exists)
				{
					alert("That entry already exists in the current language");
					return;
				}
				else
				{
					// INSERT ENTRY INTO CURRENT LANGUAGE
					$http.post('http://operationlanguagerescue.com:8080/insert/entries', 
					{language_id: $scope.selectedLanguage.id,
					 term: $scope.entryTerm,
					 definition: $scope.entryDefinition,
					 first_contributed_user: $scope.user.username
					 }).
					  success(function(data, status, headers, config) {
							$scope.setSelectedLanguage($scope.selectedLanguage);
							alert("Successfully added entry to database!");
							$scope.view = "mainView";
							$scope.adding = false;
							$scope.editing = false;
							$scope.resetInput();
							$scope.user.contributions++
					  }).
					  error(function(data, status, headers, config) {
							alert("Failed to add entry to database.");
					  });
				}
			}).error(function()
			{
				alert('failure');
				console.error('failed to retrieve whether language already exists');
			});			
		}
	}
	
	$scope.createLanguage = function()
	{
		$scope.view = "addingLanguageView";
	}
	
	$scope.addLanguage = function()
	{
		if ($scope.languageBeingAdded == '')
		{
			alert("please enter a name for the language");
		}
		else
		{
			// CHECK IF LANGUAGE ALREADY EXISTS IN CURRENT LANGUAGE
			$http.get('http://operationlanguagerescue.com:8080/check/languages/language_name/'+$scope.languageBeingAdded)
			.success(function(data){
				var exists = data.exists;
				if (exists)
				{
					alert("That language already exists in the database");
					return;
				}
				else
				{
					// INSERT LANGUAGE INTO DATABASE
					$http.post('http://operationlanguagerescue.com:8080/insert/languages', 
					{language_name: $scope.languageBeingAdded
					 }).
					  success(function(data, status, headers, config) {
							$scope.getAllLanguages();
							alert("Successfully added language to database!");
							$scope.view = "choosingLanguageView";
							$scope.resetInput();
					  }).
					  error(function(data, status, headers, config) {
							alert("Failed to add language to database.");
					  });
				}
			}).error(function()
			{
				alert('failure');
				console.error('failed to retrieve whether language already exists');
			});			
		}
	}

	$scope.showGoal = function()
	{
		alert("To save languages.");
	}

	$scope.cancel = function()
	{
		$scope.editing = false;
		$scope.adding = false;
		$scope.view = "mainView";
	}

	$scope.cancelCreate = function()
	{
		$scope.resetInput();
		$scope.view = "loginView";
	}

	$scope.createAccount = function()
	{
		$scope.resetInput();
		$scope.view = "createView";
		
	}

	$scope.addUser = function()
	{
		if ($scope.newUser == null)
		{
			alert("Username is invalid!");
			return;
		}

		//This should ping the server to check name availability
		$http.get('http://operationlanguagerescue.com:8080/check/users/username/'+$scope.newUser)
		.success(function(data){
			var exists = data.exists;
			if (exists)
			{
				alert("That username already exists");
				return;
			}		
		}).error(function()
		{
			alert('failure');
			console.error('failed to retrieve whether username already exists');
		});

		if ($scope.email == null)
		{
			alert("Email is invalid!");
			return;
		}

		if ($scope.newPassword == null)
		{
			alert("Password is invalid!");
			return;
		}

		if ($scope.newPassword == $scope.confirmPassword) {

			//This should hit the server to add the new User to database
					
			$http.post('http://operationlanguagerescue.com:8080/insert/users', 
			{username:$scope.newUser,
			 password:$scope.newPassword,
			 email:$scope.email,
			 contributions:0,
			 abuse_strikes:0,
			 edits:0
			 }).
			  success(function(data, status, headers, config) {
					alert("Created new User!\n\nPlease contribute responsibly.");
					$scope.view = "mainView";
					$scope.user.username = $scope.newUser;
					$scope.resetInput();
					$scope.user.contributions = 0;
			  }).
			  error(function(data, status, headers, config) {
					alert("Failed to create new user.");
			  });
	
		}
        else
        	alert("Passwords do not match!");

	}

	$scope.login = function()
	{
		//This is where a call to the server then database should be made
		$http.get('http://operationlanguagerescue.com:8080/login/'+$scope.user.username+'/'+$scope.user.password)
		.success(function(data){
			var valid_username = data.valid_username;
			var valid_password = data.valid_password;
			
			if (!valid_username)
			{
				alert('username doesn\'t exist');
				return;
			}
			else if (valid_username && !valid_password)
			{
				alert("incorrect password for user " + $scope.user.username);
				return;
			}
			else if (valid_username && valid_password)
			{
				$scope.view = "mainView";
				alert("Login Successful");
				$scope.user = data.user;
				$scope.setSelectedLanguage($scope.languages.listed[0]);
				$scope.resetInput();
				return;
			}
		}).error(function()
		{
			alert('failure');
			console.error('failed to retrieve whether username already exists');
		});
	}

	$scope.logout = function()
	{
		$scope.resetInput();
		$scope.view = "loginView";
	}

	$scope.nologin = function()
	{

		$scope.resetInput();
		$scope.setSelectedLanguage($scope.languages.listed[0]);
		$scope.user = {};
		$scope.user.username = "Guest";
		$scope.view = "mainView";
	}
	
	$scope.chooseLanguage = function()
	{
		$scope.view = "choosingLanguageView";
	}

	$scope.resetInput = function()
	{
		$scope.password = null;
		$scope.newUser = null;
		$scope.newPassword = null;
		$scope.confirmPassword = null;
		$scope.email = null;
		$scope.entryTerm = null;
		$scope.entryDefinition = null;
		$scope.currentEntry = null;
	}


});

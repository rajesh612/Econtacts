var contactsApp = angular.module('contactsApp',['ui.bootstrap']);

contactsApp.controller('AppCtrl',function($scope, $http) {
	console.log("This is a Message from Controller");
 

 $scope.contactlist = [];
 $scope.pageSize = 5;
 $scope.currentPage = 1;

 

 
 $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
 
  var refresh = function(){
    $http.get('/contactlist').success(function(response){
    	console.log("This is a Data from Controller");
    	$scope.contactlist = response;
    	$scope.contact= null;
    });

  };
 
   refresh();
   
    $scope.addContact = function(){
    	console.log($scope.contact);
    	$http.post('/contactlist',$scope.contact).success(function(response){
    		console.log(response);
    		refresh();
        location.reload();
    	});

    };
	

	$scope.remove = function(id){
		console.log(id);
		$http.delete('/contactlist/' + id).success(function(response){
			refresh();
		});
	};

	$scope.edit = function(id) {
      console.log("We are Editing id:"+ id);
      $http.get('/contactlist/' + id).success(function(response){
      	$scope.contact = response;
      });
    
    };

    $scope.update = function(){
    	console.log("Update method in Controller with id "+ $scope.contact._id);
        $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response){
        	refresh();
        });
    };

    $scope.deselect = function(){
      $scope.contact = "";
    };
	
})
.filter('startFrom',function(){
  return function(data, start){
    return data.slice(start);
  }

});
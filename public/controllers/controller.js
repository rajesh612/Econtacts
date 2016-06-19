var contactsApp = angular.module('contactsApp',['ui.bootstrap']);

contactsApp.controller('AppCtrl', [ '$scope', '$http', 'fileUpload', function($scope, $http, fileUpload) {
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
    	console.log("This is a Refresh from Controller");
    	$scope.contactlist = response;
    	$scope.contact= null;
    });

  };
 
   refresh();
   
    //To add contact and store into Mongo DB
    $scope.addContact = function(){
    	console.log($scope.myFile);
  
      var file = $scope.myFile;
      if(typeof file==="undefined"){
        console.log("=======Empty File===========");
      } else{
      var uploadUrl = '/upload';
       console.log('file is Not empty');
       console.dir(file);
       fileUpload.uploadFileToUrl(file, uploadUrl).success(function(response){
        console.log(response);
       });
      }
      refresh();
      location.reload();
    };
	
  //To remove contact from Mongo DB
	$scope.remove = function(id){
		console.log(id);
		$http.delete('/contactlist/' + id).success(function(response){
			refresh();
      location.reload();
		});
	};

  //To edit contact details
	$scope.edit = function(id) {
      console.log("We are Editing id:"+ id);
      $http.get('/contactlist/' + id).success(function(response){
        console.log(response);
      	$scope.contact = response;
      });
    
    };

    //To update contact and store into Mongo DB
    $scope.update = function(){
    	console.log("Update method in Controller with id "+ $scope.contact._id);
      console.log($scope.contact);
        $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response){
        	refresh();
        });
    };

    //To clear contact fields
    $scope.deselect = function(){
      $scope.contact = "";
    };
	
}])
.filter('startFrom',function(){
  return function(data, start){
    return data.slice(start);
  }

});
angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope,$state,$http,$ionicPopup,$ionicLoading,$rootScope) {
  $scope.user = {}
  //$state.go('tab.dash');
  $scope.signIn = function(user) {
    $ionicLoading.show({
        template : "<ion-spinner icon='spiral'></ionic-spinner>"
    })
    $http.get("http://localhost:8888/buddy-meet/public/login?email="+user.email+"&password="+user.password)
    .success(function (response) {
      console.log(response[0])
      if(response[0]){
        $ionicLoading.hide()
        $rootScope.LuserName = response[0].user_name
        $rootScope.Labout = response[0].about
        $rootScope.LbirthDate = response[0].birthDate
        $rootScope.Lemail = response[0].email
        $rootScope.LfirstName = response[0].first_name
        $rootScope.Lgender = response[0].gender
        $rootScope.LhomeTown = response[0].home_town
        $rootScope.Lid = response[0].id
        $rootScope.LlastName = response[0].last_name
        $rootScope.Lphone = response[0].phone
        $rootScope.Lstatus = response[0].status
        console.log("login")
        $state.go('tab.dash');
      }else{
        $ionicLoading.hide()
        $ionicPopup.alert({
            title: 'Error',
            template: '<center>Invalid Email or Password</center>',
            buttons: [{
            text:'OK',
            type: 'button-assertive'
              }]
          });
      }
    })
  };
  
})

.controller('DashCtrl', function($scope,$rootScope,$http) {
  var comment = {}
  comment.body = ""
  var userId = $rootScope.Lid
  $http.get("http://localhost:8888/buddy-meet/public/loadTimeLine?id="+userId)
  .success(function (response) {
    //console.log(response)
    var posts = response.posts
    var comments = response.comments
    posts.forEach(function(post,index){
      post.comments = []
      comments.forEach(function(comment,index){
        if(comment){
          if(post.id == comment[0].post_id){
            post.comments.push(comment)
          }
        }
      })
    })
    $scope.posts = posts
    $scope.comment = comment
    console.log(posts);
  })

  $scope.addComment=function(postId){
    var commentBody = document.getElementById("post_"+postId).value;
    var userId = $rootScope.Lid
    var Lgender = $rootScope.Lgender
    var userName = $rootScope.LuserName
    $scope.image = "http://localhost:8888/buddy-meet/public/images/Male.jpg"
    document.getElementById("commentsOf"+postId).innerHTML = "<ion-item class=\"item-avatar-left item\"><img ng-src=\"{{image}}\"><b class=\"ng-binding\">"+userName+"</b><h2 style=\"white-space: normal;\" class=\"ng-binding\">"+commentBody+"</h2></ion-item>" + document.getElementById("commentsOf"+postId).innerHTML
      $http.get("http://localhost:8888/buddy-meet/public/mobileAddComment?id="+userId+"&postId="+postId+"&commentBody="+commentBody)
      .success(function (response) {

    })
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

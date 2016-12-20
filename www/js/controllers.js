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

.controller('DashCtrl', function($scope,$rootScope,$http,$ionicLoading) {
  $ionicLoading.show({
        template : "<ion-spinner icon='spiral'></ionic-spinner>"
    })
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
    $ionicLoading.hide()
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

   $scope.doRefresh = function() {
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
    $scope.$broadcast('scroll.refreshComplete');
   }
})

.controller('RequestsCtrl', function($scope, $http,$rootScope) {
  var userId = $rootScope.Lid
  $http.get("http://localhost:8888/buddy-meet/public/getFriendRequests?ID="+userId)
  .success(function (response) {
    $scope.requests = response
    $scope.requests.forEach(function(request,index){
      $http.get("http://localhost:8888/buddy-meet/public/getGender?id="+request.user_1)
        .success(function (response) {
          request.gender = response
          console.log(response)
        })
    })
  })

  $scope.doRefresh = function() {
    var userId = $rootScope.Lid
    $http.get("http://localhost:8888/buddy-meet/public/getFriendRequests?ID="+userId)
    .success(function (response) {
      $scope.requests = response
      $scope.requests.forEach(function(request,index){
        $http.get("http://localhost:8888/buddy-meet/public/getGender?id="+request.user_1)
          .success(function (response) {
            request.gender = response
            console.log(response)
          })
      })
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  $scope.confirmRequest = function(foreignId){
    var user_1 = $rootScope.Lid
    var user_2 = foreignId
    $http.get("http://localhost:8888/buddy-meet/public/mobileConfirmRequest?user_1="+user_1+"&user_2="+user_2)
        .success(function (response) {
          $scope.doRefresh()
        })
  }
  $scope.deleteRequest = function(foreignId){
    var user_1 = $rootScope.Lid
    var user_2 = foreignId
     $http.get("http://localhost:8888/buddy-meet/public/mobileDeleteFriend?user_1="+user_1+"&user_2="+user_2)
        .success(function (response) {
          $scope.doRefresh()
        })
  }


  

})

.controller('AccountCtrl', function($scope,$rootScope,$http) {
  var comment = {}
  comment.body = ""
  var userId = $rootScope.Lid
  $http.get("http://localhost:8888/buddy-meet/public/mobileLoadProfile?id="+userId)
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
    var commentBody = document.getElementById("postProfile_"+postId).value;
    console.log(commentBody);
    var userId = $rootScope.Lid
    var Lgender = $rootScope.Lgender
    var userName = $rootScope.LuserName
    $scope.image = "http://localhost:8888/buddy-meet/public/images/Male.jpg"
    document.getElementById("profileCommentsOf"+postId).innerHTML = "<ion-item class=\"item-avatar-left item\"><img ng-src=\"{{image}}\"><b class=\"ng-binding\">"+userName+"</b><h2 style=\"white-space: normal;\" class=\"ng-binding\">"+commentBody+"</h2></ion-item>" + document.getElementById("profileCommentsOf"+postId).innerHTML
      $http.get("http://localhost:8888/buddy-meet/public/mobileAddComment?id="+userId+"&postId="+postId+"&commentBody="+commentBody)
      .success(function (response) {

    })
  }

   $scope.doRefresh = function() {
    var comment = {}
    comment.body = ""
    var userId = $rootScope.Lid
    $http.get("http://localhost:8888/buddy-meet/public/mobileLoadProfile?id="+userId)
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
    $scope.$broadcast('scroll.refreshComplete');
   }
})

.controller('ForeignProfileCtrl', function($scope,$rootScope,$http,$stateParams,$ionicLoading) {
  $ionicLoading.show({
        template : "<ion-spinner icon='spiral'></ionic-spinner>"
    })
  var foreignId = $stateParams.id
  $scope.Fname = $stateParams.name
  $scope.gender = $stateParams.gender
  $scope.Fid = foreignId
  console.log(foreignId)
    var comment = {}
  comment.body = ""
  var userId = $rootScope.Lid
  $http.get("http://localhost:8888/buddy-meet/public/mobileLoadProfile?id="+foreignId)
  .success(function (response) {
    //console.log(response)
    var posts = response.posts
    var comments = response.comments
    console.log($scope.Fname)
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
    var commentBody = document.getElementById("postProfile_"+postId).value;
    console.log(commentBody);
    var userId = $rootScope.Lid
    var Lgender = $rootScope.Lgender
    var userName = $rootScope.LuserName
    $scope.image = "http://localhost:8888/buddy-meet/public/images/Male.jpg"
    document.getElementById("profileCommentsOf"+postId).innerHTML = "<ion-item class=\"item-avatar-left item\"><img ng-src=\"{{image}}\"><b class=\"ng-binding\">"+userName+"</b><h2 style=\"white-space: normal;\" class=\"ng-binding\">"+commentBody+"</h2></ion-item>" + document.getElementById("profileCommentsOf"+postId).innerHTML
      $http.get("http://localhost:8888/buddy-meet/public/mobileAddComment?id="+userId+"&postId="+postId+"&commentBody="+commentBody)
      .success(function (response) {

    })
  }

   $scope.doRefreshForeign = function() {
     var foreignId = $stateParams.id
    var comment = {}
    comment.body = ""
    var userId = $rootScope.Lid
    console.log(foreignId)
    $http.get("http://localhost:8888/buddy-meet/public/mobileLoadProfile?id="+foreignId)
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
    $scope.$broadcast('scroll.refreshComplete');
   }
   $ionicLoading.hide()
})




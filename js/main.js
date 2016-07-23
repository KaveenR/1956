var app = angular.module('ninteenfiftysix',[]);
var COL_NAMES = ['1','5','6','9'];

app.controller('mainCtrl', function($scope, $http, $rootScope, $interval) {
  $scope.data = [];
  $scope.dict = [];
  $scope.dict_keys = [];
  $scope.ready = false;
  $scope.active = null;
  $scope.autoplayHandler = null;
  $scope.autoPlayState = true;

  $scope.init = function(){
    console.log("YOLO");
    $http.get("data.json").success(function(dat){
      $scope.data = dat;
      $scope.ready = true;
      $scope.dict = $scope.makeDict($scope.data);
      $scope.dict_keys = Object.keys($scope.dict);
      if ($scope.autoPlayState){
          $scope.startAutoPlay();
      }
    }).error(function(){
      alert("Network Error");
    });
  }

  $scope.startAutoPlay = function(){
    $interval.cancel($scope.autoplayHandler);
    $scope.autoplayHandler = $interval(function () {
      var rands = Math.floor((Math.random() * $scope.data.length) + 0)
      $scope.active = $scope.dict_keys[rands];
    }, 3000);
  }

  $scope.toggleAutoPlay = function(){
    $scope.autoPlayState = !$scope.autoPlayState;
    if ($scope.autoPlayState){
      $scope.startAutoPlay();
    }else{
      $interval.cancel($scope.autoplayHandler);
    }
  }

  $scope.onClick = function(key){
    $scope.active = key;
  }

  $scope.resolve = function(key){
    var cur = $scope.dict[key];
    var rands = Math.floor((Math.random() * cur.length) + 0)
    var current_entry = $scope.data[cur[rands]];
    return $scope.entryTOS(current_entry);
  }

  $scope.entryTOS = function(entry){
    var str = "";
    for ( i in COL_NAMES){
      str = str + " " + entry[COL_NAMES[i]];
    }
    return str;
  }
  $scope.makeDict = function(data){
    var dict = [];
    for(var row in data){
      for(var col in COL_NAMES){
        var cur_word = data[row][COL_NAMES[col]];
        if (dict[cur_word] == undefined){
          dict[cur_word] = [parseInt(row)];
        }else{
          dict[cur_word].push(parseInt(row));
        }
      }
    }
    return dict;
  }

});

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal, Entries, $ionicPopover, $timeout, $ionicPopup) {
  //todo
  //allow save only after timer has started.
  //play must change to pause
  //stop must reset timer
  //back must ask if user wants to cancel the entry
  //export to csv
  //email csv

  //ionic.material.ink.displayEffect();
  $scope.entries = [];

  var fetchData = function () {
    return Entries.all().then(function (resAll) {
      $scope.entries = resAll.rows;
    });
  }
  fetchData();
  var resetEntry = function () {
    $scope.entry = {
      id: 0,
      startedAt: 0,
      totalTimer: 0,
      walkers: 0,
      bicycles: 0,
      cars: 0,
      motorcycles: 0
    }
  }

  resetEntry();

  $ionicModal.fromTemplateUrl('create-registry-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $ionicPopover.fromTemplateUrl('my-popover.html', {
   scope: $scope
  }).then(function(popover) {
   $scope.popover = popover;
  });
  $timeout(function () {
    ionic.material.ink.displayEffect();
  }, 0);
  //Inside the modal
  $scope.timer = {
    running: false,
    started: false
  }

  $scope.$on('timer-stopped', function (event, data) {
    $scope.entry.totalTimer = data;
  });

  $scope.cancelEntry = function () {
    resetEntry();
    resetTimmer();
    $scope.closeModal();
  }
  $scope.toggleTimer = function () {
    if(!$scope.timer.started){
      $scope.$broadcast('timer-start');
      $scope.timer.running = true;
      $scope.timer.started = true;
    } else {
      if($scope.timer.running){
        $scope.$broadcast('timer-stop');
        $scope.timer.running = false;
        $scope.timer.started = true;
      } else {
        $scope.$broadcast('timer-resume');
        $scope.timer.running = true;
        $scope.timer.started = true;
      }
    }
  }

  $scope.resetTimer = function () {
    $scope.$broadcast('timer-stop');
    $scope.$broadcast('timer-reset');
    $scope.timer.running = false;
    $scope.timer.started = false;
  }

  $scope.save = function (entry) {
    $scope.resetTimer();
    Entries.add(angular.copy($scope.entry)).then(function (res) {
      return fetchData();
    }).catch(function (err) {
      debugger;
    });
    resetEntry();
    $scope.closeModal();
  }

  $scope.increment = function (vehicle) {
    $scope.entry[vehicle] += 1;
  }
  $scope.decrement = function (vehicle) {
    $scope.entry[vehicle] -= 1;
  }
  $scope.openModal = function () {
    $scope.modal.show();
  }

  $scope.closeModal = function () {
    $scope.modal.hide();
  }

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  //Popover
  //####################

   $scope.openPopover = function($event) {
     $scope.popover.show($event);
   };
   $scope.closePopover = function() {
     $scope.popover.hide();
   };
   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
     $scope.popover.remove();
   });
   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
     // Execute action
   });
   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
     // Execute action
   });

   // A confirm dialog
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Limpar Dados',
       template: 'Você tem certeza que quer apagar todos os dados?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         Entries.clean();
         $scope.entries = [];
         $scope.closePopover;
       } else {
         console.log('You are not sure');
       }
     });
   };
   $scope.delete = function(entry) {
     var i = parseInt(entry.id) + 1;
     var confirmPopup = $ionicPopup.confirm({
       title: 'Deletar #'+i,
       template: 'Tem certeza que deseja apagar o registro?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         Entries.remove(entry).then(function (res) {
           fetchData();
         }).catch(function (err) {
           console.log('error deleting entr');
         });
         $scope.closePopover;
       } else {
         console.log('You are not sure');
       }
     });
   };
})

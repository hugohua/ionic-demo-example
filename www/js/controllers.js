angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout,$ionicLoading) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            //登录后就不显示了
            if (!$scope.loginData.username) {
                $scope.modal.show();
            }
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
                $ionicLoading.hide();
            }, 1000);

            //显示loading
            $ionicLoading.show({
                template: 'Loading...'
            });

        };
    })

    // *******************
// 向导页面
// *******************
    .controller('TutorialCtrl', function($scope, $rootScope,$state, $timeout,$ionicViewService) {

        // "立即体验"按钮Event
        $scope.gotoMain = function() {
//            $ionicViewService.clearHistory();
            // 默认进入首页
            $state.go('app.index');
        }

        $scope.slideHasChanged = function(index) {
            console.log(index);

        };
    })

    //首页
    .controller('IndexCtrl', function ($scope, GoodsService) {
        console.log($scope, GoodsService);
        //查找数据
        GoodsService.findAll().success(function (data) {
            $scope.list = data.deals;
        });

    })

    //团购
    .controller('GrouponCtrl', function ($scope, GoodsService) {
        console.log($scope, GoodsService);
        //查找数据
        GoodsService.findAll().success(function (data) {
            $scope.list = data.deals;
        });

    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

//详情页
    .controller('DetailCtrl', function ($scope, $state,$stateParams, $ionicPopup, GoodsService, $location) {
        GoodsService.findById($stateParams.dealId).then(function (data) {
//            $stateParams.dealId
            $scope.data = data;
            console.log($location);

            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: '提示!',
                    template: '购买成功，请尽快去消费~~'
                });
                alertPopup.then(function (res) {
//                    $location.path('/app.index');
                    $state.go('app.index');
                    console.log('Thank you for not eating my delicious ice cream cone');

                });
            };

        })
    });

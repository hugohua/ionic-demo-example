// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',  'starter.services',  'starter.controllers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            //菜单
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            //欢迎页
            .state('tutorial', {
                url: '/',
                templateUrl: 'templates/tutorial.html',
                controller: 'TutorialCtrl'
            })

            //首页
            .state('app.index', {
                url: "/index",
                views: {
                    'menuContent': {
                        templateUrl: "templates/index.html",
                        controller: 'IndexCtrl'
                    }
                }
            })

            //搜索
            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

            //团购
            .state('app.groupon', {
                url: "/groupon",
                views: {
                    'menuContent': {
                        templateUrl: "templates/groupon.html",
                        controller: 'GrouponCtrl'
                    }
                }
            })
            //电影
            .state('app.film', {
                url: "/film",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            })

            .state('app.detail', {
                url: "/list/:dealId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/detail.html",
                        controller: 'DetailCtrl'
                    }
                }
            })
            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        //首页
        $urlRouterProvider.otherwise('/');
    });


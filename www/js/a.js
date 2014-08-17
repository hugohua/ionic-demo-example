define(["runtime/ditu"], function (app) {
    app.register.controller("groupon_listCtrl", ["$rootScope", "$scope", "$window", "$timeout", "qqMapAPI", "gpsService", "tuanCats", function ($rootScope, $scope, $window, $timeout, qqMapAPI, gpsService, tuanCats) {
        function distance(p1, p2) {
            var xdiff = p1.x - p2.x, ydiff = p1.y - p2.y;
            return Math.pow(xdiff * xdiff + ydiff * ydiff, .5)
        }

        $scope.catCollapsed = !0, $scope.mapCollapsed = !0, $scope.keyword = "", $scope.search = function () {
            $rootScope.$log.debug("关键字：" + $scope.keyword), $scope.keyword = $scope.keyword.trim(), $scope.loadGroupon(1)
        }, $scope.changeTopCat = function (newCat) {
            $scope.selected_tcat = newCat, $scope.selected_scat = "全部", $scope.subCats = $scope.cats[newCat].subcategories, $scope.loadGroupon(1)
        }, $scope.changeSubCat = function (newSubCat) {
            $scope.selected_scat = newSubCat, $scope.loadGroupon(1)
        }, tuanCats.getCats().then(function (cats) {
            $scope.cats = {};
            for (var i = 0; i < cats.length; i++)$scope.cats[cats[i].category_name] = cats[i];
            $scope.subCats = $scope.cats[$scope.selected_tcat].subcategories
        }), $scope.calDistance = function (num) {
            return num >= 1e3 ? (num = Math.round(num / 100) / 10, num + "公里") : num + "米"
        }, $scope.getNearestShop = function (businesses) {
            var result = businesses[0];
            if (businesses.length > 0)for (var delta = null, i = 0; i < businesses.length; i++) {
                var info = businesses[i], dist = distance({x: $scope.query.lat, y: $scope.query.lng}, {x: info.latitude, y: info.longitude});
                null == delta ? delta = dist : delta > dist && (delta = dist, result = info)
            }
            return result
        }, $scope.query = {city: null, lat: null, lng: null, cat: "美食", page: 1, perpage: 20}, $scope.end = !1, $scope.loadGroupon = function (page) {
            if (inited) {
                if (1 == page)$scope.query.page = 1, $scope.list = [], $scope.query.lat = $scope.center.lat, $scope.query.lng = $scope.center.lng, $scope.query.cat = "全部" == $scope.selected_scat ? $scope.selected_tcat : $scope.selected_scat, $scope.keyword && $scope.keyword.length > 0 ? $scope.query.keyword = $scope.keyword : $scope.query.keyword && delete $scope.query.keyword, $scope.lastshop = null, $rootScope.$stateParams.tcat = $scope.selected_tcat, $rootScope.$stateParams.scat = $scope.selected_scat, $rootScope.$stateParams.lat = $scope.query.lat, $rootScope.$stateParams.lng = $scope.query.lng, $rootScope.$stateParams.city = $scope.query.city, $rootScope.$stateParams.keyword = $scope.keyword, $rootScope.syncParamsToUrl($rootScope.$stateParams), $rootScope.$cookieStore.remove("grouponloction"), $rootScope.$cookieStore.put("grouponloction", $scope.center), $scope.end = !1; else {
                    if ((page - 1) * $scope.query.perpage > $scope.total_count)return void($scope.end = !0);
                    $scope.query.page = page
                }
                $scope.loading = !0, $rootScope.$log.debug("查询参数：" + angular.toJson($scope.query)), $rootScope.$sails.get("/dianping/deals", $scope.query, function (res) {
                    if ($scope.loading = !1, !res.deals || res.deals.length < 1)return $rootScope.$log.debug("团购列表：" + angular.toJson(res)), void($scope.empty = !0);
                    $scope.empty = !1, 1 == page && ($scope.total_count = res.total_count);
                    for (var i = 0; i < res.deals.length; i++) {
                        var deal = res.deals[i], shop = $scope.getNearestShop(deal.businesses);
                        delete deal.businesses, shop && $scope.lastshop && shop.id == $scope.lastshop.id ? $scope.lastshop.deals.push(deal) : shop && ($scope.lastshop = shop, shop.distance = deal.distance, shop.deals = [deal], $scope.list.push(shop))
                    }
                })
            }
        };
        var inited = !1;
        if ($scope.loading = !0, $scope.selected_tcat = "美食", $scope.selected_scat = "全部", $scope.center = {lat: null, lng: null}, $rootScope.$stateParams.tcat && ($scope.selected_tcat = $rootScope.$stateParams.tcat), $rootScope.$stateParams.scat && ($scope.selected_scat = $rootScope.$stateParams.scat), $rootScope.$log.debug("URL参数:" + angular.toJson($rootScope.$stateParams)), $rootScope.$stateParams.lat && $rootScope.$stateParams.lng && $rootScope.$stateParams.city)$rootScope.$log.debug("从url中读取位置信息！"), $scope.center.lat = $rootScope.$stateParams.lat, $scope.center.lng = $rootScope.$stateParams.lng, $scope.query.city = $rootScope.$stateParams.city, $scope.keyword = $rootScope.$stateParams.keyword ? $rootScope.$stateParams.keyword : "", inited = !0, $scope.loadGroupon(1); else {
            var center = $rootScope.$cookieStore.get("location_xy"), city = $rootScope.$cookieStore.get("location_city");
            center && city ? ($rootScope.$log.debug("从cookie中读取位置信息！"), $scope.center.lat = center.lat, $scope.center.lng = center.lng, $scope.query.city = city, $scope.keyword = $rootScope.$stateParams.keyword ? $rootScope.$stateParams.keyword : "", inited = !0, $scope.loadGroupon(1)) : $rootScope.$state.go("public.location")
        }
        $scope.address = null, qqMapAPI.loadApi().then(function () {
            var geocoder = new qq.maps.Geocoder({complete: function (result) {
                $scope.address = result.detail.addressComponents.city + result.detail.addressComponents.district + result.detail.addressComponents.street + result.detail.addressComponents.streetNumber + "附近"
            }}), lat = $scope.center.lat, lng = $scope.center.lng, latLng = new qq.maps.LatLng(lat, lng);
            geocoder.getAddress(latLng), $rootScope.$log.debug("解释经纬度：" + angular.toJson(latLng))
        }), $scope.$on("TOUCH_BOTTOM", function () {
            $scope.loading || $scope.loadGroupon($scope.query.page + 1)
        }), $scope.showLocation = function (shop) {
            $rootScope.$state.go("groupon.location", {id: shop.id, latitude: shop.latitude, longitude: shop.longitude})
        }
    }]), app.register.factory("tuanCats", ["$rootScope", "$q", function ($rootScope, $q) {
        var cats = null, myService = {getCats: function () {
            var deferred = $q.defer(), delayCall = function () {
                cats ? deferred.resolve(cats) : $rootScope.$sails.get("/dianping/cats", function (res) {
                    var result = [];
                    res.map(function (value) {
                        -1 == ["抽奖", "旅游"].indexOf(value.category_name) && result.push(value)
                    }), deferred.resolve(result), cats = result
                })
            };
            return delayCall(), deferred.promise
        }};
        return myService
    }])
});
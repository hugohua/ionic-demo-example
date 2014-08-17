angular.module('starter.services', [])

.factory('GoodsData', function($http) {
    return $http.get('data/goodList.json');

})

    //$http -> ajax
    // $q -> deferred
.factory('GoodsService', function ($http, $q,GoodsData) {



    return {
        findAll: function () {
//            console.log(GoodsData);
            
//            var deferred = $q.defer();
//            $http.get('data/goodList.json').success(function(data){
//                deferred.resolve(data.deals);
//            });
            return GoodsData;
        },
        findById: function(Id) {
            var deferred = $q.defer();
            GoodsData.success(function(data){
                data.deals.forEach(function(item){
                    if(item.deal_id === Id){
                        deferred.resolve(item);
                        return false;
                    }
                })
            });
            return deferred.promise;
        }
    }
})
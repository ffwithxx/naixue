(function () {
    'use strict';

    angular
        .module('vk')
        .controller('PointShopController', PointShopController);

    PointShopController.$inject = ['PointShopService', '$sessionStorage', '$location', 'lodash'];

    /** @ngInject */
    function PointShopController(PointShopService, $sessionStorage, $location, lodash) {
        var token = $sessionStorage.token;
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;

        var vm = this;
        vm.point = $sessionStorage.point;
        vm.goConversionRecord = goConversionRecord;
        vm.goItemDetail = goItemDetail;
        vm.getvalue = getvalue;

        vm.showModle = showModle;
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        PointShopService.getPointList(token, cardId, storeId).then(function (res) {
            vm.list = lodash.filter(res.data, function (each) {
                return each.inventory > 0;
            });
        });

        function showModle(type) {
            if (type == 0) {

                return true
            }else  {

                return false;
            }

        }
function getvalue(item) {
    if (item.payType == 0) {
        return item.point;
    }else  {

        return "￥"+item.price;
    }

}


        function goConversionRecord() {
            $location.url("/conversionRecord?storeId=" + storeId);
        }

        function goItemDetail(itemId) {
            $location.url("/conversionDetail?storeId=" + storeId + "&itemId=" + itemId);
        }
    }
})();

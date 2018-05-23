(function () {
    'use strict';

    angular
        .module('vk')
        .controller('ConversionRecordController', ConversionRecordController);

    ConversionRecordController.$inject = ['$location', '$sessionStorage', 'PointShopService','$timeout'];

    /** @ngInject */
    function ConversionRecordController($location, $sessionStorage, PointShopService,$timeout) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var orderId;
        var yunPrice;
        var resData;

        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.goBack = goBack;
        vm.getvalue = getvalue;
        vm.getYunValue = getYunValue;
        vm.getAllPrice = getAllPrice;
        getStoreFreight();
        function  getvalue(item) {
            if (item.payType == 3) {

                return item.point + "  " +"积分";
            }else {
                return "￥"+ item.price;
            }
        }
        function  getYunValue (item) {
            if (item.freight == 0 || item.freight == null){

               return "免邮";

            }else {
               return "￥" + item.freight;

            }
        }

        function  getAllPrice(item) {


                var allPrice =  yunPrice +item.price;
                return "￥" + allPrice;

        }
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        PointShopService.getRecordList(token,cardId).then(function (res) {

            vm.list = res.data;

        }, function (e) {
            vm.list = [];
        });
      function getStoreFreight() {
    PointShopService.getStoreFreight(token, cardId, storeId).then(function (res) {
        if (res.code !=200) {
            vm.msg.warning = true;
            vm.msg.message = res.message;
            $timeout(function () {
                vm.msg.warning = false;
                vm.msg.message = '';
            }, 2000);
            return;
        }
        resData = res.data;
        if (!res.data || res.data == null){
            vm.freight =0;
            yunPrice = 0;
        }else {
            vm.freight = res.data.freight;
            yunPrice = res.data.freight;
        }


    });
}


        function goBack() {
            $location.url("/pointShop?storeId=" + storeId);
        }
    }
})();

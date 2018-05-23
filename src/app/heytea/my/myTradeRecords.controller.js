(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMyTradeRecordsController', HeyTeaMyTradeRecordsController);

    /** @ngInject */
    HeyTeaMyTradeRecordsController.$inject = ['$location', '$sessionStorage', 'ApiService', 'lodash'];

    function HeyTeaMyTradeRecordsController($location, $sessionStorage, ApiService, lodash) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;

        var vm = this;
        vm.list = [];
        vm.goBack = goBack;

        getTradeList();

        function goBack() {
            $location.url("/heytea-my?storeId=" + storeId);
        }

        function getTradeList() {
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            ApiService.getRechargeList($sessionStorage.cardId, $sessionStorage.token, $sessionStorage.storeId, 2).then(function (res) {
                var temp;
                angular.forEach(res.data, function (v) {
                    temp = v.createdDate.split(" ");
                    v.date = temp[0];
                    v.time = temp[1];
                    var gifts = [];
                    if (v.ticketNames.length > 0) {
                        gifts = v.ticketNames.split(',');
                    }
                    if (v.point) {
                        gifts.push(v.point + "积分");
                    }
                    if (v.give) {
                        gifts.push(v.give + "元");
                    }
                    if (!lodash.isEmpty(gifts)) {
                        v.gifts = gifts;
                    }

                    if (v.cashAmount) {
                        v.payType = "现金";
                        v.payTotal = v.cashAmount;

                    } else if (v.creditAmount) {
                        v.payType = "银联卡";
                        v.payTotal = v.creditAmount;

                    } else if (v.weixinAmount) {
                        v.payType = "微信";
                        v.payTotal = v.weixinAmount;

                    } else if (v.weixinAmount) {
                        v.payType = "微信";
                        v.payTotal = v.weixinAmount;

                    } else if (v.qqpayAmount) {
                        v.payType = "qq";
                        v.payTotal = v.qqpayAmount;

                    } else if (v.alipayAmount) {
                        v.payType = "支付宝";
                        v.payTotal = v.alipayAmount;

                    } else if (v.amount) {
                        v.payType = "现金";
                        v.payTotal = v.amount;

                    } else {
                        v.payType = "错误";
                        v.payTotal = 0;

                    }
                });
                vm.list = res.data;
            });
        }
    }
})();

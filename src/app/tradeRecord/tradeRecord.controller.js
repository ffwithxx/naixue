(function () {
    'use strict';

    angular
        .module('vk')
        .controller('TradeRecordController', TradeRecordController);

    /** @ngInject */
    TradeRecordController.$inject = ['$location', '$sessionStorage', 'ApiService', 'lodash'];

    function TradeRecordController($location, $sessionStorage, ApiService, lodash) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        var vm = this;
        vm.active = 'one';
        vm.list = [];
        vm.switchTab = switchTab;
        vm.goBack = goBack;

        getRechargeList();

        function switchTab(tab) {
            vm.list = [];
            vm.active = tab;
            //filter data
            if (tab === 'one') {
                getRechargeList();
            } else {
                getTradeList();
            }
        }

        function goBack() {
            $location.url("/my?storeId=" + storeId+ "&theme=" + theme);
        }

        function getRechargeList() {
            vm.list = [];
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            ApiService.getRechargeList($sessionStorage.cardId, $sessionStorage.token, $sessionStorage.storeId, 1).then(function (res) {
                angular.forEach(res.data, function (each) {
                    var gifts = [];
                    if (each.ticketNames.length > 0) {
                        gifts = each.ticketNames.split(',');
                    }
                    if (each.point) {
                        gifts.push(each.point + "积分");
                    }
                    if (each.give) {
                        gifts.push(each.give + "元");
                    }
                    if (!lodash.isEmpty(gifts)) {
                        each.gifts = gifts;
                    }

                    if (each.cashAmount) {
                        each.payType = "现金";
                        each.payTotal = each.cashAmount;

                    } else if (each.creditAmount) {
                        each.payType = "银联卡";
                        each.payTotal = each.creditAmount;

                    } else if (each.weixinAmount) {
                        each.payType = "微信";
                        each.payTotal = each.weixinAmount;

                    } else if (each.weixinAmount) {
                        each.payType = "微信";
                        each.payTotal = each.weixinAmount;

                    } else if (each.qqpayAmount) {
                        each.payType = "qq";
                        each.payTotal = each.qqpayAmount;

                    } else if (each.alipayAmount) {
                        each.payType = "支付宝";
                        each.payTotal = each.alipayAmount;

                    } else if (each.amount) {
                        each.payType = "现金";
                        each.payTotal = each.amount;

                    } else {
                        each.payType = "错误";
                        each.payTotal = 0;

                    }

                    vm.list.push(each);
                });
            });
        }

        function getTradeList() {
            vm.list = [];
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            ApiService.getRechargeList($sessionStorage.cardId, $sessionStorage.token, $sessionStorage.storeId, 2).then(function (res) {
                angular.forEach(res.data, function (each) {
                    var gifts = [];
                    if (each.ticketNames.length > 0) {
                        gifts = each.ticketNames.split(',');
                    }
                    if (each.point) {
                        gifts.push(each.point + "积分");
                    }
                    if (each.give) {
                        gifts.push(each.give + "元");
                    }
                    if (!lodash.isEmpty(gifts)) {
                        each.gifts = gifts;
                    }
                    if(each.remark.length>0&&each.remark.indexOf(',')>0){
                        each.remarks = each.remark.split(',');
                    }

                    vm.list.push(each);
                });
                console.log(vm.list)
            });
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myRechargeController', myRechargeController);

    /** @ngInject */
    myRechargeController.$inject = ['$location', '$timeout', 'UtilService', 'MyService', '$sessionStorage', "lodash", "SessionStorageService"];

    function myRechargeController($location, $timeout, UtilService, MyService, $sessionStorage, lodash, SessionStorageService) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var openId = $sessionStorage.weChatOpenId;
        var times = 0;

        var vm = this;
        vm.showPaySuccess = false;
        vm.memberName = $sessionStorage.memberName;
        vm.mobile = $sessionStorage.mobile;
        vm.balance = $sessionStorage.balance;
        vm.points = $sessionStorage.point;
        vm.rechargeAmountDisplay = 0;
        vm.onCheck = onCheck;
        vm.recharge = recharge;
        vm.goBack = goBack;

        function goBack() {
            $location.url('/my?storeId=' + storeId);
        }

        function onCheck(item) {
            vm.rechargeAmountDisplay = item.amount;
        }


        function refreshUserInfo() {
            times += 1;
            if (times >= 5) {
                return
            }
            $timeout(function () {
                if(cardId =="" ||cardId=="null"||!cardId){
                    return
                }
                MyService.getMemberInfo(cardId, token).then(function (data) {
                    if (data.code != 200) {
                        alert(data.message);
                        console.log(data.message);
                        return
                    }
                    if ($sessionStorage.balance != data.data.balance || $sessionStorage.point != data.data.point) {
                        SessionStorageService.setAllSessionStorage(data.data, function (res) {
                            $sessionStorage.memberName = $sessionStorage.name;
                            $sessionStorage.cardId = $sessionStorage.id;
                        });

                        vm.balance = $sessionStorage.balance;
                        vm.points = $sessionStorage.point;
                        return
                    }

                    refreshUserInfo()

                });
            }, 2000);

        }

        function recharge() {
            if (!vm.rechargeItem) {
                alert('请先选择要充值的金额');
                console.log('请先选择要充值的金额');
                return
            }

            var selectedItem = JSON.parse(vm.rechargeItem);
            var data = {
                mobile: vm.mobile,
                memberName: vm.memberName,
                title: selectedItem.title,
                amount: selectedItem.amount * 100,
                id: selectedItem.id,
                curUrl: $location.absUrl()
            };
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.rechargeByWeChat(cardId, storeId, token, openId, data).then(function (data) {
                console.log(data);
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return
                }

                var config = {
                    debug: false,
                    appId: data.signData.appId,
                    timestamp: data.signData.timestamp,
                    nonceStr: data.signData.nonceStr,
                    signature: data.signData.signature,
                    jsApiList: ['checkJsApi', 'chooseWXPay']
                };
                wx.config(config);


                wx.ready(function () {
                    wx.chooseWXPay({
                            debug: false,
                            timestamp: data.payData.timeStamp,
                            nonceStr: data.payData.nonceStr,
                            package: data.payData.prepay_id,
                            signType: data.payData.signType,
                            paySign: data.payData.paySign,
                            success: function (res) {

                                $timeout(function () {
                                    refreshUserInfo();
                                }, 1000);

                                UtilService.showToast(vm, "充值成功");
                            },
                            fail: function (res) {
                                // UtilService.showToast(vm, "充值失败" + JSON.stringify(res));
                                alert('充值失败', res);
                            }
                        }
                    )
                })

            }, function (e) {
                //error msg
            });

        }
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        MyService.getRechargeList(cardId, token).then(function (data) {
            if (data.code != 200) {
                console.log("getRechargeList" + data.message);
                return
            }
            lodash.each(data.data, function (each) {
                var temp = [];
                // temp.push("充值" + each.amount + "元");
                if (each.give) {
                    temp.push("送" + each.give + "元");
                }
                if (each.point) {
                    temp.push("送" + each.point + "积分");
                }
                if (each.experience) {
                    temp.push("送" + each.experience + "经验值");
                }
                if (each.ticketNames) {
                    var yoyoyo = each.ticketNames.split(",");
                    lodash.each(yoyoyo, function (eachTicketName) {
                        temp.push("送" + eachTicketName);
                    })
                }
                each.otherInfo = temp.join(",");
                // if (!lodash.isEmpty(temp)) {
                //     each.otherInfo = temp;
                // }
            });
            vm.rechargeList = data.data;
        }, function (e) {
            //error msg
        });
    }
})();

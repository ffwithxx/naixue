(function () {
    'use strict';

    angular
        .module('vk')
        .controller('memberLevelDetailController', memberLevelDetailController);

    /** @ngInject */
    memberLevelDetailController.$inject = ['$location', 'MyService', '$sessionStorage', "lodash"];

    function memberLevelDetailController($location, MyService, $sessionStorage, lodash) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var vm = this;
        vm.goBack = goBack;
        vm.getdiscount = getdiscount;
        vm.myExperience = myExperience;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        MyService.getMemberLevelDetail(cardId, storeId, token).then(function (data) {
            if (data.code != 200) {
                return
            }
            lodash.each(data.data, function (each) {

                var temp = [];
                // temp.push("充值" + each.amount + "元");
                if (each.amount) {
                    temp.push("送" + each.amount + "元");
                }
                if (each.point) {
                    temp.push("送" + each.point + "积分");
                }
                if (each.ticketNames) {
                    lodash.each(each.ticketNames.split(","), function (eachTicketName) {
                        temp.push("送" + eachTicketName);
                    })
                }
                if(!lodash.isEmpty(temp)){
                    each.otherInfo = temp;
                }
            });
            vm.levels = data.data;
        }, function (e) {
            //error msg
        });
function getdiscount(discount) {
    if (discount == 10) {

        return "无折扣"
    }else  {
        return discount + '折';
    }

}
        function goBack() {
            $location.url("/memberInfo?storeId=" + storeId+ "&theme=" + theme);
        }

        function myExperience() {
            $location.url("/myExperience?storeId=" + storeId+ "&theme=" + theme);
        }


    }
})
();

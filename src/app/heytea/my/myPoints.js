/**
 * Created by ganyang on 2017/3/22.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMyPointsController', HeyTeaMyPointsController);

    HeyTeaMyPointsController.$inject = ['$sessionStorage', '$location', '$timeout', 'PointShopService', 'lodash'];

    /** @ngInject */
    function HeyTeaMyPointsController($sessionStorage, $location, $timeout, PointShopService, lodash) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;


        var vm = this;
        vm.name = $sessionStorage.memberName;
        vm.cardType = $sessionStorage.cardType || '普通卡';
        vm.cardId = $sessionStorage.cardId;
        vm.pointsRecords = [];
        vm.currentPoints = $sessionStorage.point || 0;
        vm.goBack = goBack;


        PointShopService.getMyPointInfo(token, cardId).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                return
            }
            vm.currentPoints = data.data.point;
            $sessionStorage.point = data.data.point;
        });

        PointShopService.getMyPointsRecords(cardId, token).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                // vm.msg.warning = true;
                // vm.msg.message = data.message;
                // $timeout(function () {
                //     vm.msg.warning = false;
                //     vm.msg.message = '';
                // }, 2000);
                return;
            }
            var aaa = 0;
            lodash.each(data.data, function (each) {
                aaa += parseFloat(each.point)
            });
            console.log(aaa);
            vm.pointsRecords = data.data
        });


        function goBack() {
            $location.url('/heytea-my?storeId=' + storeId + '&theme=heytea');
        }


    }
})();

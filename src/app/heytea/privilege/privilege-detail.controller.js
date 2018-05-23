(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaPrivilegeDetailController', HeyTeaPrivilegeDetailController);

    HeyTeaPrivilegeDetailController.$inject = ['$location', '$sessionStorage', 'MyService','$sce'];

    /** @ngInject */
    function HeyTeaPrivilegeDetailController($location, $sessionStorage, MyService,$sce) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var privilegeId = $location.search().privilegeId;
        var name = $location.search().name;
        var sid = $location.search().sid;
        var orderId;

        var vm = this;
        vm.img = "./assets/images/heytea/blankHead.png";
        vm.goBack = goBack;

        init();

        function init() {
            MyService.getPrivilegeDetail(cardId, token, privilegeId).then(function (data) {
                if (sid % 1 === 0) {
                    vm.img = './assets/images/heytea/card1.png';
                }
                if (sid % 2 === 0) {
                    vm.img = './assets/images/heytea/card2.png';
                }
                if (sid % 3 === 0) {
                    vm.img = './assets/images/heytea/card3.png';
                }
                vm.name = name;
                vm.list = data.data.privilege;

                vm.priv=  $sce.trustAsHtml( data.data.privilegeText);   ;
            })
        }

        function goBack() {
            $location.url("/heytea-privilege?storeId=" + storeId);
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaFitStoresController', HeyTeaFitStoresController);

    /** @ngInject */
    HeyTeaFitStoresController.$inject = ['$location', '$sessionStorage', 'MyService'];

    function HeyTeaFitStoresController($location, $sessionStorage, MyService) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var vm = this;
        vm.goBack = goBack;
        vm.goPage = goPage;
        vm.fitShops = [];

        MyService.getFitShops( token,storeId).then(function (retData) {
            if (retData.code != 200) {

                alert(retData.message);
                console.log(retData.message);
                // vm.memberBirthday = "";
                return
            }
            vm.bagImg = retData.addressImg||"./assets/images/heytea/map2.png"
            vm.fitShops = retData.data;
            // $sessionStorage.birthday = params.birthday;
            // $sessionStorage.birthday2 = params.birthday2;
            // vm.memberBirthday = params.birthday;
        });

        function goBack() {
            $location.url("/heytea-my?storeId=" + storeId);
        }

        function goPage() {
          window.location = "http://guozhiwei.h5release.com/h5/heytea.html";
          //$location.url("http://guozhiwei.h5release.com/h5/heytea.html");
        }
    }
})();

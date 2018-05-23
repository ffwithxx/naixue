(function () {
    'use strict';

    angular
        .module('vk')
        .controller('TabbarController', TabbarController);

    TabbarController.$inject = ['$location', '$sessionStorage'];

    /** @ngInject */
    function TabbarController($location, $sessionStorage) {
        var storeId = $sessionStorage.storeId;
        var vm = this;

        vm.active = ($location.path()).substr(1);
        vm.go = go;
        vm.showModule = showModule;
        vm.showModuletwo = showModuletwo;


        function go(name) {
            //TODO
            // if(name=='pointShop'){
            //     return;
            // }
            vm.active = name;
            $location.url("/" + name + "?storeId=" + storeId);
        }
        function showModuletwo() {
            return (  (storeId == 4172)||(storeId == 5411))
        }
        function showModule() {
          return (  (storeId !== 4172)&&(storeId !== 5411))
        }
    }
})();

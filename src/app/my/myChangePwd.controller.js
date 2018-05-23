(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myChangePwdController', myChangePwdController);

    /** @ngInject */
    myChangePwdController.$inject = ['$location', 'MyService', '$sessionStorage', "UtilService", "$timeout"];

    function myChangePwdController($location, MyService, $sessionStorage, UtilService, $timeout) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.submit = submit;
        vm.goBack = goBack;
        vm.onPwdChange = onPwdChange;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        function goBack() {
            $location.url("/my?storeId=" + storeId+ "&theme=" + theme);
        }

        function onPwdChange(item) {
            if (isNaN(item)) {
                vm.password = item.substring(0, item.length - 1);
                return
            }
            if (item.length > 6) {
                vm.password = item.substring(0, item.length - 1);
                vm.msg.warning = true;
                vm.msg.message = '密码只能为6位数字';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            console.log(item)
        }


        function submit() {
            if (!vm.password || !vm.rePassword) {
                vm.msg.warning = true;
                vm.msg.message = '密码不能为空';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            if (vm.password.length != 6) {
                vm.msg.warning = true;
                vm.msg.message = '密码只能为6位数字';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (vm.password != vm.rePassword) {
                vm.msg.warning = true;
                vm.msg.message = '两次密码不一致';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            vm.mobile = $sessionStorage.mobile;
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.changeMyPwd(cardId, token, storeId, vm).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return
                }

                UtilService.showToast(vm, "修改成功", goBack);

            }, function (e) {
                //error msg
            });
        }
    }
})();

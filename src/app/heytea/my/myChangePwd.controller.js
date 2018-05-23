(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMyChangePwdController', HeyTeaMyChangePwdController);

    /** @ngInject */
    HeyTeaMyChangePwdController.$inject = ['$location', 'MyService', '$sessionStorage', "UtilService", "$timeout"];

    function HeyTeaMyChangePwdController($location, MyService, $sessionStorage, UtilService, $timeout) {
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

        function goBack() {
            $location.url("/heytea-memberInfo?storeId=" + storeId);
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
            MyService.changeMyPwd(cardId, token, storeId, vm).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return
                }
                UtilService.showToast(vm, "修改成功");
                vm.oldPassword="";
                vm.password ="";
                vm.rePassword="";

            }, function (e) {
                //error msg
            });
        }
    }
})();

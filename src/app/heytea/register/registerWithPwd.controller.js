/**
 * Created by ganyang on 16/11/11.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaRegisterWithPwdController', HeyTeaRegisterWithPwdController);

    /** @ngInject */
    HeyTeaRegisterWithPwdController.$inject = ['$location', '$sessionStorage', 'RegisterWithPwdService', 'UtilService', "$timeout"];

    function HeyTeaRegisterWithPwdController($location, $sessionStorage, RegisterWithPwdService, UtilService, $timeout) {
        var storeId = $sessionStorage.storeId;
        var param = $location.search();
        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.goBack = goBack;
        vm.onPwdChange = onPwdChange;

        vm.submit = submit;

        function goBack() {
            $location.url('/heytea-register?storeId=' + storeId);
        }

        function onPwdChange(item) {
            if (isNaN(item)) {
                vm.pwd = item.substring(0, item.length - 1);
                return
            }
            if (item.length > 6) {
                vm.pwd = item.substring(0, item.length - 1);
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
            if (!vm.pwd || !vm.rePwd) {
                vm.msg.warning = true;
                vm.msg.message = '密码不能为空';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (vm.pwd.length != 6) {
                vm.msg.warning = true;
                vm.msg.message = '密码只能为6位数字';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (vm.pwd != vm.rePwd) {
                vm.msg.warning = true;
                vm.msg.message = '两次密码不一致';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            param.pwd = vm.pwd;
            RegisterWithPwdService.register(storeId, param).then(function (data) {
                console.log(data);
                if (data.code != 200) {
                    alert(data.message);
                    return
                }
                UtilService.showToast(vm, "注册成功", function () {
                        $location.url('/loginByVKApiHeyTea?storeId=' + storeId);
                    }
                );

            }, function (e) {
                //error msg
            });
        }

    }
})();

/**
 * Created by ganyang on 16/11/11.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('RegisterWithPwdController', RegisterWithPwdController);

    /** @ngInject */
    RegisterWithPwdController.$inject = ['$location', '$sessionStorage', 'RegisterWithPwdService', 'UtilService', "$timeout",'LoginService','SessionStorageService'];

    function RegisterWithPwdController($location, $sessionStorage, RegisterWithPwdService, UtilService, $timeout,LoginService,SessionStorageService) {
        var storeId = $sessionStorage.storeId;
        var param = $location.search();
        var openId = $sessionStorage.weChatOpenId;
        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.goBack = goBack;
        vm.onPwdChange = onPwdChange;

        vm.submit = submit;

        function goBack() {
            $location.url('/register?storeId=' + storeId);
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
        function formatDateTime(inputTime) {


            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        };

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
                    var params2 = {mobile: $location.search().mobile, password: vm.pwd, openId: openId};
                    // LoginService.loginByVKApi(storeId, param).then(function (data) {
                    //     console.log(data);
                    //     if (data.code != 200) {
                    //         alert(data.message);
                    //         return
                    //     }
                    //
                    //         }
                    //     );
                    LoginService.loginByVKApi(storeId, params2).then(function (data) {
                        if (data.code != 200) {

                            if (redirect) {
                                $location.url(redirect + '?storeId=' + storeId + "&message=" + data.message);
                                return
                            }

                            vm.msg.warning = true;
                            vm.msg.message = data.message;
                            $timeout(function () {
                                vm.msg.warning = false;
                                vm.msg.message = '';
                            }, 2000);
                            return;
                        }
                        SessionStorageService.setOneSessionStorage("cardId", data.cardId);
                        SessionStorageService.setOneSessionStorage("token", data.token);
                        SessionStorageService.setOneSessionStorage("levelName", data.data.levelName);
                        SessionStorageService.setOneSessionStorage("discount", data.data.discount);
                        var timestamp = formatDateTime(data.data.activated);
                        SessionStorageService.setOneSessionStorage("activated", timestamp);
                        SessionStorageService.setAllSessionStorage(data.data, function (res) {
                            $sessionStorage.memberName = $sessionStorage.name;
                            $sessionStorage.activated = timestamp;
                        });

                        var url = $sessionStorage.redirectUrl;
                        // alert(url);
                        if (url != "/my_recharge" && url != "/myPayCode" && url != "/shopping" && url != "/pointShop") {
                            url = "";
                        }
                        if (url) {
                            $location.url(url + '?storeId=' + storeId);
                        } else {

                            $location.url('/my?storeId=' + storeId);
                        }

                    }, function (e) {
                        // vm.msg.warning = true;
                        // vm.msg.message = '账号/密码输入错误';
                        // $timeout(function () {
                        //     vm.msg.warning = false;
                        //     vm.msg.message = '';
                        // }, 2000);
                    });
                    }
                );

            }, function (e) {
                //error msg
            });
        }

    }
})();

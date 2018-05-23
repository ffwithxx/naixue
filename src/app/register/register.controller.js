(function () {
    'use strict';

    angular
        .module('vk')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    RegisterController.$inject = ['$interval', '$timeout', '$location', 'RegisterService', '$sessionStorage','SessionStorageService',"$window","$scope"];

    function RegisterController($interval, $timeout, $location, RegisterService, $sessionStorage,SessionStorageService,$window,$scope) {
        var waitSec = 60;
        var send = "false";
        var  csessionid;
        var  sig;
        var tokenStr;
        var scene;
        var vCodeWait = waitSec;
        var urlParam = $location.search();
        var storeId = urlParam.storeId || $sessionStorage.storeId;
        var openId = $sessionStorage.weChatOpenId;
        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.vcodeTitle = "获取验证码";
        vm.checked = true;
        vm.getVcode = getVcode;
        vm.submit = submit;
        vm.goBack = goBack;
        vm.goBuy = goBuy;

        // alert("生日信息一经设置无法修改，请谨慎选择！");
        function goBack() {
            $location.url('/loginByVKApi?storeId=' + storeId);
        }
        function goBuy() {
            $location.url('/agreement?storeId=' + storeId+"&type="+"register");
        }
        if (!openId && angular.isUndefined($sessionStorage.debug) && !window.isDebug) {
            //console.log("没有openId,请通过微信重新登录");
            SessionStorageService.setOneSessionStorage("redirectUrl", $location.path());
            $location.url('/loginByWeChat?storeId=' + storeId);
            return;
        }
        setTimeout(function () {
            alert("生日信息一经设置无法修改，请谨慎选择！")
        }, 1000);

        function countDown() {
            var timePromise = $interval(function () {
                if (vCodeWait <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = undefined;
                    vCodeWait = waitSec;
                    vm.vcodeTitle = "重新发送";
                    vm.vcodeCss = "";
                } else {
                    vm.vcodeTitle = "重发(" + vCodeWait + ")";
                    vCodeWait--;
                    vm.vcodeCss = "my_greyout";
                }
            }, 1000, 100);

        }

        function getVcode() {
            if (!vm.mobile) {
                vm.msg.warning = true;
                vm.msg.message = "请输入手机号";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            if (send == "false"){
                vm.msg.warning = true;
                vm.msg.message = "请先进行滑动校验！";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            if (vCodeWait < waitSec) {
                return
            }

            RegisterService.getVcode(storeId, vm.mobile,csessionid,sig,tokenStr,scene).then(function (data) {
                if (data.code != 200) {

                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    $timeout(function () {
                        $scope.reloadRoute();
                    }, 3000);

                    return;
                }
                countDown();
            }, function (e) {
                alert(e.message);
            });
        }

        function submit() {
            if (!vm.mobile || !vm.vcode || !vm.birthday || !vm.gender || !vm.name) {
                vm.msg.warning = true;
                vm.msg.message = '请填写所有星号项';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (!vm.checked) {
                vm.msg.warning = true;
                vm.msg.message = '您还未同意相关条款';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }

            // var birthStr = vm.birthday.toLocaleDateString();
            // var birArr = birthStr.split("/");
            // var year = birArr[0];
            // var month = birArr[1];
            // var  day = birArr[2];




            var y = vm.birthday.getFullYear();
            var m = vm.birthday.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = vm.birthday.getDate();
            d = d < 10 ? ('0' + d) : d;

            // if (month < 10){
            //     month = "0" + month;
            //
            // }
            // if (day < 10){
            //     day = "0" + day;
            // }
            $location.url('/registerWithPwd?storeId=' + storeId
                + '&mobile=' + vm.mobile
                + '&vcode=' + vm.vcode
                + '&birthday=' + [y,m,d].join("-")
                + '&gender=' + vm.gender
                + '&name=' + vm.name
            );
        }

        var nc = new noCaptcha();
        var nc_appkey = 'FFFF00000000017A69F4';  // 应用标识,不可更改
        var nc_scene = 'register';  //场景,不可更改
        var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
        var nc_option = {
            renderTo: '#dom_id',//渲染到该DOM ID指定的Div位置
            appkey: nc_appkey,
            scene: nc_scene,
            token: nc_token,
            //   trans: '{"name1":"code100"}',//测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
            callback: function (data) {// 校验成功回调
                console.log(data.csessionid);
                console.log(data.sig);
                console.log(nc_token);

                document.getElementById('csessionid').value = data.csessionid;
                document.getElementById('sig').value = data.sig;
                document.getElementById('token').value = nc_token;
                document.getElementById('scene').value = nc_scene;
                send = "true";
                csessionid = data.csessionid;
                sig =  data.sig;
                tokenStr = nc_token;;
                scene = nc_scene;;
            }
        };
        nc.init(nc_option);

        $scope.reloadRoute = function () {
            $window.location.reload();

        };
    }
})();

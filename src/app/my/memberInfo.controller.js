(function () {
    'use strict';

    angular
        .module('vk')
        .controller('MemberInfoController', MemberInfoController);

    /** @ngInject */
    MemberInfoController.$inject = ['$location', '$sessionStorage', 'MyService','RegisterService','$interval',"$scope","$window","$timeout"];

    function MemberInfoController($location, $sessionStorage, MyService,RegisterService,$interval,$scope,$window, $timeout) {
        var waitSec = 60;
        var send = "false";
        var  csessionid;
        var  sig;
        var tokenStr;
        var scene;
        var vCodeWait = waitSec;
        var istrue = true;
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.memberName = $sessionStorage.memberName;
        vm.mobile = $sessionStorage.mobile;
        vm.memberGender = parseInt($sessionStorage.sex) ? "女" : "男";
        if ($sessionStorage.sex == null) {
            vm.memberGender = "";
        }
        vm.memberBirthday = $sessionStorage.birthday;
        vm.memberCardNo = $sessionStorage.cardId;
        vm.createdDate = $sessionStorage.activated;
        vm.createdLocation = $sessionStorage.storeName;
        vm.memberLevel = $sessionStorage.levelName;
        vm.otherMobile = $sessionStorage.otherMobile;
        vm.goLevelDeatil = goLevelDetail;
        vm.updateGender = updateGender;
        vm.onKeyPressUpdateMemberName = onKeyPressUpdateMemberName;
        vm.noBlurUpdateMemberName = noBlurUpdateMemberName;
        vm.noBlurUpdateMemberNum = noBlurUpdateMemberNum;

        vm.updateBirthday = updateBirthday;
        vm.hold = hold;
        vm.goBack = goBack;
        vm.countDown = countDown;
        vm.vcodeTitle = "验证码";
        vm.Title = "修改手机号";
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;

        vm.getVcode = getVcode;
        vm.change = change;
        vm.closeDialog = closeDialog;
        function hold() {
            console.log(123);
        }
        function countDown() {
            var timePromise = $interval(function () {
                if (vCodeWait <= 0 ) {
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
        function  closeDialog() {
            vm.showDialog = false;
            // vm.account = "";
            // vm.vcodeTitle = "验证码";
            // vm.vcodeCss = "";
        }
        function change() {
            vm.showDialog = true;
        }
        function getVcode() {
            if (!vm.account) {
                vm.msg.warning = true;
                vm.msg.message = "请输入手机号";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }

            if (vCodeWait < waitSec) {
                return
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
            RegisterService.getmobileVcode(storeId, vm.account,csessionid,sig,tokenStr,scene).then(function (data) {
                if (data.code != 200) {
                  //  vm.msg.warning = true;
                   // vm.msg.message = data.message;
                    vm.showDialog = false;
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





        function noBlurUpdateMemberName(newName){
            MyService.updateMemberInfo(cardId, token, {name: newName}).then(function (retData) {
                if (retData.code != 200) {
                    alert(retData.message);
                    console.log(retData.message);
                    return
                }
                $sessionStorage.memberName = newName;
            })
        }
        function noBlurUpdateMemberNum(){
            if (vm.account.length != 11 && vm.account =="") {

                vm.msg.warning = true;
                vm.msg.message = "请输入手机号";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }

            if (vm.vcodeNum.length<1 || vm.vcodeNum =="") {
                vm.msg.warning = true;
                vm.msg.message = "请输验证码";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            // getmobileVcode
            RegisterService.checkSms(vm.vcodeNum, vm.account).then(function (retData) {
                if (retData.code != 200) {
                    alert(retData.message);
                    console.log(retData.message);
                    vm.otherMobile = $sessionStorage.otherMobile;
                    vm.vcodeTitle = "验证码";
                    vm.vcodeCss = "";
                    vCodeWait =0;
                    vm.vcodeNum = "";
                    return
                }
                MyService.updateMemberInfo(cardId, token, {otherMobile: vm.account}).then(function (retData) {
                    if (retData.code != 200) {
                        alert(retData.message);
                        console.log(retData.message);
                        vm.otherMobile = $sessionStorage.otherMobile;
                        vm.vcodeTitle = "验证码";
                        vm.vcodeCss = "";
                        vCodeWait =0;
                        vm.vcodeNum = "";



                        return
                    }
                    vm.showDialog = false;
                    alert("修改成功!");
                    vm.vcodeTitle = "验证码";
                    vm.vcodeCss = "";
                    vCodeWait =0;
                    vm.vcodeNum = "";
                    $sessionStorage.otherMobile = vm.account;
                    vm.account = "";
                    vm.otherMobile = $sessionStorage.otherMobile;

                })
                // $sessionStorage.otherMobile = vm.otherMobile;
            })


        }
        function onKeyPressUpdateMemberName(event,newName) {
            var keycode = window.event ? event.keyCode : event.which;
            if (keycode == 13) {
                if(!newName){
                    return
                }
                MyService.updateMemberInfo(cardId, token, {name: newName}).then(function (retData) {
                    if (retData.code != 200) {
                        alert(retData.message);
                        console.log(retData.message);
                        return
                    }
                    $sessionStorage.memberName = newName;
                    event.target.blur();
                })
            }
        }

        function updateGender(newGender) {
            console.log(123);
            MyService.updateMemberInfo(cardId, token, {sex: newGender}).then(function (retData) {
                if (retData.code != 200) {
                    alert(retData.message);
                    console.log(retData.message);
                    return
                }
                $sessionStorage.sex = newGender;
            })
        }

        function updateBirthday() {
            var datetime = vm.memberBirthday;
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            var day = datetime.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            var params = {
                birthday: [year, month, day].join("-"),
                birthday2: [month, day].join("-")
            };

            MyService.updateMemberInfo(cardId, token, params).then(function (tranData) {
                if (tranData.code != 200) {
                    alert(tranData.message);
                    console.log(tranData.message);
                    vm.memberBirthday = "";
                    return
                }
                $sessionStorage.birthday = params.birthday;
                $sessionStorage.birthday2 = params.birthday2;
                vm.memberBirthday = params.birthday;
            })
        }

        function goLevelDetail() {
            $location.url("/memberLevelDetail?storeId=" + storeId+ "&theme=" + theme);
        }

        function goBack() {
            $location.url("/my?storeId=" + storeId+ "&theme=" + theme);
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

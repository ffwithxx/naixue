(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaRegisterController', HeyTeaRegisterController);

    /** @ngInject */
    HeyTeaRegisterController.$inject = ['$interval', '$timeout', '$location', 'RegisterService', 'UtilService','$sessionStorage','LoginService','SessionStorageService','$scope'];

    function HeyTeaRegisterController($interval, $timeout, $location, RegisterService, UtilService,$sessionStorage,LoginService,SessionStorageService,$scope) {
        var waitSec = 60;
         var send = "false";
        var ischange = false;
         var  csessionid;
        var  sig;
        var tokenStr;
        var scene;
        var vCodeWait = waitSec;
        var storeId = $sessionStorage.storeId;
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
        vm.onPwdChange=onPwdChange;
        vm.doLogin=doLogin;
        // vm.changedate=changedate;
        // vm.sexClick=sexClick;
        vm.goBuy = goBuy;
        // vm.birthday =new Date("1995-01-01T00:00:00.000Z");
        vm.vcardNum = $sessionStorage.dengLuID || "" ;
        vm.vpwd = $sessionStorage.pwd || "";
        ali()

        $("#USER_AGE").change(function(){
            if (!ischange){
                alert("生日信息一经设置无法修改，请谨慎选择！")
                ischange = true
            }
        });

        document.getElementById("sexChange").addEventListener("click",function(event){
                        document.getElementById("sex").style.display="block";;
        },false);
        document.getElementById("sex-close").addEventListener("click",function(event){
            document.getElementById("sex").style.display="none";;
    },false);
        document.getElementById("girl").addEventListener("click",function(event){
           vm.gender = "1";
            document.getElementById("sex-input").innerHTML="女";
            document.getElementById("sex").style.display="none";;
        },false);
        document.getElementById("boy").addEventListener("click",function(event){
            vm.gender = "0";
            document.getElementById("sex-input").innerHTML="男";
            document.getElementById("sex").style.display="none";;
        },false);
//         $(".sex-box").click(function(){
//             document.getElementById("sex").style.display="block";
//         });
        function goBack() {
            $location.url('/loginByVKApiHeyTea?storeId=' + storeId+'&theme=heytea');
        }
        function onPwdChange(item) {
            if (isNaN(item)) {
                vm.vpwd = item.substring(0, item.length - 1);
                return
            }
            if (item.length > 6) {
                vm.vpwd = item.substring(0, item.length - 1);
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
        function countDown() {
            var timePromise = $interval(function () {
                if (vCodeWait <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = undefined;
                    vCodeWait = waitSec;
                    vm.vcodeTitle = "重新发送";
                    vm.vcodeCss = "";
                    send = "false";
                } else {
                    vm.vcodeTitle = "重发(" + vCodeWait + ")";
                    vCodeWait--;
                    vm.vcodeCss = "heycha_greyout";
                }
            }, 1000, 100);

        }
        function doLogin(card, pwd, redirect) {
            var params = {mobile: card, password: pwd, openId: openId};
            LoginService.loginHeyteaByVKApi(storeId, params).then(function (data) {
                if (data.code != 200) {
                    if (data.code = 1351) {
                        $location.url('/heytea-register?storeId=' + storeId);

                    }
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

                var timestamp = formatDateTime(data.data.activated);
                SessionStorageService.setOneSessionStorage("activated", timestamp);
                SessionStorageService.setOneSessionStorage("cardId", data.cardId);
                SessionStorageService.setOneSessionStorage("token", data.token);
                SessionStorageService.setOneSessionStorage("levelName", data.data.levelName);
                SessionStorageService.setAllSessionStorage(data.data, function (res) {
                    $sessionStorage.memberName = $sessionStorage.name;
                    $sessionStorage.activated = timestamp;
                });

                var url = $sessionStorage.redirectUrl;
                if (url != "/heytea-myPayCode" && url != "/heytea-pointShop") {
                    url = "";
                }
                if (url) {
                    $location.url(url + '?storeId=' + storeId);
                } else {
                    $sessionStorage.showSplash = true;
                    $sessionStorage.showagreeMent = true;
                    $location.url('/heytea-my?storeId=' + storeId);
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

        function goBuy() {
            $location.url('/heytea-buy?storeId=' + storeId+ "&remark=" + "heytea-register");
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
        function getVcode() {
            if(!vm.mobile){
                return
            }
            if (vm.mobile.length != 11) {
                vm.msg.warning = true;
                vm.msg.message = "手机号码有误";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            if (send == "false"){
                document.getElementById("star-dialog").style.display="block";;
                return
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
                    return;
                }
                ali()
                countDown();

            }, function (e) {
                alert(e.message);
            });
        }

        function submit() {

            vm.birthday =  $("#USER_AGE").val();

            if (!vm.mobile || !vm.vcode || !vm.birthday || !vm.name || !vm.gender || !vm.vcardNum ||!vm.vpwd) {
                vm.msg.warning = true;
                vm.msg.message = '请填写所有星号项';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (vm.vpwd.length != 6) {
                vm.msg.warning = true;
                vm.msg.message = '密码只能为6位数字';
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
            //
            // if (month < 10){
            //     month = "0" + month;
            //
            // }
            // if (day < 10){
            //     day = "0" + day;
            // }

            // var y = vm.birthday.getFullYear();
            // var m = vm.birthday.getMonth() + 1;
            // m = m < 10 ? '0' + m : m;
            // var d = vm.birthday.getDate();
            // d = d < 10 ? ('0' + d) : d;
            // // vm.birthday = [y, m, d].join("-");
            // var  bir = [y, m, d].join("-");
            var pra = {
                "mobile":vm.mobile,
                "vcode":vm.vcode,
                "birthday":vm.birthday,
                "name":vm.name,
                "gender":vm.gender,
                "vcardNum":vm.vcardNum,
                "vpwd":vm.vpwd,


            }
            RegisterService.register(storeId, pra).then(function (data) {
                if (data.code != 200) {
                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
                doLogin(vm.vcardNum, vm.vpwd);
                // UtilService.showToast(vm, "激活成功", function () {
                //
                //
                //
                //
                //
                //         $location.url('/loginByVKApiHeyTea?storeId=' + storeId);
                //     }
                // );
            }, function (e) {
                alert(e.message);
            });

            // $location.url('/heytea-registerWithPwd?storeId=' + storeId
            //     + '&mobile=' + vm.mobile
            //     + '&vcode=' + vm.vcode
            //     + '&birthday=' + vm.birthday.toLocaleDateString().replace(/\//g, "-")
            //     + '&gender=' + vm.gender
            //     + '&name=' + vm.name
            // );
        }




        function ali() {
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
                    // console.log(data.csessionid);
                    // console.log(data.sig);
                    // console.log(nc_token);
                    $timeout(function () {
                        document.getElementById("star-dialog").style.display="none";;
                        getVcode()
                    }, 1000);


                    console.log(vm.showdom);
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
        }


        $scope.reloadRoute = function () {
            $window.location.reload();

        };
        $(function () {
            var currYear = (new Date()).getFullYear();
            var opt={};
            opt.date = {preset : 'date'};
            opt.datetime = {preset : 'datetime'};
            opt.time = {preset : 'time'};
            opt.default = {
                theme: 'android-ics light', //皮肤样式
                display: 'modal', //显示方式
                mode: 'scroller', //日期选择模式
                dateFormat: 'yyyy-mm-dd',
                lang: 'zh',
                showNow: false,
                nowText: "今天",
                multiSelect: true,
                startYear: currYear - 50, //开始年份
                endYear: currYear + 1, //结束年份
                // date:new Date('1995','01','01')
            };

            $("#USER_AGE").mobiscroll($.extend(opt['date'], opt['default']));

        });


    }
})();



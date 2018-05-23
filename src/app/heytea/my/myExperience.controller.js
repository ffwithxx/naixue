/**
 * Created by fengli on 17/8/9.
 */
/**
 * Created by ganyang on 2017/3/22.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMyExperienceController', HeyTeaMyExperienceController);

    HeyTeaMyExperienceController.$inject = ['$sessionStorage', '$location', '$timeout', 'PointShopService', 'lodash'];

    /** @ngInject */
    function HeyTeaMyExperienceController($sessionStorage, $location, $timeout, PointShopService, lodash) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var type = $location.search().type;
        var vm = this;
        vm.levelName = $sessionStorage.levelName;
        vm.name = $sessionStorage.memberName;
        vm.cardType = $sessionStorage.cardType || '普通卡';
        vm.cardId = $sessionStorage.cardId;
        vm.pointsRecords = [];
        vm.currentPoints = $sessionStorage.point || 0;
        vm.experience = $sessionStorage.experience ||0;
        // alert("经验值"+vm.experience)
        vm.goBack = goBack;
        vm.goPoint = goPoint;
        var creatTime = $sessionStorage.activated  ;
        var creatOne = creatTime.split(" ")[0];
        var  creatonearr = creatOne.split("-");
        var creatTwoyear =parseInt(creatonearr[0])  + 1;
        var creatTwo = creatTwoyear +"-"+creatonearr[1]+"-"+creatonearr[2];
        vm.timeStr ="累计积分周期:"+ creatOne +"至" +creatTwo;


        // function formatDateTime(inputTime) {
        //
        //
        //     var date = new Date(inputTime);
        //     var y = date.getFullYear();
        //     var m = date.getMonth() + 1;
        //     m = m < 10 ? ('0' + m) : m;
        //     var d = date.getDate();
        //     d = d < 10 ? ('0' + d) : d;
        //     var h = date.getHours();
        //     h = h < 10 ? ('0' + h) : h;
        //     var minute = date.getMinutes();
        //     var second = date.getSeconds();
        //     minute = minute < 10 ? ('0' + minute) : minute;
        //     second = second < 10 ? ('0' + second) : second;
        //     return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        // };
        // alert("cardId"+cardId)
        // alert("token"+token)
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }


        PointShopService.getMyPointsRecords(cardId, token).then(function (data) {


            if (data.code != 200) {
                alert(data.message);
                vm.msg.warning = true;
                vm.msg.message = data.message;
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            // alert("数据"+data)




            if (data.data.length >0) {

                vm.pointsRecords = data.data
            }


            // alert("数据data"+data.data.length)
            // alert("数据data"+data.levels.length)


            vm.leve = data.levels;


            if (vm.experience <= vm.leve[1].lowerLimit) {

                var  r  =  vm.experience / vm.leve[1].lowerLimit;
                var s = document.getElementById("oneLine");
                var w = s.offsetWidth; //宽度
                var  d  = r*w ;
                document.getElementById("oneLineSon").style.width = d +"px";
                var optionValue= vm.leve[1].lowerLimit - vm.experience;
                vm.option ="当前经验值"+vm.experience+  "，距离高级会员还差"+optionValue ;
                document.getElementById("oneqi").style.backgroundImage='url(./assets/images/snow/19.png)';
                document.getElementById("oneLine").style.width = s +"px";

            }else if (vm.experience <=vm.leve[2].lowerLimit) {



                var  r  = (vm.experience-vm.leve[1].lowerLimit) / (vm.leve[2].lowerLimit - vm.leve[1].lowerLimit);
                var s = document.getElementById("oneLine");
                var w = s.offsetWidth; //宽度
                var  d  = r*w;
                document.getElementById("oneLineSon").style.width = w +"px";
                document.getElementById("twoLineSon").style.width =  d+"px";
                var optionValue= vm.leve[2].lowerLimit - vm.experience;
                vm.option = "当前经验值"+vm.experience+ "，距离超级会员还差"+optionValue ;
                document.getElementById("oneqi").style.backgroundImage='url(./assets/images/snow/19.png)';
                document.getElementById("twoqi").style.backgroundImage='url(./assets/images/snow/19.png)';
                // alert(d);
            }else  {
                var s = document.getElementById("oneLine");
                var w = s.offsetWidth; //宽度
                document.getElementById("oneLineSon").style.width = w +"px";
                document.getElementById("twoLineSon").style.width = w +"px";
                vm.option = "当前经验值"+vm.experience+ "，您已是超级会员" ;
                document.getElementById("oneqi").style.backgroundImage='url(./assets/images/snow/19.png)';
                document.getElementById("twoqi").style.backgroundImage='url(./assets/images/snow/19.png)';
                document.getElementById("threeqi").style.backgroundImage='url(./assets/images/snow/19.png)';
            }
            vm.TwoValue = vm.leve[1].lowerLimit;
            vm.threeValue = vm.leve[2].lowerLimit;

        });




        function goBack() {
            if (type == "member") {
                $location.url('/heytea-memberInfo?storeId=' + storeId + '&theme=heytea');
            }else {
                $location.url('/heytea-my?storeId=' + storeId + '&theme=heytea');
            }

        }
  function goPoint() {
      $location.url('/heytea-integral?storeId=' + storeId + '&theme=heytea');
  }

    }
})();

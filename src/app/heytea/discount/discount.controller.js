(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaDiscountController', HeyTeaDiscountController);

    HeyTeaDiscountController.$inject = ['$location', '$sessionStorage', 'MyService', 'lodash',"SessionStorageService"];

    /** @ngInject */
    function HeyTeaDiscountController($location, $sessionStorage, MyService, lodash,SessionStorageService) {
        var storeId = $sessionStorage.storeId;
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var  leveId = $sessionStorage.levelId;
        var bgArr = ["./assets/images/snow/quan1.png","./assets/images/snow/quan2.png","./assets/images/snow/quan3.png","./assets/images/snow/quan4.png","./assets/images/snow/quan5.png","./assets/images/snow/quan6.png"];
        var vm = this;
        vm.showEmptyMsg = false;
        vm.active = 'one';
        vm.switchTab = switchTab;
        vm.goBack = goBack;
        vm.getDays = getDays;
        vm.note = note;
        //init list
        vm.switchTab('one');
        vm.openTaste=openTaste;
        var levelInterests = 0;
        function openTaste(p) {
            // 有效期:{{li.beginTime}}至{{li.endTime}}
            var dayCount = getDays(p.beginTime,p.endTime);
            var timeStr;
            var st = days(p.endTime);
            if  (dayCount <= 1) {
                timeStr  = "有效期:" + p.beginTime;
            }else {
                timeStr = "有效期:" + p.beginTime + "至" + st;
            }
            var des = p.remark;
            if (!des){
                des = "不能与其他抵用券同时用";

            }
            SessionStorageService.setOneSessionStorage("discountRemark", des);
            $location.url('/heytea-discount-detail?storeId=' + storeId
                + "&remark=" + des+ "&title=" + p.name +"&time=" +timeStr +"&url=" +p.url+"&ishare=" +p.isShare
            );
        }
        function note(remark) {
            var remarkStr ;
            if (remark == "null" ||remark == "" || !remark) {
                remarkStr = "不能与其他抵用券同时用";
            }else  {
                remarkStr = remark.replace(/<\/br>/g, "\n");
            }
            return remarkStr;
        }

        Date.prototype.format = function(fmt) {
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var k in o) {
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        }
        function days(strDateEnd) {
            // var a = strDateEnd.split(" ");
            // var b = a[0].split("-");
            // var c = a[1].split(":");
            // var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);

            var date = new Date(strDateEnd);
            var preDate = new Date(date.getTime() - 24*60*60*1000); //前一天
            var str=preDate.format("yyyy-MM-dd");
            // document.write(str)
            // alert(str)
            return str;
        }
        function getDays(strDateStart,strDateEnd){
            var strSeparator = "-"; //日期分隔符
            var oDate1;
            var oDate2;
            var iDays;
            oDate1= strDateStart.split(strSeparator);
            oDate2= strDateEnd.split(strSeparator);
            var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
            var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
            iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
            return iDays ;
        }
        function getList(flag) {
            vm.showEmptyMsg = false;
            vm.list = [];
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.levelPrivileges(cardId,storeId,token).then(function (res) {

                if (res.code == 200) {
                   levelInterests = res.data.levelInterests;
                    if (levelInterests === 1 &&  vm.active ==='one' ){
                        vm.levelConsumptionCount = res.data.levelConsumptionCount;
                        vm.cardConsumptionCount = res.data.cardConsumptionCount;
                        vm.ticketName = res.data.ticketName;
                        vm.showBlack = true;
                        var leve = res.data.levelConsumptionCount - res.data.cardConsumptionCount;
                        vm.leveCount = "再消费"+leve+"次";
                        vm.ticketNameStr = "获得"+res.data.ticketCount+"张"+"【"+res.data.ticketName+"】";
                    }
                }


            })

            MyService.getDiscountCouponList(cardId, storeId, token, flag).then(function (res) {

                if (res.data.length === 0) {
                    vm.showEmptyMsg = true;
                    if (flag == 'bleft') {
                        vm.noDataMsg = '亲，没有未使用的优惠券噢~';
                    }
                    if (flag == 'bcenter') {
                        vm.noDataMsg = '亲，没有已使用的优惠券噢~';
                    }
                    if (flag == 'bright') {
                        vm.noDataMsg = '亲，没有已过期的优惠券噢~';
                    }
                }
                var tempArr = lodash.groupBy(res.data, 'id');

                for (var i = 0; i < res.data.length; i++) {
                    var li = res.data[i];
                    var day = getDays(li.beginTime,li.endTime);

                    var timeStr;
                    var st = days(li.endTime);
                    if  (day <= 1) {
                        timeStr  = "有效期:" + li.beginTime;
                    }else {
                        timeStr = "有效期:" + li.beginTime + "至" + st;
                    }
                    li.url="";
                   if (li.templateId == 2905 ){
                        li.url = bgArr[0];
                   }else if (li.templateId == 2904 ) {
                        li.url = bgArr[1];
                   }else if (li.templateId == 2910 ) {
                       li.url = bgArr[2];
                   }else if (li.templateId == 2911 ) {
                       li.url = bgArr[3];
                   }else if (li.templateId == 2907 ) {
                       li.url = bgArr[4];
                   }else if (li.templateId == 2906|| li.templateId == 2908   ) {
                       li.url = bgArr[5];
                   }else {
                       li.url = bgArr[0];
                   }


                    li.dateStr = timeStr;

                }



                lodash.forEach(tempArr, function (v, k) {
                    v[0].nums = v.length;
                    vm.list.push(v[0]);

                    //     var arr = lodash.groupBy(v, 'endTime');
                    //     var j;
                    // lodash.forEach(arr, function (m, n) {
                    //     m[0].nums = m.length;
                    //     vm.list.push(m[0]);
                    // });

                });
            });
        }
        Date.prototype.format = function(fmt) {
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var k in o) {
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        }
        function days(strDateEnd) {
            // var a = strDateEnd.split(" ");
            // var b = a[0].split("-");
            // var c = a[1].split(":");
            // var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);

            var date = new Date(strDateEnd);
            var preDate = new Date(date.getTime() - 24*60*60*1000); //前一天
            var str=preDate.format("yyyy-MM-dd");
            // document.write(str)
            // alert(str)
            return str;
        }
        function switchTab(tab) {
            vm.active = tab;
            //filter data
            if (tab === 'one') {
                //164
                //116


                getList('bleft');
            } else if (tab === 'two') {
                getList('bcenter');
                vm.showBlack = false;
            } else {
                vm.showBlack = false;
                getList('bright');
            }
        }

        function goBack() {
            $location.url("/heytea-my?storeId=" + storeId);
        }
    }
})();

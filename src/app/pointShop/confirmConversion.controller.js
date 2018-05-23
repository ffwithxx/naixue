(function () {
    'use strict';

    angular
        .module('vk')
        .controller('ConfirmConversionController', ConfirmConversionController);

    ConfirmConversionController.$inject = ['$location', '$sessionStorage', 'PointShopService', 'ShoppingService','SessionStorageService','UtilService','$timeout','$interval'];

    /** @ngInject */
    function ConfirmConversionController($location, $sessionStorage, PointShopService, ShoppingService,SessionStorageService,UtilService,$timeout,$interval) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var itemId = $location.search().itemId;
        var openId = $sessionStorage.weChatOpenId;
        var curUrl = location.href;
        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.point = $sessionStorage.point;
        vm.goBack = goBack;
        vm.onStoreClick = onStoreClick;
        vm.confirm = confirm;
        vm.selfget = selfget;
        vm.Courier = Courier;
        vm.getvalue = getvalue;
        vm.cardPay = cardPay;
        vm.weChatPay = weChatPay;
        vm.yun = yun;
        var discount;
        var  zheCount;
        var allPrice;
        vm.zhePrice;
        var freightPrice;
        var payPrice;
        var  resdata;
        var theme = $sessionStorage.theme;
        discount = $sessionStorage.discount;
        if (discount == "null" || discount == "" || !discount) {
            discount = 10;
        }

        function selfget() {
           vm.getWay = 1;
            vm.sumPrice =  "￥" + payPrice;
        }
        function Courier() {
          vm.getWay = 2;
            allPrice =  freightPrice +payPrice;
            vm.sumPrice =  "￥" + allPrice;
        }

        function cardPay() {
            vm.payType = 2;
        }
        function weChatPay() {
            vm.payType = 1;
        }



        PointShopService.getItemDetail(token, cardId, itemId).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                return
            }
            vm.detail = data.data;
            if (data.data.type == 0) {
                vm.getWay = 0;
            }else  {
                vm.getWay = 1;

                if (!vm.selfShow   ){
                    vm.getWay = 2;



                }

            }

            if (data.data.payType == 0) {
                vm.payType = 3;
                vm.zhePrice = 0;
                zheCount = 0;
                payPrice = 0;
                if (theme!= "black") {
                   document.getElementById("current").style.color = "transparent";
                }else {
                 document.getElementById("one").style.color = "transparent";
                }


            }else  {
                vm.payType = 2;
                if(data.data.isLevelDiscount == 0) {
                    vm.zhePrice = 0;
                    zheCount = 0;
                    payPrice = data.data.price;
                    if (theme!= "black") {
                      document.getElementById("current").style.color = "transparent";
                    }else {
                        // document.getElementById("current").style.color = "transparent";
                    document.getElementById("one").style.color = "transparent";
                    }

                }else {
                    if (theme == "black") {
                        document.getElementById("current2").style.width = "100px";
                       document.getElementById("one").style.color = "#878484"
                    }else  {
                       document.getElementById("current").style.color = "#878484"

                    }

                    zheCount = toDecimal(data.data.price - discount * data.data.price * 0.1);
                    payPrice = toDecimal(data.data.price - zheCount);
                    vm.zhePrice =zheCount;
                }



            }
            // if (vm.getWay == 1){
            //     vm.sumPrice =  "￥" + payPrice;
            // }else if(vm.getWay == 2){
            //     vm.sumPrice =  "￥" + allPrice;
            // }
            yun();
        });

        function yun() {
            PointShopService.getStoreFreight(token, cardId, storeId).then(function (res) {
                if (res.code !=200) {
                    vm.msg.warning = true;
                    vm.msg.message = res.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
                resdata = res;

                var fre;
                var money;
                var state;
                if (!res.data || res.data == null){
                    fre = 0;
                    money = 0;
                    state = 0;
                }else {
                     fre = res.data.freight;
                     money = res.data.freeMoney;
                     state = res.data.state;
                }
                //开始包邮  满足包邮金额 或者为积分支付
                if ((payPrice >= money && state == 1) || vm.payType == 0){

                    vm.freight = "免邮";
                     freightPrice = 0;

                    vm.sumPrice =  "￥" + payPrice;
                    allPrice =  payPrice;

                }else if ((payPrice < money && state ==1) || state == 0){
                    //没有开启包邮
                    vm.freight = "￥" + fre;
                    if  (fre == 0){
                        vm.freight = "包邮";
                    }
                    freightPrice =fre;

                    if (vm.getWay == 2) {
                        allPrice =  fre +payPrice;
                        vm.sumPrice =  "￥" + allPrice;

                    }else {
                        allPrice =  payPrice;
                        vm.sumPrice =  "￥" + allPrice;
                    }

                }

            });
        }



        function getvalue(item) {
            if  (!item) {
                return
            }
            if (item.payType == 0) {
                return item.point;
            }else  {

                return "￥"+item.price;
            }

        }

        function toDecimal(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return;
            }
            f = Math.round(x*100)/100;
            return f;
        }
        var parma = {
            distance: 9999999999,  //10KM
            isTakeaway: 1,//外卖店
            latitude: $sessionStorage.latitude || 0,
            longitude: $sessionStorage.longitude || 0
            // latitude: 0,
            // longitude: 0
        };
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        ShoppingService.getStores(storeId, token,cardId, parma).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                console.log(data.message);
                return
            }

            var obj = data.data;
            angular.forEach(obj, function (each) {
                each.address = each.address || "暂无地址";
                each.logo = each.logo || "http://img0.imgtn.bdimg.com/it/u=2528250507,4034175189&fm=11&gp=0.jpg";
                each.star = each.star || 5;
                each.stars = new Array(parseInt(each.star));
                each.unstars = new Array(5 - parseInt(each.star));
                each.tel = each.tel || "02865291601";
                each.businessHourss = each.businessHourss || "00:00 至 00:00"
            });
            var arr = new Array();
            arr = data.data;

           if (arr.length > 0) {
               vm.store = data.data[0];
               vm.selfShow = true;
               vm.stores = data.data;

           }else {

               vm.selfShow = false;

           }



        }, function (e) {
            //error msg
        });


        function goRecord() {
            $location.url("/conversionRecord?storeId=" + storeId);
        }
        function goSuccess() {
            $location.url("/exchangeSuccess?storeId=" + storeId);
        }
        function onStoreClick(item) {
            vm.store = item;
            vm.showStoreListDialog = false
        }

        function goBack() {
            if(vm.showStoreListDialog){
                vm.showStoreListDialog = false;
                return
            }
            $location.url("/pointShop?storeId=" + storeId);
        }

        function confirm() {
            var data;
            console.log("123");

            if (vm.getWay == 0 ) {
                data = {"id":itemId,"payType":vm.payType,"storeId":storeId,"getWay":vm.getWay,"levelDiscount":zheCount};
            }else if (vm.getWay == 1){

                if (vm.stores == true) {
                    data = {"id":itemId,"payType":vm.payType,"storeId":vm.store.id,"getWay":vm.getWay,"levelDiscount":zheCount};

                }else {
                    data = {"id":itemId,"payType":vm.payType,"storeId":storeId,"getWay":vm.getWay,"levelDiscount":zheCount};
                }
            }else {

                data = {"id":itemId,"payType":vm.payType,"storeId":storeId,"getWay":vm.getWay,"name":vm.name,"mobile":vm.mobile,"remark":vm.address,"levelDiscount":zheCount,freight:freightPrice};
                if (!vm.name ||!vm.mobile ||!vm.address) {
                    alert("请完整填写快递信息！");
                    return
                }
            }

            if(cardId =="" ||cardId=="null"||!cardId){
                alert("cardId为空，请重新登录");
                return
            }
            PointShopService.pointProduct(token,cardId,data).then(function (data) {
                //go success
                if (data.code != 200) {
                    alert(data.message);
                    return
                } else {

                    if (vm.payType!= 1){
                        var  data2 = {"id":data.data};
                        PointShopService.goExchange(token,cardId,data2).then(function (data) {
                            //go success
                            if (data.code != 200) {
                                alert(data.message);
                                return
                            }

                            SessionStorageService.setOneSessionStorage("point", data.data.point);
                            UtilService.showToast(vm, "兑换成功",goSuccess());

                        });
                    }else  {


                        var  data3 = {"parentId": storeId,"body":"积分商城","amount":allPrice*100,"openId":openId,"curUrl":curUrl,"orderId":data.data};
                        PointShopService.pointProductwxPay(token,cardId,data3).then(function (data) {
                            //go success
                            if (data.code != 200) {
                                alert(data.message);
                                return
                            }
                            var config = {
                                debug: false,
                                appId: data["signData"].appId,
                                timestamp: data["signData"].timestamp,
                                nonceStr: data["signData"].nonceStr,
                                signature: data["signData"].signature,
                                jsApiList: ['checkJsApi', 'chooseWXPay']
                            };
                            wx.config(config);
                            wx.ready(function () {
                                wx.chooseWXPay({
                                        debug: false,
                                        timestamp: data["payData"].timeStamp,
                                        nonceStr:  data["payData"].nonceStr,
                                        package: data["payData"].prepay_id,
                                        signType: data["payData"].signType,
                                        paySign: data["payData"].paySign,
                                        success: function (res) {

                                            UtilService.showToast(vm, "支付成功",goRecord());
                                            // alert('支付成功',  $location.url("/conversionRecord?storeId=" + storeId));
                                            // $location.url("/conversionRecord?storeId=" + storeId);





                                        },
                                        fail: function (res) {
                                            // UtilService.showToast(vm, "充值失败" + JSON.stringify(res));
                                            alert('支付失败', res);
                                        }
                                    }
                                )
                            })
                        });

                    }

                }

                // $location.url("/exchangeSuccess?storeId=" + storeId);
            });
            //
            // PointShopService.goExchange(token,cardId,data).then(function (data) {
            //     //go success
            //     if (data.code != 200) {
            //         if (data.code == 1007) {
            //             alert("积分不足,无法兑换.");
            //             return
            //         }
            //         alert(data.message);
            //         return
            //     }
            //     $sessionStorage.point = $sessionStorage.point - vm.detail.point;
            //     vm.point = $sessionStorage.point;
            //     $location.url("/exchangeSuccess?storeId=" + storeId);
            // });
            //TODO
            // $location.url("/exchangeSuccess?storeId=" + storeId);
        }
    }
})();

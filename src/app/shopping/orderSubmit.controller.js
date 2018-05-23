(function () {
    'use strict';

    angular
        .module('vk')
        .controller('orderSubmitController', orderSubmitController);

    /** @ngInject */
    orderSubmitController.$inject = ['$location', '$sessionStorage', 'lodash', 'SessionStorageService', 'MyService', 'ShoppingService', 'RunStoreService', 'UtilService', '$timeout'];

    function orderSubmitController($location, $sessionStorage, lodash, SessionStorageService, MyService, ShoppingService, RunStoreService, UtilService, $timeout) {
        var vm = this;
        var urlParam = $location.search();
        var storeId = $sessionStorage.storeId;
        var cardId = $sessionStorage.cardId;
        var leveName =  $sessionStorage.levelName;
        var discount =  $sessionStorage.discount;
        var token = $sessionStorage.token;
        var openId = $sessionStorage.weChatOpenId;
        var subStoreId = urlParam.subStoreId;
        vm.levelName = leveName + "折扣";


        if (!subStoreId) {
            $location.url('/shopping?storeId=' + storeId)
        }

        var times = 0;

        vm.onTextChange = onTextChange;
        vm.saveMemo = saveMemo;
        vm.setTime = setTime;
        vm.selectTicket = selectTicket;
        vm.onTicketSelect = onTicketSelect;
        vm.cancelTicketSelect = cancelTicketSelect;
        vm.confirmTicketSelect = confirmTicketSelect;
        vm.showAddressList = showAddressList;
        vm.addAddress = addAddress;
        vm.onAddressClick = onAddressClick;
        vm.saveAddress = saveAddress;
        vm.checkSimbol = checkSimbol;
        vm.goBack = goBack;
        vm.onAddAddrBackClick = onAddAddrBackClick;
        vm.pay = pay;
        var codeNume = true;
        //设置点单类型
        var orderType = $location.search().orderType;
        if (!orderType) {
            orderType = "takeOut";
        }
        vm.orderType = orderType;


        vm.delivery = 0; //默认值自提
        vm.timeIndex = 15; //默认自提时间15min
        vm.timeBtnActive = {};
        vm.timeBtnActive[vm.timeIndex] = true;
        vm.payType = 1; //默认微信支付
        vm.memoMaxInput = 30;
        vm.memoInputCount = 0;
        vm.actualPay = 0;
        vm.timeObj = {
            15: "15分钟",
            30: "30分钟",
            45: "45分钟",
            60: "1小时",
            90: "1.5小时",
            120: "2小时"
        };
        vm.msg = {
            warning: false,
            message: ''
        };

        vm.storeName = $sessionStorage.storeName;
        var orders = RunStoreService.getOrderItems();
        console.log(orders);

        var newOrders = [];
        lodash.each(orders, function (eachItem) {
            eachItem.total = 1;
            lodash.each(eachItem.tasteList, function (eachTaste) {
                delete eachTaste["$$hashKey"];
            });

            var inNewOrders = lodash.find(newOrders, function (eachNewItem) {
                if (eachNewItem.id != eachItem.id) {
                    return
                }
                if (eachNewItem.tasteList.length != eachItem.tasteList.length) {
                    return
                }
                if (JSON.stringify(eachNewItem.tasteList) != JSON.stringify(eachItem.tasteList)) {
                    return
                }
                lodash.each(eachNewItem.tasteList, function (eachTaste) {
                    if (eachTaste.total) {
                        eachTaste.total += 1;
                    }
                });

                eachNewItem.total += 1;
                return true
            });

            if (!inNewOrders) {
                newOrders.push(eachItem);
            }
        });

        var shouldPay = 0;
        var ordersDetailsList = [];
        var orderProductsList = [];

        lodash.each(newOrders, function (eachItem) {
            var eachPrice = eachItem.price;
            var condimentsList = [];
            var ProductsDetail = {
                id:eachItem.id,
                desc:eachItem.desc,
                name:eachItem.name,
                price:eachItem.price,
                condiments:[]
            }

            var eachOrdersDetail = {

                categoriesId: eachItem.firstCategoriesId || eachItem.secondCategoriesId,
                productId: eachItem.id,
                productName: eachItem.name,
                source: 1, //1 商品来自vcard  2商品来自vivipos
                attributeIds: [],
                attributeNames: [],
                attributePrices: [],
                attributeNums: []
            };

            lodash.each(eachItem.tasteList, function (eachTaste) {
                if (!eachTaste.total) {
                    return
                }
                eachOrdersDetail.attributeIds.push(eachTaste.id);
                eachOrdersDetail.attributeNames.push(eachTaste.name);
                eachOrdersDetail.attributePrices.push(eachTaste.price);
                eachOrdersDetail.attributeNums.push(eachTaste.total);
                eachPrice += eachTaste.price * eachTaste.total;

                // ProductsDetail.condiments.name =  eachTaste.name;
                // ProductsDetail.condiments.price =  eachTaste.price;
                // ProductsDetail.condiments.qty =  eachTaste.total;
                condimentsList = {
                    name : eachTaste.name,
                    price : eachTaste.price,
                    qty : eachTaste.total
                }
                ProductsDetail.condiments.push(condimentsList);
            });
            eachOrdersDetail.price = eachPrice;
            eachOrdersDetail.count = eachItem.total;
            ProductsDetail.qty = eachItem.total;
            eachOrdersDetail.attributeIds = eachOrdersDetail.attributeIds.join(",");
            eachOrdersDetail.attributeNames = eachOrdersDetail.attributeNames.join(",");
            eachOrdersDetail.attributePrices = eachOrdersDetail.attributePrices.join(",");
            eachOrdersDetail.attributeNums = eachOrdersDetail.attributeNums.join(",");
            ordersDetailsList.push(eachOrdersDetail);
            orderProductsList.push(ProductsDetail);
            shouldPay += eachPrice * eachItem.total;
        });

        console.log(newOrders);
        vm.orders = newOrders;
        // vm.shouldPay = shouldPay;
        vm.shouldPay = toDecimal(shouldPay);
        vm.actualPay = toDecimal(discount*0.1*vm.shouldPay);
        vm.cardLevelDiscount =toDecimal(vm.shouldPay- vm.actualPay);

        shouldPay = toDecimal(discount*0.1*shouldPay);

        // getActualPay(shouldPay, "");


        function getActualPay(shouldPay, ticketIds) {
            var param = {
                storeId:storeId,
                couponIds: ticketIds,
                products:orderProductsList
            };
            // ShoppingService.getShouldPayAmount(token, cardId, param).then(function (data) {
            //     if (data.code != 200) {
            //         // alert(data.message);
            //         console.log(data.message);
            //         return
            //     }
            //     vm.cardLevel = data.data.cardLevel || {};
            //     vm.cardLevel.cardLevelDiscount = data.data.cardLevelDiscount;
            //     vm.ticketDiscounts = data.data.ticketDiscounts;
            //     vm.ticketDiscounts.ticketsDetail = data.data.ticketsDetail;
            //     vm.totalDiscount = data.data.discountTotal;
            //     // if(!lodash.isEmpty(vm.ticketDiscounts)){
            //     //     vm.ticketDiscounts = data.data.ticketDiscounts[0];
            //     // }
            //
            //     vm.actualPay = data.data.total;
            //
            // }, function (e) {
            //     //error msg
            // });

            ShoppingService.getShouldPay(param).then(function (data) {
                codeNume = true;
                if (data.code == 1342) {
                    codeNume = false;
                }
                if (data.code != 200) {

                    alert(data.message);
                    console.log(data.message);
                    return
                }
                // vm.cardLevel = data.data.cardLevel || {};
                // vm.cardLevel.cardLevelDiscount = data.data.cardLevelDiscount;
                vm.ticketDiscounts = data.coupons
                ;
                // vm.ticketDiscounts.ticketsDetail = data.data.ticketsDetail;
                // vm.totalDiscount = data.data.discountTotal;
                // if(!lodash.isEmpty(vm.ticketDiscounts)){
                //     vm.ticketDiscounts = data.data.ticketDiscounts[0];
                // }

                vm.actualPay = toDecimal(data.amount*discount*0.1);
                vm.cardLevelDiscount = toDecimal(data.amount- data.amount*0.1*discount);


            }, function (e) {
                //error msg
            });
        }

        function refreshUserInfo() {
            times += 1;
            if (times >= 5) {
                return
            }
            $timeout(function () {
                if(cardId =="" ||cardId=="null"||!cardId){
                    return
                }
                MyService.getMemberInfo(cardId, token).then(function (data) {
                    if (data.code != 200) {
                        alert(data.message);
                        console.log(data.message);
                        return
                    }
                    if ($sessionStorage.balance != data.data.balance || $sessionStorage.point != data.data.point) {
                        SessionStorageService.setAllSessionStorage(data.data, function (res) {
                            $sessionStorage.memberName = $sessionStorage.name;
                            $sessionStorage.cardId = $sessionStorage.id;
                        });

                        vm.balance = $sessionStorage.balance;
                        vm.points = $sessionStorage.point;
                        return
                    }

                    refreshUserInfo()

                });
            }, 2000);

        }

        function pay() {

            if (!codeNume) {

                alert("商品数量不足！");
                return
            }
            var param = {
                openId: openId,
                parentId: storeId,           //总店id
                storeId: subStoreId,         //分店id
                storeName: $sessionStorage.curStore.name,     //店铺名
                point: 0,                    //积分
                itemSubtotal: vm.shouldPay,   //应付
                amount: vm.actualPay,        //实付
                discount: vm.cardLevelDiscount,
                ordersDetailsList: ordersDetailsList,
                ticketsId: "",
                ticketsName: "",
                ticketsDetail: "",
                remark:vm.memoInput
            };

            //外卖, 自提
            if (vm.orderType == "takeOut") {
                if (vm.delivery == 0) {
                    if (!vm.timeIndex) {
                        vm.msg.warning = true;
                        vm.msg.message = "请选择自提时间";
                        $timeout(function () {
                            vm.msg.warning = false;
                            vm.msg.message = '';
                        }, 2000);
                        return
                    }
                    param.isTakeaway = 0;
                    param.orderType = 0;
                    param.address = $sessionStorage.curStore.address;
                    var datetime = new Date();
                    datetime.setTime(lodash.now() + vm.timeIndex * 60 * 1000);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth() + 1;
                    var day = datetime.getDate();
                    var hour = datetime.getHours();
                    var minute = datetime.getMinutes();
                    if (minute < 10) {
                        minute = "0" + minute;
                    }
                    param.sinceTime = [[year, month, day].join("-"), [hour, minute].join(":")].join(" ");

                } else if (vm.delivery == 1) {
                    if (!vm.deliveryAddress) {
                        vm.msg.warning = true;
                        vm.msg.message = "请选择外卖地址";
                        $timeout(function () {
                            vm.msg.warning = false;
                            vm.msg.message = '';
                        }, 2000);
                        return;
                    }
                    param.orderType = 1;
                    param.isTakeaway = 1;
                    param.address = vm.deliveryAddress;
                    param.mobile = vm.deliveryMobile;
                    param.cardName = vm.deliveryName;
                }
            } else if (vm.orderType == "selfOrder") {
                param.orderType = 2;
            } else {
                return
            }

            //支付方式
            param.payType = parseInt(vm.payType);
            if (param.payType == 1) { //微信支付
                param.cardId = cardId;

            } else if (param.payType == 2) { //会员卡支付
                if(!param.mobile){
                    param.mobile = $sessionStorage.mobile;
                }
                param.cardId = cardId;
            } else if (param.payType == 3) { //货到付款

            } else {

            }

            //优惠券
            if (!lodash.isEmpty(vm.ticketDiscounts)) {
                var ticketsId = [];
                var ticketsName = [];
                var ticketsDetail = [];
                var detail ;
                lodash.each(vm.ticketDiscounts, function (each) {
                    detail = each.id + '☆' + each.discount + '☆' + each.name;
                    ticketsId.push(each.id);
                    ticketsName.push(each.name);
                    ticketsDetail.push(detail);
                });
                param.ticketsId = ticketsId.join(",");
                param.ticketsName = ticketsName.join(",");
                param.ticketsDetail = ticketsDetail.join("★");
            }


            //备注
            //TODO


            //获取订单id, 用于支付
            ShoppingService.getTransaction(token, cardId, param).then(function (tranData) {
                if (tranData.code != 200) {
                    alert(tranData.message);
                    console.log(tranData.message);
                    return
                }
                //清空点单的内容
                RunStoreService.setOrderItems([]);

                //货到付款成功了
                if (param.payType == 3) {
                    UtilService.showToast(vm, "下单成功", goOrderRecord(param.orderType));
                    return
                }

                //会员卡支付成功了
                if (param.payType == 2) {
                    var par= {
                        id:tranData.data

                    }
                    ShoppingService.getcardPay(token, cardId,  par).then(function (data) {
                        console.log(data);
                        if (data.code != 200) {
                            console.log(data.message);
                            return
                        }
                     alert("支付成功");
                        UtilService.showToast(vm, "支付成功", goOrderRecord(param.orderType));
                        return

                    }, function (e) {
                        //error msg
                    });

                }


                //微信支付
                if (param.payType == 1) {

                    if (vm.actualPay == 0) {
                        UtilService.showToast(vm, "支付成功", goOrderRecord(param.orderType));
                        return
                    }
                    //启动微信支付
                    var payObj = {
                        body: "微商城下单",
                        amount: parseInt(vm.actualPay * 100), //以分为单位
                        curUrl: $location.absUrl(),
                        orderId: tranData.data
                    };
                    ShoppingService.payWithWeChat(storeId, token, cardId, openId, payObj).then(function (weChatPayData) {
                        console.log(weChatPayData);
                        if (weChatPayData.code != 200) {
                            console.log(weChatPayData.message);
                            return
                        }

                        var config = {
                            debug: false,
                            appId: weChatPayData.signData.appId,
                            timestamp: weChatPayData.signData.timestamp,
                            nonceStr: weChatPayData.signData.nonceStr,
                            signature: weChatPayData.signData.signature,
                            jsApiList: ['checkJsApi', 'chooseWXPay']
                        };
                        wx.config(config);

                        wx.ready(function () {
                            wx.chooseWXPay({
                                    debug: false,
                                    timestamp: weChatPayData.payData.timeStamp,
                                    nonceStr: weChatPayData.payData.nonceStr,
                                    package: weChatPayData.payData.prepay_id,
                                    signType: weChatPayData.payData.signType,
                                    paySign: weChatPayData.payData.paySign,
                                    success: function (res) {

                                        $timeout(function () {
                                            refreshUserInfo();
                                        }, 1000);

                                        UtilService.showToast(vm, "支付成功", goOrderRecord(param.orderType));

                                    },
                                    fail: function (res) {
                                        // UtilService.showToast(vm, "充值失败" + JSON.stringify(res));
                                        alert('支付失败', res);
                                    }
                                }
                            )
                        })
                    }, function (e) {
                        //error msg
                    });
                }

            }, function (e) {
                //error msg
            });

        }

        function showAddressList() {
            if (vm.myAddress) {
                vm.showAddressListDialog = true;
                return
            }
            MyService.getMyAddressList(cardId, token).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return
                }
                vm.myAddress = data.data;
            }, function (e) {
                //error msg
            });
            vm.showAddressListDialog = true;
        }

        function addAddress() {
            vm.showAddressListDialog = false;
            vm.showAddAddressDialog = true;
            vm.address = "";
            vm.city = "";
            vm.mobile = "";
            vm.default = 0;
            vm.name = "";
        }

        function checkSimbol(obj, key) {
            var IllegalString = "[`~!#@$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
            var index = obj[key].length - 1;
            var s = obj[key].charAt(index);
            if (IllegalString.indexOf(s) >= 0) {
                s = obj[key].substring(0, index);
                obj[key] = s;
            }
        }

        function saveAddress() {
            if (!vm.name || !vm.mobile || !vm.address) {
                alert("还有信息未填写");
                return
            }

            if (vm.mobile.toString().length != 11) {
                alert("电话号码不正确");
                return
            }

            vm.isDefault = 0;
            if (vm.default) {
                vm.isDefault = 1;
            }
            MyService.addMyAddress(cardId, token, vm).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    return
                }
                MyService.getMyAddressList(cardId, token).then(function (data) {
                    if (data.code != 200) {
                        alert(data.message);
                        console.log(data.message);
                        return
                    }
                    vm.myAddress = data.data;

                    vm.showAddressListDialog = true;
                    vm.showAddAddressDialog = false;
                }, function (e) {
                    //error msg
                });

                // UtilService.showToast(vm, "保存成功", goBack);
            }, function (e) {
                //error msg
            });
            // vm.showAddressListDialog = true;
            // vm.showAddAddressDialog = false;
        }

        function onAddressClick(eachAddress) {
            vm.deliveryAddress = eachAddress.address;
            vm.deliveryMobile = eachAddress.mobile;
            vm.deliveryName = eachAddress.name;
            vm.showAddressListDialog = false;
        }

        function selectTicket() {
            if (!lodash.isEmpty(vm.tickets) && vm.tickets) {
                vm.showTicketsDialog = true;
                return
            }
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.getDiscountCouponList(cardId, storeId, token, "bleft").then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return;
                }
                //不能选择商品券
                vm.tickets = lodash.filter(data.data, function (each) {
                    return each.templateType != 2
                });

                if (lodash.isEmpty(vm.tickets)) {
                    vm.msg.warning = true;
                    vm.msg.message = "您没有可用的优惠券";
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }

                vm.showTicketsDialog = true;
            });
        }

        function onTicketSelect(each, checked) {
            // vm.currentTicket = each;
            // console.log(vm.currentTicket);

        }

        function cancelTicketSelect() {
            // vm.ticketCount = undefined;
            // vm.currentTicket = undefined;
            // getActualPay(vm.totalPrice, "");
            vm.showTicketsDialog = false;
        }

        function confirmTicketSelect() {
            if (vm.tickets) {
                var selectedTickets = lodash.filter(vm.tickets, function (each) {
                    return each.checked
                });
                if (!selectedTickets || lodash.isEmpty(selectedTickets)) {
                    if (!vm.ticketDiscounts || lodash.isEmpty(vm.ticketDiscounts)) {
                        vm.showTicketsDialog = false;
                        return
                    }
                    vm.ticketCount = "0张";
                    vm.showTicketsDialog = false;
                    getActualPay(vm.shouldPay, "");
                    return
                }

                vm.ticketCount = selectedTickets.length + "张";
                var ticketsIds = [];
                lodash.each(selectedTickets, function (each) {
                    ticketsIds.push(each.id);
                });
                getActualPay(vm.shouldPay, ticketsIds.join(","));
            }
            vm.showTicketsDialog = false;

        }

        function goBack() {
            $location.url('/orderList?storeId=' + storeId + "&subStoreId=" + subStoreId + "&orderType=" + orderType);
        }

        function goOrderRecord(orderType) {
            $location.url("/orderManager?storeId=" + storeId
                + "&orderType=" + orderType);
        }

        function setTime(id) {
            vm.timeBtnActive = {};
            vm.timeBtnActive[id] = true;
            vm.timeIndex = id;
            vm.showTimeDialog = false;
        }

        function onMemClick() {
            vm.showMemoDialog = true
        }

        function saveMemo() {
            // vm.memoDisplay = vm.memoInput;
            // vm.memoInput = "";

            vm.showMemoDialog = false;
        }

        function onTextChange() {
            var count = vm.memoInput.split("");
            vm.memoInputCount = count.length;
            if (count.length > vm.memoMaxInput) {
                count = count.slice(0, vm.memoMaxInput);
                vm.memoInputCount = vm.memoMaxInput;
            }
            vm.memoInput = count.join("");
        }

        function onAddAddrBackClick() {
            vm.showAddAddressDialog = false;
            vm.showAddressListDialog = true;
        }

        function toDecimal(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return;
            }
            f = Math.round(x*100)/100;
            return f;
        }
        // vm.requestStores = requestStores;
        //
        // if (!$sessionStorage.hasStoreLoaded) {
        //     requestStores();
        // }
        //
        // function requestStores() {
        //     ShoppingService.getStores(storeId, token, vm).then(function (data) {
        //         if (data.code != 200) {
        //             alert(data.message);
        //             console.log(data.message);
        //             return
        //         }
        //         SessionStorageService.setOneSessionStorage("hasStoreLoaded", true);
        //
        //     }, function (e) {
        //         //error msg
        //     });
        //
        // }
        //
        // function goStoreDetail(detailInfo) {
        //     $location.url('/storeDetail?info=' + detailInfo);
        // }

    }
})();

(function () {
    'use strict';

    angular
        .module('vk')
        .config(routerConfig);

    bootStrapTheApp.$inject = ['$stateParams', '$rootScope', '$location', '$sessionStorage', 'SessionStorageService'];
    /** @ngInject */
    function bootStrapTheApp($stateParams, $rootScope, $location, $sessionStorage, SessionStorageService) {
        $rootScope.baseURL = window.isDebug ? '/' : '/membershipnaixue/'
        var storeId = $location.search().storeId;
        var theme = $location.search().theme;
        var openId = $sessionStorage.weChatOpenId;

        if (storeId == "4172") {
            document.title = "KOI";
        }else if (storeId == "5411") {
            document.title = "KOI PLUS";
        } else  {
            document.title = "会员中心";
        }
        if (angular.isUndefined(storeId)) {
            $location.url('/noStoreId');
            // window.alert('没有门店ID: ' + $location.absUrl())
            return;
        }
        // SessionStorageService.setOneSessionStorage("storeId", storeId);
        if (angular.isDefined(theme)) {
            SessionStorageService.setOneSessionStorage("theme", theme);
            $rootScope.theme = theme;
        } else if (angular.isDefined($sessionStorage.theme)) {
            $rootScope.theme = $sessionStorage.theme;
        } else {
            SessionStorageService.setOneSessionStorage("theme", 'default');
            $rootScope.theme = 'default';
        }

        //当storeId和seesion中的不一样, 或者token为空, 那就认为需要重新登录.
        if ($sessionStorage.storeId != storeId || !$sessionStorage.token) {
            SessionStorageService.setOneSessionStorage("storeId", storeId);
            SessionStorageService.setOneSessionStorage("token", undefined);
            SessionStorageService.setOneSessionStorage("redirectUrl", $location.path());
            if ($location.path() != "/register") {
                if (!openId && angular.isUndefined($sessionStorage.debug) && !window.isDebug) {
                    $location.url('/loginByWeChat?storeId=' + storeId+ "&theme=" + $rootScope.theme);
                    return;
                }else{
                    $location.url('/loginByVKApi?storeId=' + storeId + "&theme=" + $rootScope.theme);

                    return;
                }
            }
        } else {

        }
    }

    bootStrapThemeApp.$inject = ['$stateParams', '$rootScope', '$location', '$sessionStorage', 'SessionStorageService'];

    function bootStrapThemeApp($stateParams, $rootScope, $location, $sessionStorage, SessionStorageService) {
        $rootScope.baseURL = window.isDebug ? '/' : '/membershipnaixue/'
        var theme = $location.search().theme;
        var storeId = $location.search().storeId;
        // document.title = (storeId === '376' || storeId === '4172') ? "KOI" : "微商城";
        if (storeId == "4172") {
            document.title = "KOI";
        }else if (storeId == "5411") {
            document.title = "KOI PLUS";
        } else  {
            document.title = "会员中心";
        }
        if (angular.isUndefined(storeId)) {
            $location.url('/noStoreId');
            // window.alert('没有门店ID: ' + $location.absUrl())
            return;
        }
        SessionStorageService.setOneSessionStorage("storeId", storeId);

        if (angular.isDefined(theme)) {
            SessionStorageService.setOneSessionStorage("theme", theme);
            $rootScope.theme = theme;
        } else if (angular.isDefined($sessionStorage.theme)) {
            $rootScope.theme = $sessionStorage.theme;
        } else {
            SessionStorageService.setOneSessionStorage("theme", 'default');
            $rootScope.theme = 'default';
        }
    }

    /* HeyTea */
    /** @ngInject */
    bootStrapTheHeyTeaApp.$inject = ['$stateParams', '$rootScope', '$location', '$sessionStorage', 'SessionStorageService'];
    function bootStrapTheHeyTeaApp($stateParams, $rootScope, $location, $sessionStorage, SessionStorageService) {
        $rootScope.baseURL = window.isDebug ? '/' : '/membershipnaixue/'
        document.title = "奈雪の茶";
        var storeId = $location.search().storeId;
        var theme = $location.search().theme;

        if (angular.isUndefined(storeId)) {
            $location.url('/noStoreId');
            // window.alert('没有门店ID: ' + $location.absUrl())
            return;
        }

        SessionStorageService.setOneSessionStorage("theme", 'heytea');
        $rootScope.theme = 'heytea';

        // if (angular.isDefined(theme)) {
        //     SessionStorageService.setOneSessionStorage("theme", theme);
        //     $rootScope.theme = theme;
        // } else if (angular.isDefined($sessionStorage.theme)) {
        //     $rootScope.theme = $sessionStorage.theme;
        // } else {
        //     SessionStorageService.setOneSessionStorage("theme", 'default');
        //     $rootScope.theme = 'default';
        // }

        //当storeId和seesion中的不一样, 或者token为空, 那就认为需要重新登录.
        if ($sessionStorage.storeId != storeId || !$sessionStorage.token) {
            SessionStorageService.setOneSessionStorage("storeId", storeId);
            SessionStorageService.setOneSessionStorage("token", undefined);
            SessionStorageService.setOneSessionStorage("redirectUrl", $location.path());
            $location.url('/loginByVKApiHeyTea?storeId=' + storeId + "&theme=" + $rootScope.theme);
            return;
        } else {

        }
    }

    /** @ngInject */
    bootStrapThemeHeyTeaApp.$inject = ['$stateParams', '$rootScope', '$location', '$sessionStorage', 'SessionStorageService'];
    function bootStrapThemeHeyTeaApp($stateParams, $rootScope, $location, $sessionStorage, SessionStorageService) {
        $rootScope.baseURL = window.isDebug ? '/' : '/membershipnaixue/'
        var theme = $location.search().theme;
        document.title = "奈雪の茶";
        var storeId = $location.search().storeId;
        if (angular.isUndefined(storeId)) {
            $location.url('/noStoreId');
            // window.alert('没有门店ID: ' + $location.absUrl())
            return;
        }
        SessionStorageService.setOneSessionStorage("storeId", storeId);
        SessionStorageService.setOneSessionStorage("theme", "heytea");
        $rootScope.theme = "heytea";

        //     $rootScope.theme = theme;
        // if (angular.isDefined(theme)) {
        //     SessionStorageService.setOneSessionStorage("theme", theme);
        //     $rootScope.theme = theme;
        // } else if (angular.isDefined($sessionStorage.theme)) {
        //     $rootScope.theme = $sessionStorage.theme;
        // } else {
        //     SessionStorageService.setOneSessionStorage("theme", 'heytea');
        //     $rootScope.theme = 'heytea';
        // }
    }

    /** @ngInject */
    function routerConfig( $stateProvider, $urlRouterProvider, $locationProvider) {
        var isEnable = !window.isDebug
        $locationProvider.html5Mode(isEnable);
        $stateProvider
            .state('noStoreId', {
                url: '/noStoreId',
                templateUrl: 'app/noStoreId/noStoreId.html',
                resolve: {
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'app/register/register.html',
                controller: 'RegisterController',
                controllerAs: 're',
                resolve: {
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })

            .state('activation', {
                url: '/activation',
                templateUrl: 'app/register/activation.html',
                controller: 'ActivationController',
                controllerAs: 'atc',
                resolve: {
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('registerWithPwd', {
                url: '/registerWithPwd',
                templateUrl: 'app/register/registerWithPwd.html',
                controller: 'RegisterWithPwdController',
                controllerAs: 'rep',
                resolve: {
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })




            .state('forgetPwd', {
                url: '/forgetPwd',
                templateUrl: 'app/forgetPwd/forgetPwd.html',
                controller: 'ForgetPwdController',
                controllerAs: 'fp',
                resolve: {
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('loginByVKApi', {
                url: '/loginByVKApi',
                templateUrl: 'app/login/loginByVKApi.html',
                controller: 'LoginByVKApiController',
                controllerAs: 'lv',
                resolve: {
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('loginByWeChat', {
                url: '/loginByWeChat',
                templateUrl: 'app/login/loginByWeChat.html',
                controller: 'LoginByWeChatController',
                controllerAs: 'lw',
                resolve: {
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('getUserInfo', {
                url: '/getUserInfo',
                templateUrl: 'app/login/getUserInfo.html',
                controller: 'getUserInfoController',
                controllerAs: 'guic',
                resolve: {
                    // 跳转页面不需要bootstrap
                    // bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('shopping', {
                url: '/shopping',
                templateUrl: 'app/shopping/shopping.html',
                controller: 'ShoppingController',
                controllerAs: 'sc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('storeDetail', {
                url: '/storeDetail',
                templateUrl: 'app/shopping/storeDetail.html',
                controller: 'storeDetailController',
                controllerAs: 'sdc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('addressMap', {
                url: '/addressMap',
                templateUrl: 'app/shopping/addressMap.html',
                controller: 'AddressMapController',
                controllerAs: 'map',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })

            .state('mapNavigation', {
                url: '/mapNavigation',
                templateUrl: 'app/shopping/mapNavigation.html',
                controller: 'MapNavigationController',
                controllerAs: 'mnc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })

            .state('orders', {
                url: '/orders',
                templateUrl: 'app/shopping/orders.html',
                controller: 'ordersController',
                controllerAs: 'odsc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('orderSubmit', {
                url: '/orderSubmit',
                templateUrl: 'app/shopping/orderSubmit.html',
                controller: 'orderSubmitController',
                controllerAs: 'osc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('orderMemo', {
                url: '/orderMemo',
                templateUrl: 'app/shopping/orderMemo.html',
                controller: 'orderMemoController',
                controllerAs: 'omc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('pointShop', {
                url: '/pointShop',
                templateUrl: 'app/pointShop/pointShop.html',
                controller: 'PointShopController',
                controllerAs: 'ps',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('conversionRecord', {
                url: '/conversionRecord',
                templateUrl: 'app/pointShop/conversionRecord.html',
                controller: 'ConversionRecordController',
                controllerAs: 'cr',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('conversionDetail', {
                url: '/conversionDetail',
                templateUrl: 'app/pointShop/conversionDetail.html',
                controller: 'ConversionDetailController',
                controllerAs: 'cd',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('confirmConversion', {
                url: '/confirmConversion',
                templateUrl: 'app/pointShop/confirmConversion.html',
                controller: 'ConfirmConversionController',
                controllerAs: 'cc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('exchangeSuccess', {
                url: '/exchangeSuccess',
                templateUrl: 'app/pointShop/exchangeSuccess.html',
                controller: 'ExchangeSuccessController',
                controllerAs: 'es',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('discountCoupon', {
            url: '/discountCoupon',
            templateUrl: 'app/discountCoupon/discountCoupon.html',
            controller: 'DiscountCouponController',
            controllerAs: 'dcc',
            resolve: {
                bootStrapTheApp: bootStrapTheApp
            }
        })
            .state('couponRedemption', {
                url: '/couponRedemption',
                templateUrl: 'app/discountCoupon/couponRedemption.html',
                controller: 'CouponRedemptionController',
                controllerAs: 'crc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })

            .state('discountCouponDetail', {
                url: '/discountCouponDetail',
                templateUrl: 'app/discountCoupon/discountCouponDetail.html',
                controller: 'DiscountCouponDetailController',
                controllerAs: 'dccd',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('orderManager', {
                url: '/orderManager',
                templateUrl: 'app/orderManager/orderManager.html',
                controller: 'OrderManagerController',
                controllerAs: 'oc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('orderDetail', {
                url: '/orderDetail',
                templateUrl: 'app/orderManager/orderDetail.html',
                controller: 'OrderDetailController',
                controllerAs: 'od',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('orderList', {
                url: '/orderList',
                templateUrl: 'app/shopping/order-list.html',
                controller: 'OrderListController',
                controllerAs: 'ol',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('tradeRecord', {
                url: '/tradeRecord',
                templateUrl: 'app/tradeRecord/tradeRecord.html',
                controller: 'TradeRecordController',
                controllerAs: 'tc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('my', {
                url: '/my',
                templateUrl: 'app/my/my.html',
                controller: 'MyController',
                controllerAs: 'mc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('agreement', {
                url: '/agreement',
                templateUrl: 'app/my/agreement.html',
                controller: 'AgreementController',
                controllerAs: 'amc',
                resolve: {
                    bootStrapTheApp: bootStrapThemeApp
                }
            })
            .state('myBuy', {
            url: '/myBuy',
            templateUrl: 'app/my/myBuy.html',
            controller: 'MyBuyController',
            controllerAs: 'myb',
            resolve: {
                bootStrapTheApp: bootStrapTheApp
            }
        })
            .state('Buy', {
                url: '/Buy',
                templateUrl: 'app/login/Buy.html',
                controller: 'BuyController',
                controllerAs: 'buy',
                resolve: {
                    bootStrapTheApp: bootStrapThemeApp
                }
            })
            .state('memberInfo', {
                url: '/memberInfo',
                templateUrl: 'app/my/memberInfo.html',
                controller: 'MemberInfoController',
                controllerAs: 'mic',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('memberLevelDetail', {
                url: '/memberLevelDetail',
                templateUrl: 'app/my/memberLevelDetail.html',
                controller: 'memberLevelDetailController',
                controllerAs: 'mld',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myExperience', {
                url: '/myExperience',
                templateUrl: 'app/my/myExperience.html',
                controller: 'myExperienceController',
                controllerAs: 'mec',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myAddressList', {
                url: '/myAddressList',
                templateUrl: 'app/my/myAddressList.html',
                controller: 'myAddressListController',
                controllerAs: 'malc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myAddressAddUpdate', {
                url: '/myAddressAddUpdate',
                templateUrl: 'app/my/myAddressAddUpdate.html',
                controller: 'myAddressAddUpdateController',
                controllerAs: 'maauc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myFeedback', {
                url: '/myFeedback',
                templateUrl: 'app/my/myFeedback.html',
                controller: 'myFeedbackController',
                controllerAs: 'mfbc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myAcountSetting', {
                url: '/myAcountSetting',
                templateUrl: 'app/my/myAcountSetting.html',
                controller: 'myAcountSettingController',
                controllerAs: 'masc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myChangePwd', {
                url: '/myChangePwd',
                templateUrl: 'app/my/myChangePwd.html',
                controller: 'myChangePwdController',
                controllerAs: 'mcpc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myLogout', {
                url: '/myLogout',
                templateUrl: 'app/my/myLogout.html',
                controller: 'myLogoutController',
                controllerAs: 'mloc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('my_recharge', {
                url: '/my_recharge',
                templateUrl: 'app/my/myRecharge.html',
                controller: 'myRechargeController',
                controllerAs: 'mrc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myAssetsTransfer', {
                url: '/myAssetsTransfer',
                templateUrl: 'app/my/myAssetsTransfer.html',
                controller: 'myAssetsTransferController',
                controllerAs: 'matc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('barcode', {
                url: '/barcode',
                templateUrl: 'app/discountCoupon/barcode.html',
                controller: 'BarcodeController',
                controllerAs: 'bcc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })
            .state('myPayCode', {
                url: '/myPayCode',
                templateUrl: 'app/my/myPayCode.html',
                controller: 'myPayCodeController',
                controllerAs: 'mpcc',
                resolve: {
                    bootStrapTheApp: bootStrapTheApp
                }
            })


            /*HeyTea route */
            .state('loginByVKApiHeyTea', {
                url: '/loginByVKApiHeyTea',
                templateUrl: 'app/heytea/login/loginByVKApiHeyTea.html',
                controller: 'LoginByVKApiHeyTeaController',
                controllerAs: 'lv',
                resolve: {
                    bootStrapThemeXiChaApp: bootStrapThemeHeyTeaApp
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/heytea/login/loginByWeChatHeyTea.html',
                controller: 'LoginByWeChatHeyTeaController',
                controllerAs: 'lw',
                resolve: {
                    bootStrapThemeXiChaApp: bootStrapThemeHeyTeaApp
                }
            })



            .state('heytea-buy', {
                url: '/heytea-buy',
                templateUrl: 'app/heytea/login/heyteaBuy.html',
                controller: 'HeyTeaBuyController',
                controllerAs: 'hby',
                resolve: {
                    // 跳转页面不需要bootstrap
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })

            .state('heytea-rules', {
                url: '/heytea-rules',
                templateUrl: 'app/heytea/my/rules.html',
                controller: 'HeyTeaRulesController',
                controllerAs: 'hrc',
                resolve: {
                    // 跳转页面不需要bootstrap
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })

            .state('heytea-integral', {
                url: '/heytea-integral',
                templateUrl: 'app/heytea/my/integral.html',
                controller: 'HeyTeaIntegralController',
                controllerAs: 'hig',
                resolve: {
                    // 跳转页面不需要bootstrap
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('heytea-getUserInfo', {
                url: '/heytea-getUserInfo',
                templateUrl: 'app/heytea/login/getUserInfoHeyTea.html',
                controller: 'HeyTeaGetUserInfoController',
                controllerAs: 'guic',
                resolve: {
                    //跳转页面不需要bootstrap
                    // bootStrapThemeApp: bootStrapThemeApp
                }
            })

            .state('heytea-test', {
                url: '/heytea-test',
                templateUrl: 'app/heytea/my/test.html',
                controller: 'HeyTeaTestController',
                controllerAs: 'tec',
                resolve: {
                    // 跳转页面不需要bootstrap
                    bootStrapThemeApp: bootStrapThemeApp
                }
            })
            .state('heytea-register', {
                url: '/heytea-register',
                templateUrl: 'app/heytea/register/register.html',
                controller: 'HeyTeaRegisterController',
                controllerAs: 're',
                resolve: {
                    bootStrapThemeXiChaApp: bootStrapThemeHeyTeaApp
                }
            })
            .state('heytea_recharge', {
                url: '/heytea_recharge',
                templateUrl: 'app/heytea/my/myRecharge.html',
                controller: 'heyteaRechargeController',
                controllerAs: 'mrc',
                resolve: {
                    bootStrapTheApp: bootStrapThemeHeyTeaApp
                }
            })
            .state('heytea-registerWithPwd', {
                url: '/heytea-registerWithPwd',
                templateUrl: 'app/heytea/register/registerWithPwd.html',
                controller: 'HeyTeaRegisterWithPwdController',
                controllerAs: 'rep',
                resolve: {
                    bootStrapThemeXiChaApp: bootStrapThemeHeyTeaApp
                }
            })
            .state('heytea-forgetPwd', {
                url: '/heytea-forgetPwd',
                templateUrl: 'app/heytea/register/forgetPwd.html',
                controller: 'HeyTeaForgetPwdController',
                controllerAs: 'fp',
                resolve: {
                    bootStrapThemeXiChaApp: bootStrapThemeHeyTeaApp
                }
            })

            .state('heytea-pointShop', {
                url: '/heytea-pointShop',
                templateUrl: 'app/heytea/pointShop/pointShop.html',
                controller: 'HeyTeaPointShopController',
                controllerAs: 'ps',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-conversionRecord', {
                url: '/heytea-conversionRecord',
                templateUrl: 'app/heytea/pointShop/conversionRecord.html',
                controller: 'HeyTeaConversionRecordController',
                controllerAs: 'cr',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-conversionDetail', {
                url: '/heytea-conversionDetail',
                templateUrl: 'app/heytea/pointShop/conversionDetail.html',
                controller: 'HeyTeaConversionDetailController',
                controllerAs: 'cd',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-confirmConversion', {
                url: '/heytea-confirmConversion',
                templateUrl: 'app/heytea/pointShop/confirmConversion.html',
                controller: 'HeyTeaConfirmConversionController',
                controllerAs: 'cc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-exchangeSuccess', {
                url: '/heytea-exchangeSuccess',
                templateUrl: 'app/heytea/pointShop/exchangeSuccess.html',
                controller: 'HeyTeaExchangeSuccessController',
                controllerAs: 'es',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-myTradeRecords', {
                url: '/heytea-myTradeRecords',
                templateUrl: 'app/heytea/my/myTradeRecords.html',
                controller: 'HeyTeaMyTradeRecordsController',
                controllerAs: 'tc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-privilege', {
                url: '/heytea-privilege',
                templateUrl: 'app/heytea/privilege/privilege.html',
                controller: 'HeyTeaMyPrivilegeController',
                controllerAs: 'hp',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-privilege-detail', {
                url: '/heytea-privilege-detail',
                templateUrl: 'app/heytea/privilege/privilege-detail.html',
                controller: 'HeyTeaPrivilegeDetailController',
                controllerAs: 'hpd',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-discount', {
                url: '/heytea-discount',
                templateUrl: 'app/heytea/discount/discount.html',
                controller: 'HeyTeaDiscountController',
                controllerAs: 'dcc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-discount-detail', {
                url: '/heytea-discount-detail',
                templateUrl: 'app/heytea/discount/discountDetail.html',
                controller: 'HeyteaDiscountDetailController',
                controllerAs: 'hddc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-myPoints', {
                url: '/heytea-myPoints',
                templateUrl: 'app/heytea/my/myPoints.html',
                controller: 'HeyTeaMyPointsController',
                controllerAs: 'mpc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })

            .state('heytea-myExperience', {
                url: '/heytea-myExperience',
                templateUrl: 'app/heytea/my/myExperience.html',
                controller: 'HeyTeaMyExperienceController',
                controllerAs: 'mer',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-myRights', {
                url: '/heytea-myRights',
                templateUrl: 'app/heytea/my/myRights.html',
                controller: 'HeyTeaMyRightsController',
                controllerAs: 'mrc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-fitStores', {
                url: '/heytea-fitStores',
                templateUrl: 'app/heytea/my/fitStores.html',
                controller: 'HeyTeaFitStoresController',
                controllerAs: 'fsc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-memberInfo', {
                url: '/heytea-memberInfo',
                templateUrl: 'app/heytea/my/memberInfo.html',
                controller: 'HeyTeaMemberInfoController',
                controllerAs: 'mic',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-myPayCode', {
                url: '/heytea-myPayCode',
                templateUrl: 'app/heytea/my/myPayCode.html',
                controller: 'HeyTeaMyPayCodeController',
                controllerAs: 'mpcc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-myChangePwd', {
                url: '/heytea-myChangePwd',
                templateUrl: 'app/heytea/my/myChangePwd.html',
                controller: 'HeyTeaMyChangePwdController',
                controllerAs: 'mcpc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })

            .state('heytea-starShop', {
                url: '/heytea-starShop',
                templateUrl: 'app/heytea/my/starShop.html',
                controller: 'HeyStarShopController',
                controllerAs: 'mss',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })

            .state('heytea-myFeedback', {
                url: '/heytea-myFeedback',
                templateUrl: 'app/heytea/my/myFeedback.html',
                controller: 'HeyTeaMyFeedbackController',
                controllerAs: 'mfbc',
                resolve: {
                    bootStrapTheHeyTeaApp: bootStrapTheHeyTeaApp
                }
            })
            .state('heytea-my', {
                url: '/heytea-my',
                templateUrl: 'app/heytea/my/my.html',
                controller: 'HeyTeaMyController',
                controllerAs: 'mc',
                resolve: {
                    bootStrapThemeXiChaApp: bootStrapThemeHeyTeaApp
                }
            });

            /*bootStrapKOIApp.$inject = ['$rootScope', '$location', '$sessionStorage', 'SessionStorageService'];

            function bootStrapKOIApp($rootScope, $location, $sessionStorage, SessionStorageService) {
                document.title = "KOI";
                var theme = $location.search().theme;
                var storeId = $location.search().storeId;
                if (angular.isUndefined(storeId)) {
                    $location.url('/noStoreId');
                    return;
                }
                SessionStorageService.setOneSessionStorage("storeId", storeId);

                if (angular.isDefined(theme)) {
                    SessionStorageService.setOneSessionStorage("theme", theme);
                    $rootScope.theme = theme;
                } else if (angular.isDefined($sessionStorage.theme)) {
                    $rootScope.theme = $sessionStorage.theme;
                } else {
                    SessionStorageService.setOneSessionStorage("theme", 'default');
                    $rootScope.theme = 'default';
                }
            }
            // KOI route
            $stateProvider
                .state('noStoreId', {
                    url: '/noStoreId',
                    templateUrl: 'app/noStoreId/noStoreId.html',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiRegister', {
                    url: '/koiRegister',
                    templateUrl: 'app/koi/register/register.html',
                    controller: 'RegisterController',
                    controllerAs: 're',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiRegisterWithPwd', {
                    url: '/koiRegisterWithPwd',
                    templateUrl: 'app/koi/register/registerWithPwd.html',
                    controller: 'RegisterWithPwdController',
                    controllerAs: 'rep',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiForgetPwd', {
                    url: '/koiForgetPwd',
                    templateUrl: 'app/koi/forgetPwd/forgetPwd.html',
                    controller: 'ForgetPwdController',
                    controllerAs: 'fp',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiLoginByVKApi', {
                    url: '/koiLoginByVKApi',
                    templateUrl: 'app/koi/login/loginByVKApi.html',
                    controller: 'LoginByVKApiController',
                    controllerAs: 'lv',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiLoginByWeChat', {
                    url: '/koiLoginByWeChat',
                    templateUrl: 'app/koi/login/loginByWeChat.html',
                    controller: 'LoginByWeChatController',
                    controllerAs: 'lw',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiGetUserInfo', {
                    url: '/koiGetUserInfo',
                    templateUrl: 'app/koi/login/getUserInfo.html',
                    controller: 'getUserInfoController',
                    controllerAs: 'guic',
                    resolve: {
                        //跳转页面不需要bootstrap
                        // bootStrapThemeApp: bootStrapThemeApp
                    }
                })
                .state('koiShopping', {
                    url: '/koiShopping',
                    templateUrl: 'app/koi/shopping/shopping.html',
                    controller: 'ShoppingController',
                    controllerAs: 'sc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiStoreDetail', {
                    url: '/koiStoreDetail',
                    templateUrl: 'app/koi/shopping/storeDetail.html',
                    controller: 'storeDetailController',
                    controllerAs: 'sdc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiAddressMap', {
                    url: '/koiAddressMap',
                    templateUrl: 'app/koi/shopping/addressMap.html',
                    controller: 'AddressMapController',
                    controllerAs: 'map',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiOrders', {
                    url: '/koiOrders',
                    templateUrl: 'app/koi/shopping/orders.html',
                    controller: 'ordersController',
                    controllerAs: 'odsc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiOrderSubmit', {
                    url: '/koiOrderSubmit',
                    templateUrl: 'app/koi/shopping/orderSubmit.html',
                    controller: 'orderSubmitController',
                    controllerAs: 'osc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiOrderMemo', {
                    url: '/koiOrderMemo',
                    templateUrl: 'app/koi/shopping/orderMemo.html',
                    controller: 'orderMemoController',
                    controllerAs: 'omc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiPointShop', {
                    url: '/koiPointShop',
                    templateUrl: 'app/koi/pointShop/pointShop.html',
                    controller: 'PointShopController',
                    controllerAs: 'ps',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiConversionRecord', {
                    url: '/koiConversionRecord',
                    templateUrl: 'app/koi/pointShop/conversionRecord.html',
                    controller: 'ConversionRecordController',
                    controllerAs: 'cr',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('koiConversionDetail', {
                    url: '/koiConversionDetail',
                    templateUrl: 'app/koi/pointShop/conversionDetail.html',
                    controller: 'ConversionDetailController',
                    controllerAs: 'cd',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('confirmConversion', {
                    url: '/confirmConversion',
                    templateUrl: 'app/koi/pointShop/confirmConversion.html',
                    controller: 'ConfirmConversionController',
                    controllerAs: 'cc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('exchangeSuccess', {
                    url: '/exchangeSuccess',
                    templateUrl: 'app/koi/pointShop/exchangeSuccess.html',
                    controller: 'ExchangeSuccessController',
                    controllerAs: 'es',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('discountCoupon', {
                    url: '/discountCoupon',
                    templateUrl: 'app/koi/discountCoupon/discountCoupon.html',
                    controller: 'DiscountCouponController',
                    controllerAs: 'dcc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('orderManager', {
                    url: '/orderManager',
                    templateUrl: 'app/koi/orderManager/orderManager.html',
                    controller: 'OrderManagerController',
                    controllerAs: 'oc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('orderDetail', {
                    url: '/orderDetail',
                    templateUrl: 'app/koi/orderManager/orderDetail.html',
                    controller: 'OrderDetailController',
                    controllerAs: 'od',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('orderList', {
                    url: '/orderList',
                    templateUrl: 'app/koi/shopping/order-list.html',
                    controller: 'OrderListController',
                    controllerAs: 'ol',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('tradeRecord', {
                    url: '/tradeRecord',
                    templateUrl: 'app/koi/tradeRecord/tradeRecord.html',
                    controller: 'TradeRecordController',
                    controllerAs: 'tc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('my', {
                    url: '/my',
                    templateUrl: 'app/koi/my/my.html',
                    controller: 'MyController',
                    controllerAs: 'mc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('memberInfo', {
                    url: '/memberInfo',
                    templateUrl: 'app/koi/my/memberInfo.html',
                    controller: 'MemberInfoController',
                    controllerAs: 'mic',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('memberLevelDetail', {
                    url: '/memberLevelDetail',
                    templateUrl: 'app/koi/my/memberLevelDetail.html',
                    controller: 'memberLevelDetailController',
                    controllerAs: 'mld',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myExperience', {
                    url: '/myExperience',
                    templateUrl: 'app/koi/my/myExperience.html',
                    controller: 'myExperienceController',
                    controllerAs: 'mec',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myAddressList', {
                    url: '/myAddressList',
                    templateUrl: 'app/koi/my/myAddressList.html',
                    controller: 'myAddressListController',
                    controllerAs: 'malc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myAddressAddUpdate', {
                    url: '/myAddressAddUpdate',
                    templateUrl: 'app/koi/my/myAddressAddUpdate.html',
                    controller: 'myAddressAddUpdateController',
                    controllerAs: 'maauc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myFeedback', {
                    url: '/myFeedback',
                    templateUrl: 'app/koi/my/myFeedback.html',
                    controller: 'myFeedbackController',
                    controllerAs: 'mfbc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myAcountSetting', {
                    url: '/myAcountSetting',
                    templateUrl: 'app/koi/my/myAcountSetting.html',
                    controller: 'myAcountSettingController',
                    controllerAs: 'masc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myChangePwd', {
                    url: '/myChangePwd',
                    templateUrl: 'app/koi/my/myChangePwd.html',
                    controller: 'myChangePwdController',
                    controllerAs: 'mcpc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myLogout', {
                    url: '/myLogout',
                    templateUrl: 'app/koi/my/myLogout.html',
                    controller: 'myLogoutController',
                    controllerAs: 'mloc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('my_recharge', {
                    url: '/my_recharge',
                    templateUrl: 'app/koi/my/myRecharge.html',
                    controller: 'myRechargeController',
                    controllerAs: 'mrc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myAssetsTransfer', {
                    url: '/myAssetsTransfer',
                    templateUrl: 'app/my/myAssetsTransfer.html',
                    controller: 'myAssetsTransferController',
                    controllerAs: 'matc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('barcode', {
                    url: '/barcode',
                    templateUrl: 'app/koi/discountCoupon/barcode.html',
                    controller: 'BarcodeController',
                    controllerAs: 'bcc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })
                .state('myPayCode', {
                    url: '/myPayCode',
                    templateUrl: 'app/koi/my/myPayCode.html',
                    controller: 'myPayCodeController',
                    controllerAs: 'mpcc',
                    resolve: {
                        bootStrapKOIApp: bootStrapKOIApp
                    }
                })*/

        // TODO set otherwise value to 'loginByWeChat' when production env.
        $urlRouterProvider.otherwise(function ($injector, $location) {
            var theme = $location.search().theme || 'default';
            var storeId = $location.search().storeId;
            var client = $location.search().client;
            if (angular.isUndefined(storeId)) {
                $location.url('/noStoreId');
                // window.alert('没有门店ID: ' + $location.absUrl())
            } else {
                if (angular.isUndefined(client)) {
                    $location.url('/loginByVKApi?storeId=' + storeId + "&theme=" + theme);
                } else {
                    $location.url('/loginByVKApiHeyTea?storeId=' + storeId + "&theme=" + theme);
                }
            }
        });
    }

})();

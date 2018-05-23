/**
 * Created by wenpeng.guo on 12/14/16.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('BaiduMapService', BaiduMapService);

    BaiduMapService.$inject = ['$q', 'baiduMapApi', 'SessionStorageService'];

    function BaiduMapService($q, baiduMapApi, SessionStorageService) {
        return {
            getLocalCity: getLocalCity,
            initZoom: initZoom,
            setMyLocation: setMyLocation,
            getNavigation: getNavigation
        };

        function getLocalCity() {
            return baiduMapApi.then(function (BMap) {
                var localcity = new BMap.LocalCity();
                return $q(function (resolve, reject) {
                    localcity.get(function (r) {
                        resolve(r);
                    });
                });
            });
        }

        function initZoom(map) {
            return baiduMapApi.then(function (BMap) {
                setTimeout(function () {
                    map.setZoom(16);
                }, 2000)
            });
        }

        function setMyLocationTemp(){
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    console.info('您的位置：' + r.point.lng + ',' + r.point.lat);
                    SessionStorageService.setOneSessionStorage("latitude", r.point.lat);
                    SessionStorageService.setOneSessionStorage("longitude", r.point.lng);
                }
                else {
                    console.error('failed' + this.getStatus());
                }
            }, {enableHighAccuracy: true});

        }

        function setMyLocation() {
            //TODO
            return setMyLocationTemp();
            var config = {
                debug: false,
                // appId: data.signData.appId,
                // timestamp: data.signData.timestamp,
                // nonceStr: data.signData.nonceStr,
                // signature: data.signData.signature,
                jsApiList: ['checkJsApi', 'openLocation', 'getLocation']
            };
            wx.config(config);


            wx.ready(function () {
                wx.getLocation({
                    success: function (res) {
                        var latitude = res.latitude;
                        var longitude = res.longitude;
                        SessionStorageService.setOneSessionStorage("latitude", latitude);
                        SessionStorageService.setOneSessionStorage("longitude", longitude);
                    },
                    cancel: function (res) {
                        // alert('用户拒绝授权获取地理位置');
                    }
                })
            });
        }

        function getNavigation(map, myPoint, storePoint) {
            return baiduMapApi.then(function (BMap) {
                var p1 = new BMap.Point(myPoint.lng, myPoint.lat);
                var p2 = new BMap.Point(storePoint.lng, storePoint.lat);
                // var transit = new BMap.TransitRoute(map, {
                //     renderOptions: {map: map}
                // });
                // transit.search(p1, p2);
                var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, autoViewport: true}});
                walking.search(p1, p2);
            });
        }

    }
})();
/**
 * Created by fengli on 17/5/15.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('MapNavigationController', MapNavigationController);

    /** @ngInject */
    MapNavigationController.$inject = ['$scope', '$location', '$sessionStorage', 'BaiduMapService'];

    function MapNavigationController($scope, $location, $sessionStorage, BaiduMapService) {
        var kaijindu = $location.search().kaijindu;
        var kaiweidu = $location.search().kaiweidu;
        var jindu =  $location.search().jindu;
        var weidu =  $location.search().weidu;
        var contain = document.getElementById("l-map");
        // var result = document.getElementById("result");
        var  map = new BMap.Map(contain);
        map.centerAndZoom(new BMap.Point(kaijindu,kaiweidu), 15);

        var p1 = new BMap.Point(kaijindu,kaiweidu);
        var p2 = new BMap.Point(jindu,weidu);
        var driving = new BMap.DrivingRoute(map, {
            renderOptions: {map: map
                , panel: "r-result", autoViewport: true}
        });
        driving.search(p1, p2);
    }

    })();

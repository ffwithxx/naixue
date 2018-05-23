(function () {
    'use strict';

    angular
        .module('vk')
        .controller('AddressMapController', AddressMapController);

    /** @ngInject */
    AddressMapController.$inject = ['$scope', '$location', '$sessionStorage', 'BaiduMapService','ShoppingService'];

    function AddressMapController($scope, $location, $sessionStorage, BaiduMapService,ShoppingService) {
        var storeId = $sessionStorage.storeId;
        var myPoint = {lat: $sessionStorage.latitude, lng: $sessionStorage.longitude};
        var mapObj;
        var vm = this;
        vm.goBack = goBack;
        var info = [];
        vm.store = $sessionStorage.curStore;
        vm.getNav = getNav;
        vm.address ;
         vm.change = change;
        vm.getStoreList = getStoreList;
        vm.xianshi = xianshi;
        var cityName ;
        var jindu;
        var weidu;
        var kaijindu;
        var kaiweidu;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        function goBack() {
            $location.url("/my?storeId=" + storeId + "&theme=" + theme);
        }




        function getStoreList() {
            ShoppingService.getallStroe(storeId).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return
                }
                var dataArr = data.data;
                var addressArr =[];
                var  weiduArr = [];
                var addressStr="";
                var weiduStr='';
                var nameStr = "";
                var nameArr =[];

                for (var i = 0; i < dataArr.length; i++ ) {

                  addressStr = addressStr +','+ dataArr[i].addresses;
                    weiduStr = weiduStr + ',' +  dataArr[i].lnglat;
                    nameStr = nameStr +','+ dataArr[i].names;
                }
                addressArr = addressStr.split(",");
                weiduArr = weiduStr.split(",");
                nameArr = nameStr.split(",");
                for ( var j = 0 ; j < addressArr.length; j++) {

                  var jin = weiduArr[j].split("|")[0];
                    var wei = weiduArr[j].split("|")[1];
                    if (!(jin == "0.000000" && wei == "0.000000")) {
                        var address = "地址:" + addressArr[j];
                        var name = nameArr[j];
                        var detail = jin + "," + wei + "," + address + "," + name;
                        info.push(detail);
                    }

                }
                xianshi(info);
                setZoom(info);




            }, function (e) {
                //error msg
            });

        }



        var contain = document.getElementById("allmap");
        var result = document.getElementById("result");
        var  map = new BMap.Map(contain);

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                // var mk = new BMap.Marker(r.point);
                var myIcon = new BMap.Icon("./assets/images/VK/blackMap2.png", new BMap.Size(71,71));
                var mk = new BMap.Marker(r.point,{icon:myIcon});
                map.addOverlay(mk);
                map.panTo(r.point);
                kaijindu = r.point.lng;
                kaiweidu = r.point.lat;
                map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat));
                // alert('您的位置：'+r.point.lng+','+r.point.lat);
            }
            else {
                alert('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true})

        getStoreList();
        // var data_info = [[116.417854,39.921988,"地址：北京市东城区王府井大街88号乐天银泰百货八层"],
        //     [116.406605,39.921585,"地址：北京市东城区东华门大街"],
        //     [116.412222,39.912345,"地址：北京市东城区正义路甲5号"]
        // ];
//    var searchInfoWindow = null;
    function xianshi( data_info) {
    for(var i=0;i<data_info.length;i++) {
        var dataArr = data_info[i].split(",");
        if (dataArr[0] == "") {

        } else {
            var myIcon = new BMap.Icon("./assets/images/VK/redMap.png", new BMap.Size(71,71));
            // var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注

            var marker = new BMap.Marker(new BMap.Point(dataArr[0], dataArr[1]),{icon:myIcon});  // 创建标注
            // var marker = new BMap.Marker(new BMap.Point(dataArr[0], dataArr[1]));
            var content = dataArr[2];
            var title = dataArr[3];

            map.addOverlay(marker);
            // 将标注添加到地图中
            addClickHandler(content, marker,dataArr);
        }
    }

}
        function addClickHandler(content,marker,dataArr){

            marker.addEventListener("click",function(e){
                openInfo(content,e,marker,dataArr)
            }
            );

        }
        function openInfo(content,e,marker,dataArr){
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
//        var infoWindow = new BMap.InfoWindow(content,searchInfoWindow);  // 创建信息窗口对象
            var searchInfoWindow = null;
            change(content,dataArr);
            searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
                title  : dataArr[3],      //标题
                //高度
                panel  : "panel",         //检索结果面板
                enableAutoPan : true,     //自动平移
                // searchTypes   :[
                //
                //     BMAPLIB_TAB_TO_HERE,  //到这里去
                //     BMAPLIB_TAB_FROM_HERE //从这里出发
                // ]
            });
            // searchInfoWindow.open(marker); //开启信息窗口

        }
function  change(content,dataArr) {
    jindu = dataArr[0];
    weidu  = dataArr[1];
    document.getElementById("address"). innerHTML = content;
    document.getElementById("name"). innerHTML = dataArr[3];
}

//         vm.store = $sessionStorage.curStore;
//         vm.storePointdemo = storePointdemo;
//         vm.storePoint = {lat: vm.store.latitude, lng: vm.store.longitude};
//         // vm.storePoint = myPoint;
//         vm.goBack = goBack;
//         vm.getNav = getNav;
//         // var arr ;
//         // arr[0]=my;
// //         function storePointdemo() {
// //
// //             for (var i = 0; i < 5; i++) {
// // var point = {lat: 31.245473-0.7*i, lng: 121.331382-0.7*i};
// // return point;
// //             }
// //         }
//         $scope.$on('mapready', function (e, map) {
//             mapObj = map;
//             BaiduMapService.initZoom(map);
//         });
//+ "&remark=" + p
        function getNav() {
            $location.url("/mapNavigation?storeId=" + storeId+ "&kaijindu=" + kaijindu + "&kaiweidu=" + kaiweidu+ "&jindu=" + jindu+ "&weidu=" + weidu+ "&theme=" + theme );
        }
        function setZoom(points){
            if(points.length>1){
                var dataArr = points[1].split(",");
                if (dataArr[0] == "") {

                } else {
                    var maxLng = dataArr[0];
                    var minLng = dataArr[0];
                    var maxLat = dataArr[1];
                    var minLat = dataArr[1];
                    var res;
                    for (var i = points.length - 1; i > 0; i--) {

                        res = points[i].split(",");
                        if (res[0] > maxLng) maxLng = res[0];
                        if (res[0] < minLng) minLng = res[0];
                        if (res[1] > maxLat) maxLat = res[1];
                        if (res[1] < minLat) minLat = res[1];
                    }
                    ;
                }
                var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;
                var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;
                var zoom = getZoom(maxLng, minLng, maxLat, minLat);
                map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom);
            }else{
                //没有坐标，显示全中国
                map.centerAndZoom(new BMap.Point(103.388611,35.563611), 5);
            }

        }
//计算缩放级别的函数
        function getZoom (maxLng, minLng, maxLat, minLat) {
            var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。
            //最大最小的坐标点
            var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A
            var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B
            var distance = map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位
            for(var i=0,zoomLen = zoom.length; i <zoomLen; i++) {
                if(zoom[i] - distance > 0) {
                    return 18 -i + 3;
                    //地图范围常常是比例尺距离的10倍以上 所以加3
                }
            };
        }
//         }

    }
})();

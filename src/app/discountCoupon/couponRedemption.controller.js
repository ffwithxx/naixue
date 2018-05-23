/**
 * Created by fengli on 2018/3/12.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .controller('CouponRedemptionController', CouponRedemptionController);

    CouponRedemptionController.$inject = ['$location', '$sessionStorage', 'MyService', 'JsBarcode','$timeout'];

    /** @ngInject */
    function CouponRedemptionController($location, $sessionStorage, MyService,JsBarcode,$timeout) {
        var storeId = $sessionStorage.storeId;
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;

        var data = $location.search();
        var storeId = $sessionStorage.storeId;
        var vm = this;
        vm.barcode = data.barcode;
        vm.title = data.title;
        vm.time = data.time;
        vm.name = $sessionStorage.name;


        var desStr = $sessionStorage.discountRemark;
        var ImageUrl;
        desStr = desStr.replace(/\~/g, "&");
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;

        vm.detail=desStr;
        vm.goBack=goBack;
        vm.showRule=showRule;
        vm.closeRule=closeRule;
        vm.showPage = true;
    function fuzhi() {
    $(".title").text(data.title);
        $(".time").text(data.time);
        $(".name span").text($sessionStorage.name);
    }

fuzhi();
        JsBarcode("#barcode")
            .CODE128(vm.barcode, {fontSize: 20, textMargin: 10, fontWeight: 500, textPosition: "top"})
            .render();
        function goBack() {
            $location.url('discountCouponDetail' + '?storeId=' + $sessionStorage.storeId+"&theme=" + theme+ "&title=" + urlParam.title +"&time=" +urlParam.time+ "&barcode=" + urlParam.barcode +"&url=" +urlParam.url+"&ishare=" +urlParam.ishare);
            // document.querySelector('.coupon-redemption-container').innerHTML="";
        }
       function getImg(){

            html2canvas(document.querySelector('.page'), {
                allowTaint: true,
                taintTest: false,
                onrendered: function(canvas) {
                    console.log("runImg");
                    canvas.id = "mycanvas";
                    // document.body.appendChild(canvas);
                    //生成base64图片数据
                    var dataUrl = canvas.toDataURL();
                    ImageUrl = dataUrl;
                    console.log(ImageUrl);

                }

            })
            // console.log(ImageUrl);
        }
        getImg();
        function showRule() {
            console.log(ImageUrl);
          // document.getElementById("sex").style.display="block";;

            var newImg = document.createElement("img");
            newImg.src=ImageUrl;
            newImg.id='shareImg123';
            newImg.style='background:red;margin-top:44px';

            // document.querySelector(".page").innerHTML=""
            vm.showPage = false;
            document.querySelector('.coupon-redemption-container').appendChild(newImg);
            // $("#newImg").css("margin-top","44px");

            // downloadIamge('#shareImg123','年度账单');

     }

      function downloadIamge(selector, name) {
            // 通过选择器获取img元素
            var img = document.querySelector(selector)
            // 将图片的src属性作为URL地址
            var url = img.src
            var a = document.createElement('a')
            var event = new MouseEvent('click')

            a.download = name || '年度账单'
            a.href = url

            a.dispatchEvent(event)
        }
        function closeRule() {
            document.getElementById("sex").style.display="none";;
        }
        $timeout(function () {
         showRule();
        }, 2000);

    }

})();



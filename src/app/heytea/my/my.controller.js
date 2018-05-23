(function () {
    'use strict';
    angular
        .module('vk')
        .controller('HeyTeaMyController', HeyTeaMyController);

    HeyTeaMyController.$inject = ['$scope', '$sessionStorage', '$location', '$timeout', 'MyService', 'SessionStorageService', 'Upload', 'webApiUrl',"$sce"];

    /** @ngInject */
    function HeyTeaMyController($scope, $sessionStorage, $location, $timeout, MyService, SessionStorageService, Upload, webApiUrl,$sce) {
        document.title = "奈雪の茶";
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;

        var vm = this;
        // vm.style = style;
        vm.name = $sessionStorage.memberName;
        vm.levelName = $sessionStorage.levelName;
        vm.cardType = $sessionStorage.cardType || '普通卡';
        vm.cardId = $sessionStorage.cardId;
        vm.showWelcome = true;
        vm.logo = $sessionStorage.headUrl
        ;
        vm.goDetailPage = goDetailPage;
        vm.changeLogo = changeLogo;
        vm.uploadPhoto = uploadPhoto;
        vm.picFile = undefined;
        vm.msg = {
            warning: false,
            message: ''
        };
        var fileText;
        // vm.agreement = agreement;
        vm.goShop = goShop;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
       var activeted = $sessionStorage.activated;
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
        initone();


        // document.getElementById("sex-close").addEventListener("click",function(event){
        //     document.getElementById("sex").style.display="none";;
        //     document.getElementById("page__bd").style.overflow="inherit";;
        //     $sessionStorage.showagreeMent = false;
        // },false);
        // function one() {
        //     // getUserRule
        //     if(cardId =="" ||cardId=="null"||!cardId){
        //         return
        //     }
        //     MyService.getUserRule(storeId).then(function (res) {
        //  // alert(res);
        //
        //         // $sce.trustAsHtml(data.content);
        //         // vm.detail = $sce.trustAsHtml(res.largevalue);
        //
        //         vm.detail =
        //             $sce.trustAs($sce.RESOURCE_URL,res.largevalue);;
        //
        //
        //     }, function (e) {
        //         //error msg
        //     });
        // }
        function style() {
            var color = (storeId !== 376 && storeId !== 4172 && storeId !== 5411) ? '' : "#CC8E35"
            return {"color":color}
        }
    function goShop() {
    // window.open("https://m.seeapp.com/see/static_wechat/detail/mall.html?id=95522&source_flag=95522&f_id=95522,1,1330,3354,0,0,0,0");
    window.location.href="https://h5.youzan.com/v2/showcase/homepage?alias=z4zQotNau4";
}
        function  initone() {
            init()
            // if ($sessionStorage.showSplash) {
            //     vm.showSplash = true;
            //     $timeout(function () {
            //         vm.showSplash = false;
            //         $sessionStorage.showSplash = false;
            //         init()
            //     }, 1500);
            // } else {
            //     vm.showSplash = false;
            //     $sessionStorage.showSplash = false;
            //     init()
            // }
        }
        function init() {


            if ($location.search().showSplash) {
                $timeout(function () {
                    vm.showWelcome = false;
                    $location.search().showSplash = false;
                }, 1500);
            } else {
                vm.showWelcome = false;
            }

            // one();
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.getMemberInfo(cardId, token).then(function (res) {
                // showagreeMent
              console.log('userinfo: ', res.data)
                vm.experience = res.data.experience || 0;

                // vm.balance = res.data.balance ||0;
                // balance
                vm.point = res.data.point || 0;
                vm.ticketsCount = res.data.ticketsCount || 0;
                vm.mobile = res.data.mobile;
                vm.logo =  res.data.headUrl  ||"./assets/images/snow/head.jpg";
                vm.levelName = res.data.levelName || '普通会员';
                vm.imgUrl = res.data.background || "./assets/images/snow/ka1.png";
                var timestamp;
                if(res.data.activated == "null" || res.data.activated == "" ||!res.data.activated)
                {
                    timestamp = "";
                }else  {
                    timestamp = formatDateTime(res.data.activated);
                }
                // if (res.data.agreement == 0 || res.data.agreement == "null" || !res.data.agreement) {
                //     if ($sessionStorage.showagreeMent) {
                //         // document.getElementById("sex").style.display = "block";
                //         document.getElementById("page").style.overflow="hidden";;
                //         // document.querySelector('body').addEventListener('touchmove',function (e) {
                //         //     if(!document.querySelector('.register-dialog-sex').contains(e.target)) {
                //         //         e.preventDefault();
                //         //     }
                //         // })
                //     } else {
                //
                //     }
                //
                // }
                SessionStorageService.setOneSessionStorage("experience", vm.experience);
                SessionStorageService.setOneSessionStorage("levelName", res.data.levelName);
                SessionStorageService.setOneSessionStorage("levelId", res.data.levelId);

                SessionStorageService.setAllSessionStorage(res.data, function (res) {

                    $sessionStorage.memberName = $sessionStorage.name;
                    $sessionStorage.headUrl = vm.logo;
                    $sessionStorage.activated = timestamp;


                });
            }, function (e) {
                //error msg
            });
        }
// function agreement () {
//     // agreement
//
//     MyService.agreement(cardId, token).then(function (res) {
//         document.getElementById("sex").style.display="none";;
//         $sessionStorage.showagreeMent = false;
//         document.getElementById("page").style.overflow="inherit";;
//
//     }, function (e) {
//         //error msg
//     });
// }
        function changeLogo() {
            window.alert('abc')
        }

        function goDetailPage(url) {
            // $location.url("/heytea-test" + '?storeId=' + $sessionStorage.storeId);
            $location.url(url + '?storeId=' + $sessionStorage.storeId+ "&theme=" + theme);

        }

        $scope.$watch('picFile', function (file) {


            uploadPhoto(file)
        })


        function  resizeFile(file) {

        }
        function uploadPhoto(file) {
            if (!file) return;
            var r= new FileReader();
            r.readAsDataURL(file);
            r.onload=function  (e) {
                //图片压缩
                // 调用函数处理图片 　　　　　　　　　　　　　　　　
                dealImage(this.result, {
// 注意：在pc端可以用绝对路径或相对路径，移动端最好用绝对路径（因为用take photo后的图片路径，我没有试成功（如果有人试成功了可以分享一下经验））
                    width : 500
                }, function(base){
//直接将获取到的base64的字符串，放到一个image标签中就可看到测试后的压缩之后的样式图了
                    fileText = dataURLtoFile(base)
                    uploadImg(fileText)

                });

            };



        }
       function  uploadImg(file) {
           Upload.upload({
               url: webApiUrl + 'uploadFile/v2/upload',
               method: 'POST',
               headers : {
                   'Content-Type': 'multipart/form-data'
               },
               data: {'file': file}
           }).then(function (resp) {
               if (resp.status !=200) {
                   vm.msg.warning = true;
                   vm.msg.message = resp.data.message;
                   $timeout(function () {
                       vm.msg.warning = false;
                       vm.msg.message = '';
                   }, 2000);
                   return;
               }
               console.log('data: ', resp.data)
               vm.logo = resp.data.data[0]
               SessionStorageService.setOneSessionStorage("headUrl", vm.logo);

               var params = {
                   headUrl:resp.data.data[0]
               };

               if(cardId =="" ||cardId=="null"||!cardId){
                   return
               }
               MyService.updateMemberInfo(cardId, token, params).then(function (tranData) {
                   if (tranData.code != 200) {
                       alert(tranData.message);
                       console.log(tranData.message);
                       vm.logo = "";
                       return
                   }
                   $sessionStorage.headUrl =resp.data.data[0] ;

                   vm.logo = resp.data.data[0];
               })
           }, function (resp) {
               console.log('Error status: ' + resp.status);
           }, function (evt) {
               //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
               //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
           });
       }

        function dealImage(path, obj, callback){
            var img = new Image();
            img.src = path;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = obj.height || (w / scale);
                var quality = 0.9;  // 默认图片质量为0.5
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality );
                // 回调函数返回base64的值
                callback(base64);
            }
        }

        function dataURLtoFile(dataurl, filename) {//将base64转换为文件
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        }


    }
})();

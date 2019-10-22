import Cookies from "js-cookie";

const appFwkey='2587l6QEQ3mPHJZgYTAznd2sN17mlBQZ4CgMNdYoEZJ3';
const wxappid='wx62f265fe41b0f080';
const appMode='nvlang';
const picURL='';
const appUrl='http://nvlang.baibangma.com';
//const appUrl='http://www.nvlang.coma/';
const apiUrl='/vueapi';
const playform='vueapi';

import utilmd5 from './md5';


//判断数据是否为空 为空返回true
function isEmpty(v) {
  switch (typeof v) {
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) {
        return true;
      }
      if (v === '' && v === 'null' && v === null && v === '{}' && v === '[]') {
        return true;
      }
      break;
    case 'undefined':
      return true;
      break;
    case 'boolean':
      if (!v) return true;
      break;
    case 'number':
      if (isNaN(v)) return true;
      break;
    case 'object':
      if (null == v || JSON.stringify(v) == '{}' || JSON.stringify(v) == '[]')
        return true;
      switch (v.constructor) {
        case Array:
          if (v.length==0) {
            return true;
          }
          break;
        default:
          if (null === v) {
            return true;
          }
          break;
      }
      break;
    default:
      //console.log(typeof v);
      return false;
      break;
  }
}

// AJAX 请求
// util.request(url,type,date)
function request(_this, url, method = 'GET', data = {}) {
	// if(method.toLowerCase()=='post'){
	// 	var contenttype='application/x-www-form-urlencoded; charset=UTF-8';
	// }else{
	// 	var contenttype='application/json; charset=UTF-8';
	// }
    //请求头
	let header = {
		// 'content-type': contenttype,
		'X-Klapi-Fwkey': appFwkey,
		'X-Klapi-Pfalform': playform,
		'X-Klapi-Ver': '1.0.0'
	};
//let 局部变量 只在let命令所在代码块有效
	let token = getLocal('token') || '';
	if(!isEmpty(token)){
		header['X-Klapi-Authorization'] = token
	}

	let userinfo = getLocal('userinfo') || {};
	if(!isEmpty(userinfo)){
	    let stime=parseInt(userinfo.stime) || 0,
			ctime=parseInt(userinfo.ctime) || 0,
			ukey=userinfo.ukey || '',
			uttamp=0,
			usture='',
			ttamp = parseInt(new Date().getTime()/1000);

		if(ctime>ttamp){
			uttamp=stime;
		}else{
			uttamp=stime + (ttamp - ctime);
		}
		
		usture=utilmd5.hexMD5(ukey.toString()+uttamp.toString());

		header['X-Klapi-Uttamp'] = uttamp;
		header['X-Klapi-Usture'] = usture;
		header['Content-Type'] ='application/json';
	}
    
	return new Promise(function (resolve, reject) {
		_this.axios({
		  url: apiUrl+url,
		  method: method,
		  data: data,
		  headers: header
		}).then(function(res){
			if (res.status === 200) {
				res.data.stat = parseInt(res.data.stat);
				if(res.data.stat == 2){
					_this.$toast(res.data.msg);
					_this.$router.replace({path: '/mine'});
				}
				resolve(res.data);
			} else {
			   //resolve(res);
			   resolve({'stat':999});
			}
		}).catch(function(err){
			reject({'stat':999, 'err':err});
		})
	});
	
}
export function getToken() {

	let token = getLocal('token') || '';
	console.log(token);
	if(isEmpty(token)){
		removeLocal('token');
		return false;
	}else{
		return true;
	}
}
export function getLocalToken() {
	let token = getLocal('token') || '';
		return token;
}
export function logoutToken() {
		removeLocal('token');
		removeLocal('userinfo');
	return true;
}

//是否已授权登录 未登陆则删除token和userinfo信息
function isLogin() {
	let token = getLocal('token') || '';
	let userinfo = getLocal('userinfo') || '';

	if(isEmpty(token) || isEmpty(userinfo)){
		removeLocal('token');
		removeLocal('userinfo');
		return false;
	}else{
		return true;
	}
}

//登录授权失效时操作
function noLogin(_this) {
	removeLocal('token');
	removeLocal('userinfo');
	_this.$router.replace({path: '/login'});
}

//存储
function setLocal(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}
//取出数据
function getLocal(key) {
		return JSON.parse(localStorage.getItem(key))
}
// 删除数据
function removeLocal(key) {
    localStorage.removeItem(key);
}

//获取code   
function getCodeApi(state){
	let urlNow=encodeURIComponent(window.location.href);
	let scope='snsapi_userinfo';    //snsapi_userinfo   //静默授权 用户无感知
	let appid=wxappid;
	let url=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
	window.location.replace(url);
}
//获取url 参数
function getUrlKey(name){
	return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}

function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

function getRect(el) {
	if (el instanceof window.SVGElement) {
	  let rect = el.getBoundingClientRect()
	  return {
	    top: rect.top,
	    left: rect.left,
	    width: rect.width,
	    height: rect.height
	  }
	} else {
	  return {
	    top: el.offsetTop,
	    left: el.offsetLeft,
	    width: el.offsetWidth,
	    height: el.offsetHeight
	  }
	}
}
//深度克隆
function getType(obj) {
	if (Object.prototype.toString.call(obj) == '[object Object]') {
		return 'Object';
	} else if (Object.prototype.toString.call(obj) == '[object Array]') {
		return 'Array';
	} else {
		return 'nomal';
	}
}

export function deepClone(obj) {
	if (getType(obj) == 'nomal') {
		return obj;
	} else {
		var newObj = getType(obj) == 'Object' ? {} : [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) { //用到.hasOwnProperty是为了避免在拷贝有继承时拷贝到继承自对象中的值
				newObj[key] = deepClone(obj[key]);
			}
		}
	}
	return newObj;
}
//保留两位小数
function moneyformat(val,digit=2){
  if (isNaN(Number(val)))
    return new Number(0).toFixed(digit);
  else
    return new Number(val).toFixed(digit);
}

/** 
 * 日期转时间戳
 * @param  {string} format    格式 
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间 
 * @return {string}           格式化的时间字符串 
 */
function datetounix(datastr) {
  // var date =(datastr) ?datastr:format(Date.parse(new Date()));
  var date =(datastr) ?datastr:formatDate(Date.parse(new Date()),'yyyy-MM-dd hh:mm:ss');
      date = date.substring(0,19);    
      date = date.replace(/-/g,'/'); 
  var timestamp = Date.parse(new Date(date))/1000;

  return timestamp;
}

/** 
 * 日期转时间戳
 * @param  {string} format    格式 
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间 
 * @return {string}           格式化的时间字符串 
 */
function format(shijianchuo)
{
	//shijianchuo是整数，否则要parseInt转换
	var time = new Date(shijianchuo);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

/** 
 * 日期加零
 * @param  {int}     m要格式化的时间 
 * @return {string}  格式化的时间字符串 
 */
function add0(m){return m<10?'0'+m:m}

/** 
 * 分割数组获取分页数据
 * @param arr {array}   分页源数组
 * @param p {int}    页数
 * @param lim {int}  每页数量
 * @return {array}  格式化的时间字符串 
 */
function getListPage(arr=[],p=1,lim=20){
	let limit=20,page=1,length=0,list=[],star=0,end=limit;
	p>1?page=p:page=1;
	lim>0?limit=lim:limit=20;
	if (!this.isEmpty(arr))
	{
		length=arr.length;
		star=(page-1)*limit;
		if (length>page*limit)
			end=page*limit;
		else
			end=length;
		list=arr.slice(star,end);
	}
	return list;
}
/** 
 * 数组移除item
 * @param  {array} array   源数组 
 * @param  {string}  key 对应的key key为空时 value为pos索引值
 * @param  {value}  value 对应的key
 * @return {array}  返回数组
 */
function delitem(array,value,key)
{
	if (!isEmpty(array)&&!isEmpty(value))
	{
		if (isEmpty(key))
		{
			array.splice(value,1);
		}else
		{
			array.forEach(function(item,index){
				if (item[key]==value)
				{
					array.splice(index,1);
				}
			});
		}
		array.sort(); //重新索引排序
	}
	return array;
}


//将远程图片转化为base64
function getBase64(img){
    function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
      var canvas = document.createElement("canvas");
      canvas.width = width ? width : img.width;
      canvas.height = height ? height : img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var dataURL = canvas.toDataURL();
      return dataURL;
    }
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    // image.crossOrigin = '';
    image.src = img;
    return new Promise((resolve,reject)=>{
        image.onload =function (){
            resolve(getBase64Image(image));//将base64传给done上传处理
        }
    });
}

function base64toFile(dataurl, filename) {//将base64转换为文件
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

//注册全局变量及全局方法
export default{
	appFwkey: appFwkey,
	appMode: appMode,
	appUrl: appUrl,
	picURL: picURL,
	apiUrl: apiUrl,
	utilmd5: utilmd5,
	request: request,
	isEmpty: isEmpty,
	isLogin: isLogin,
	noLogin: noLogin,
	setLocal: setLocal,
	getLocal: getLocal,
	removeLocal: removeLocal,
	getCodeApi: getCodeApi,
	getUrlKey: getUrlKey,
	formatDate: formatDate,
	datetounix: datetounix,
	padLeftZero: padLeftZero,
	getRect:getRect,
	moneyformat:moneyformat,
	delitem:delitem,
	getBase64:getBase64,
	base64toFile:base64toFile,
	getListPage:getListPage,
	deepClone:deepClone,
}

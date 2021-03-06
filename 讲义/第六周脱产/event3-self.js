function on(ele,type,fn){
	
	
	//以self开头的事件类型是自定义的事件类型（type）
	
	if(/^self/.test(type)){
		
		if(!ele["aSelf"+type]) ele["aSelf"+type]=[];
		var a=ele["aSelf"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==fn)return;	
		}
		a.push(fn);
		return;//不写return就执行到下边去了		
	}
	
	if(ele.addEventListener){//如果支持标准浏览器的方法，则直接用此方法完成事件绑定
		ele.addEventListener(type,fn,false);
		return;	
	}
	
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];
		
		//下面这句代码代替了bind方法
		ele.attachEvent("on"+type,function (){run.call(ele)});

	}
	var a=ele["aEvent"+type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;	
	}
	a.push(fn);
	
	
}
function run(){//解决系统的事件的兼容性问题（IE）
	var e=window.event;
	var type=e.type;
	if(!e.target){
		e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
		e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
		e.stopPropagation=function(){e.cancelBubble=true;}
		e.preventDefault=function(){e.returnValue=false;}
		e.target=e.srcElement;
	}
	var a=this["aEvent"+type];
	if(a&&a.length){
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e);//为了和标准浏览器的事件对象取得方式保持一致：事件对象是一个被系统自动传进去的实参	
			}else{
				a.splice(i,1);
				i--;
			}
		}	
	}
}

function off(ele,type,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);
		return;	
	}
	var a=ele["aEvent"+type];
	if(a&&a.length){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;
				return;	
			}
		}
	}
	
}

//Function.prototype.bind
function processThis(fn,obj){//返回一个新的方法：使fn功能不变，但fn在运行的时候this指向obj
	return function(e){fn.call(obj,e)}
}

//selfType是自定义的事件类型，字符串。e是系统的事件对象
function selfRun(selfType,e){
	var a=this["aSelf"+selfType];
	if(a){
		for(var i=0;i<a.length;i++){
			a[i].call(this,e);
		}
	}	
}
//1、完状况on方法。2、增加一个selfRun方法



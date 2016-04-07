
function on(ele,type,fn){
    //以self开头的事件类型是自定义的事件类型(type)
    if(/^self/.test(type)){
        if(!ele["aSelf"+type]) ele["aSelf"+type]=[];//如里不存在，就创建一个
        var a=ele["aSelf"+type];
        for(var i=0;i< a.length;i++){
            if(a[i]==fn)return;
        }
        a.push(fn);
        return ;//不写return就执行到下边去了
    }
}
function down(e){
    this.x=this.offsetLeft;
    this.y=this.offsetTop;
    this.mx=e.pageX;
    this.my=e.pageY;
    if(this.setCapture){
        this.setCapture();
        on(this,"mousemove",move);
        on(this,"mouseup",up)
    }else{

        this.MOVE=move.bind(this);//es5中原生的方法
        this.UP=up.bind(this);

        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);
    }
    e.preventDefault();
}
function move(e) {
    this.style.left = this.x + (e.pageX - this.mx) + "px";
    this.style.top = this.y + (e.pageY - this.my) + "px";
}
function up(e){
    if(this.releaseCapture){
        this.releaseCapture();
        off(this,"mousemove",move);
        off(this,"mouseup",up);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
    e.preventDefault();
    selRun.call(this,"selfDragstart",e);//这是关键一步
}
function processThis(fn,obj){//返回一个新的方法：使fn功能不变，但fn在运行的时候this指向obj
    return function(e){fn.call(obj,e)}
}
function selRun(selfType,e){//第一个参数是自定义事件的类型，第二个参数是系统的事件对象
    var a=this["aSelf"+selfType];
    if(a){
        for(var i=0;i< a.length;i++){
            a[i].call(this,e);
        }
    }
}
selRun.call(this,"selfdragstart",e)//e指的是将系统的事件传过去

function down(e){
	this.x=this.offsetLeft;
	this.y=this.offsetTop;
	this.mx=e.pageX;
	this.my=e.pageY;
	if(this.setCapture){
		this.setCapture();
		on(this,"mousemove",move);
		on(this,"mouseup",up);
	}else{
		
		this.MOVE=move.bind(this);//es5涓師鐢熺殑鏂规硶
		this.UP=up.bind(this);		
		
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	e.preventDefault();
	selfRun.call(this,"selfdragstart",e);//杩欐槸鍏抽敭涓?姝?
	
}
function move(e){
	this.style.left=this.x+(e.pageX-this.mx)+"px";
	this.style.top=this.y+(e.pageY-this.my)+"px";
	selfRun.call(this,"selfdragging",e);
}

function up(e){
	if(this.releaseCapture){
		this.releaseCapture();
		off(this,"mousemove",move);
		off(this,"mouseup",up);	
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);
	}
	selfRun.call(this,"selfdragend",e)
	
}

function clearEffect(){
	clearTimeout(this.flyTimer);
	clearTimeout(this.dropTimer);	
}
//on(ele,"selfdragging",getSpeed);
//鐢辩郴缁熶簨浠惰Е鍙憆un鏂规硶-->(run鎶奺鐨勫吋瀹瑰鐞嗗ソ浼犵粰move)move-->selfRun(e鐢眒ove浼犵粰selfRun)-->getSpeed(selfRun鎶奺浼犵粰getSpeed)
function getSpeed(e){
	if(this.prevPosi){
		this.speed=e.pageX-this.prevPosi;
		this.prevPosi=e.pageX;
	}else{
		this.prevPosi=this.offsetLeft;
	}	
}
function fly(){
	if(this.speed){
		this.speed*=.98;//
		var maxRight=(document.documentElement.clientWidth||document.body.clientWidth)-this.offsetWidth;
		var current=this.speed+this.offsetLeft;//姝ｅ父杩愬姩鏃跺簲璇ュ埌杈剧殑浣嶇疆
		if(current>=maxRight){
			this.style.left=maxRight+"px";
			this.speed*=-1;//璁╃洅瀛愬線鐩稿弽鐨勬柟鍚戣繍鍔?
		}else if(current<=0){
			this.style.left=0;
			this.speed*=-1;
		}else{
			this.style.left=current+"px";
		}
		if(Math.abs(this.speed)>=0.5)//绉诲姩鐨勮窛绂诲ぇ浜庣瓑浜?0.5鎵嶆湁鎰忎箟锛屾墍浠ユ槸杩欎釜鍒ゆ柇
			this.flyTimer=window.setTimeout(processThis(fly,this),30);

	}
	
}


function drop(){//鑷敱钀戒綋鐨勫姩鐢?
	//鍏堣鎸囧畾涓?涓?滈噸鍔涘姞閫熷害鈥?
	if(this.dropSpeed){
		this.dropSpeed+=9.8;	
	}else{
		this.dropSpeed=9.8;
	}
	
	this.dropSpeed*=.98;//鎽╂摝绯绘暟
	
	var maxBottom=(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight;
	
	var current=this.offsetTop+this.dropSpeed;
	if(current>=maxBottom){//鎾炲埌鍦伴潰涓婁簡
		this.style.top=maxBottom+"px";
		this.dropSpeed*=-1;//鍙嶅脊
		this.flag++;//鎾炲埌杈圭晫涓婂垯绱姞锛屽鏋滃嚭鐜皌his.flag澶т簬2锛屾槸浠?涔堟儏鍐碉紵
		
	}else{
		this.style.top=current+"px";
		this.flag=0;//姝ｅ父杩愬姩鍒欏綊闆?
	}
	if(this.flag<2)
		this.dropTimer=window.setTimeout(processThis(drop,this),30);
	
}

//鍦ㄦ柊鐨勫姩鐢绘墽琛屼箣鍓嶏紝灏辫鎶婂師鏉ョ殑鍔ㄧ敾鏁堟灉娓呴櫎鍒?

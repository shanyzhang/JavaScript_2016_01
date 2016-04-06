<<<<<<< HEAD
function on(ele,type,fn){
    //��self��ͷ���¼��������Զ�����¼�����(type)
    if(/^self/.test(type)){
        if(!ele["aSelf"+type]) ele["aSelf"+type]=[];
        var a=ele["aSelf"+type];
        for(var i=0;i< a.length;i++){
            if(a[i]==fn)return;
        }
        a.push(fn);
        return ;//��дreturn��ִ�е��±�ȥ��
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

        this.MOVE=move.bind(this);//es5��ԭ���ķ���
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
    selRun.call(this,"selfDragstart",e);//���ǹؼ�һ��
}
function processThis(fn,obj){//����һ���µķ�����ʹfn���ܲ��䣬��fn�����е�ʱ��thisָ��obj
    return function(e){fn.call(obj,e)}
}
function selRun(selfType,e){
    var a=this["aSelf"+selfType];
    if(a){
        for(var i=0;i< a.length;i++){
            a[i].call(this,e);
        }
    }
}
selRun.call(this,"selfdragstart",e)//eָ���ǽ�ϵͳ���¼�����ȥ
=======
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
		
		this.MOVE=move.bind(this);//es5中原生的方法
		this.UP=up.bind(this);		
		
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	e.preventDefault();
	selfRun.call(this,"selfdragstart",e);//这是关键一步
	
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
//由系统事件触发run方法-->(run把e的兼容处理好传给move)move-->selfRun(e由move传给selfRun)-->getSpeed(selfRun把e传给getSpeed)
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
		var current=this.speed+this.offsetLeft;//正常运动时应该到达的位置
		if(current>=maxRight){
			this.style.left=maxRight+"px";
			this.speed*=-1;//让盒子往相反的方向运动
		}else if(current<=0){
			this.style.left=0;
			this.speed*=-1;
		}else{
			this.style.left=current+"px";
		}
		if(Math.abs(this.speed)>=0.5)//移动的距离大于等于0.5才有意义，所以是这个判断
			this.flyTimer=window.setTimeout(processThis(fly,this),30);

	}
	
}


function drop(){//自由落体的动画
	//先要指定一个“重力加速度”
	if(this.dropSpeed){
		this.dropSpeed+=9.8;	
	}else{
		this.dropSpeed=9.8;
	}
	
	this.dropSpeed*=.98;//摩擦系数
	
	var maxBottom=(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight;
	
	var current=this.offsetTop+this.dropSpeed;
	if(current>=maxBottom){//撞到地面上了
		this.style.top=maxBottom+"px";
		this.dropSpeed*=-1;//反弹
		this.flag++;//撞到边界上则累加，如果出现this.flag大于2，是什么情况？
		
	}else{
		this.style.top=current+"px";
		this.flag=0;//正常运动则归零
	}
	if(this.flag<2)
		this.dropTimer=window.setTimeout(processThis(drop,this),30);
	
}

//在新的动画执行之前，就要把原来的动画效果清除到
>>>>>>> a6be0f5c28719cf7ea422c38c7f51d93f4f374d4

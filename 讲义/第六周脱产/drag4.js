function on(ele,type,fn){
    //以self开头的事件类型是自定义的事件类型(type)
    if(/^self/.test(type)){
        if(!ele["aSelf"+type]) ele["aSelf"+type]=[];
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
function selRun(selfType,e){
    var a=this["aSelf"+selfType];
    if(a){
        for(var i=0;i< a.length;i++){
            a[i].call(this,e);
        }
    }
}
selRun.call(this,"selfdragstart",e)//e指的是将系统的事件传过去
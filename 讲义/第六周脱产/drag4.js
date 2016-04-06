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
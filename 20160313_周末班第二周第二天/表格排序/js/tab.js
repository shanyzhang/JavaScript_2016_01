var oTab=document.getElementById("tab");
var tHead=oTab.tHead;
var oThs=tHead.rows[0].cells;
var tBody=oTab.tBodies[0];
var oRows=tBody.rows;
var data=null;

var xhr=new XMLHttpRequest;
xhr.open("get","data",false);
xhr.onreadystatechange=function(){
    if(xhr.readyState===4 &&/^2\d{2}$/.test(xhr.status)){
       var val=xhr.responseText;
        data=utils.jsonParse(val);
    }
};
xhr.send(null);

function bind(){
    var frg=document.createDocumentFragment();
    for(var i=0;i<data.length;i++){
        var cur=data[i];
        var oTr=document.createElement("tr");
        for(var key in cur){
            var oTd=document.createElement("td");
            oTd.innerHTML=key==="sex"?(cur[key]===0?"男":"女"):cur[key];
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg=null;
}
bind();

function changeBg(){
    for(var i=0;i<oRows.length;i++){
        oRows[i].className=i%2===1?"bg":null;
    }
}
changeBg();

function sort(){
    var _this=this;
    var ary = utils.listToArray(oRows);
    for(var k=0;k<oThs.length;k++){
        if(oThs[k]!==this){
            oThs[k].flag=-1;
        }
    }
    _this.flag*=-1;
    ary.sort(function(a,b){
        var curInn= a.cells[_this.index].innerHTML,nexInn= b.cells[_this.index].innerHTML;
        var curInnNum=parseFloat(curInn),nexInnNum=parseFloat(nexInn);
        if(isNaN(curInnNum)||isNaN(nexInnNum)){
            return (curInn.localeCompare(nexInn))*_this.flag;
        }
        return (curInnNum-nexInnNum)*_this.flag;
    });
    var frg=document.createDocumentFragment();
    for(var i=0;i<ary.length;i++){
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg=null;
    changeBg();
}

for(var i=0;i<oThs.length;i++){

    oThs[i].index=i;
    oThs[i].flag=-1;
    oThs[i].onclick=sort;
}

//->想要操作谁就先获取谁
var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var oThs = tHead.rows[0].cells;
var tBody = oTab.tBodies[0];
var oRows = tBody.rows;
var data = null;

//->1、首先获取后台中的数据
var xhr = new XMLHttpRequest;//1)首先创建一个Ajax对象
xhr.open("get", "json/data.txt", false);//2)打开我们需要请求数据的那个文件地址
xhr.onreadystatechange = function () {//3)监听请求的状态
    if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {//如果请求成功
        var val = xhr.responseText;  //获取到请求的文件
        data = utils.jsonParse(val);
    }
};
xhr.send(null);//发送请求

//->2、实现我们的数据绑定
function bind() {
    var frg = document.createDocumentFragment();//创建文档碎片
    for (var i = 0; i < data.length; i++) {//data中存储的是想要的数据，所以循环data
        var cur = data[i];
        var oTr = document.createElement("tr");//每一次循环创建一个tr
        for (var key in cur) {//for in 循环遍历每一个对象（每一个tr还有4个td）
            var oTd = document.createElement("td");
            oTd.innerHTML = key === "sex" ? (cur[key] === 0 ? "男" : "女") : cur[key];//0是男，1是女
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);//把tr添加到文档碎片中
    }
    tBody.appendChild(frg);//把文档碎片添加到tBody中
    frg = null;
}
bind();

//->3、实现隔行变色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();


//->4、编写表格排序的方法:实现按照年龄这一列进行排序
function sort() {
    var _this = this;
    var ary = utils.listToArray(oRows);

    //->点击当前列,需要让其他的列的flag存储的值回归到初始值-1,这样在返回头点击其他的列,才是按照升序排列的
    for (var k = 0; k < oThs.length; k++) {
        if (oThs[k] !== this) {
            oThs[k].flag = -1;
        }
    }

    _this.flag *= -1;
    ary.sort(function (a, b) {
        var curInn = a.cells[_this.index].innerHTML, nexInn = b.cells[_this.index].innerHTML;
        var curInnNum = parseFloat(curInn), nexInnNum = parseFloat(nexInn);
        if (isNaN(curInnNum) || isNaN(nexInnNum)) {
            return (curInn.localeCompare(nexInn)) * _this.flag;
        }
        return (curInnNum - nexInnNum) * _this.flag;
    });

    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();
}

//5、点击排序:所有具有class="cursor"这个样式的列都可以实现点击排序
for (var i = 0; i < oThs.length; i++) {
    var curTh = oThs[i];
    //if (curTh.className === "cursor") {
        oThs[i].index = i;
        oThs[i].flag = -1;
        oThs[i].onclick = sort;/*function () {
            sort.call(this, this.index);
        }*/
    //}
}
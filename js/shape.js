//定义格子类型
function Cell(r,c,src){
  this.r=r; this.c=c; this.src=src;
}
//定义所有图形的抽象父类型Shape
function Shape(
  r0,c0,r1,c1,r2,c2,r3,c3,src,states,orgi){
  this.cells=[//每种图形都包含4个格子
    new Cell(r0,c0,src),new Cell(r1,c1,src),
    new Cell(r2,c2,src),new Cell(r3,c3,src),];
  this.states=states;//保存图形的所有旋转状态
  //根据指定的参照格下标，获得参照格对象
  this.orgCell=this.cells[orgi];
  this.statei=0;//保存现在正在使用的状态序号
}
Shape.prototype={
  moveDown(){
    //遍历当前图形的cells
    for(var i=0;i<this.cells.length;i++)
      //将当前图形的当前格的r+1
      this.cells[i].r++;
  },
  moveLeft(){
    //遍历当前图形的cells
    for(var i=0;i<this.cells.length;i++)
      //将当前图形的当前格的c-1
      this.cells[i].c--;
  },
  moveRight(){
    //遍历当前图形的cells
    for(var i=0;i<this.cells.length;i++)
      //将当前图形的当前格的c+1
      this.cells[i].c++;
  },
  rotateL(){
    this.statei--;//将statei-1
    //如果statei==states的length,就改回0
    this.statei==-1&&(this.statei=this.states.length-1);
    this.rotate();
  },
  rotate(){
    //获得states数组中statei位置的状态对象state
    var state=this.states[this.statei];
    //遍历当前图形的cells
    for(var i=0;i<this.cells.length;i++){
      //将当前格临时保存在cell中
      var cell=this.cells[i];
      //如果cell不是orgCell
      if(cell!=this.orgCell){
        //以参照格的r,c为基准，重新计算位置
        cell.r=this.orgCell.r+state["r"+i];
        cell.c=this.orgCell.c+state["c"+i];
      }
    }
  },
  rotateR(){
    this.statei++;//将statei+1
    //如果statei==states的length,就改回0
    this.statei==this.states.length&&(this.statei=0);
    this.rotate();
  },
  IMGS:{T:"img/T.png",O:"img/O.png",I:"img/I.png"}
}
//定义描述每种状态的类型
function State(r0,c0,r1,c1,r2,c2,r3,c3){
  this.r0=r0; this.c0=c0;
  this.r1=r1; this.c1=c1;
  this.r2=r2; this.c2=c2;
  this.r3=r3; this.c3=c3;
}
function T(){//定义T类型:
  var states=[
    new State(0,-1,   0,0,      0,+1,   +1,0),
    new State(-1,0,   0,0,      +1,0,   0,-1),
    new State(0,+1,   0,0,      0,-1,   -1,0),
    new State(+1,0,   0,0,      -1,0,   0,+1),
  ];
  Shape.call(
    this,
    0,3,0,4,0,5,1,4,
    this.IMGS.T,
    states,
    1);
}
Object.setPrototypeOf(T.prototype,Shape.prototype);
function O(){
  var states=[
    new State(0,-1,   0,0,     +1,-1,   +1,0)  
  ];
  Shape.call(
    this,
    0,4,0,5,1,4,1,5,
    this.IMGS.O,
    states,
    1);
}
Object.setPrototypeOf(O.prototype,Shape.prototype);
function I(){
  var states=[
    new State(0,-1,   0,0,     0,+1,    0,+2),
    new State(-1,0,   0,0,     +1,0,    +2,0)
  ];
  Shape.call(
    this,
    0,3,0,4,0,5,0,6,
    this.IMGS.I,
    states,
    1);
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
/*
  S 04 05 13 14  orgi:3  2个状态
  Z 03 04 14 15  orgi:2  2个状态
  L 03 04 05 13  orgi:1  4个状态
  J 03 04 05 15  orgi:1  4个状态
*/
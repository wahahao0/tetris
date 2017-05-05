var game={
  //保存格子大小和格子定位的偏移量
  CSIZE:26,OFFSET:15,
  pg:null,//保存游戏主界面
  shape:null,//保存主角图形:正在下落的图形
  timer:null,//保存定时器序号
  interval:200,//保存下落速度
  RN:20,CN:10,//墙的总行数和总列数
  wall:null,//保存所有停止下落的方块的墙
  nextShape:null,//保存备胎图形
  score:0,//保存游戏得分
  lines:0,//保存删除的行数
  state:1,//保存游戏状态
  GAMEOVER:0,//游戏结束
  RUNNING:1,//运行中
  PAUSE:2,//暂停
  SCORES:[0,10,30,60,100],
        //0  1  2  3  4
  randomShape(){//随机生成图形
    //在0~2之间取一个随机整数r
    var r=Math.floor(Math.random()*3);
    switch(r){//判断r
      //是0 就返回一个新的O]
      case 0: return new O();
      //是1 就返回一个新的I
      case 1: return new I();
      //是2 就返回一个新的T
      case 2: return new T();
    }
  },
  start(){//启动游戏
    this.state=this.RUNNING;
    this.score=0;
    this.lines=0;
    this.wall=[];//创建空数组保存在wall中
    for(var r=0;r<this.RN;r++)//r从0到<RN
      this.wall[r]=new Array(this.CN);
    //获得class为playground的元素保存在pg属性中
    this.pg=document.querySelector(".playground");
    //分别随机生成主角和胚胎
    this.shape=this.randomShape();
    this.nextShape=this.randomShape();
    this.paint();//绘制主角图形
    //为网页绑定键盘按下事件: 
    document.onkeydown=function(e){
      switch(e.keyCode){
        case 37: 
          this.state==this.RUNNING&&(this.moveLeft()); 
          break;
        case 38: 
          this.state==this.RUNNING&&(this.rotateR());
          break;
        case 39: 
          this.state==this.RUNNING&&(this.moveRight()); 
          break;
        case 40: 
          this.state==this.RUNNING&&(this.moveDown()); 
          break;
        case 32: 
          this.state==this.RUNNING&&(this.hardDrop());
          break;
        case 90: 
          this.state==this.RUNNING&&(this.rotateL());
          break;
        case 67: 
          this.state==this.PAUSE&&(this.myContinue());
          break;
        case 80: 
          this.state==this.RUNNING&&(this.pause());
          break;
        case 81: this.quit(); break;
        case 83: 
          this.state==this.GAMEOVER&&(this.start());
          break;
      }
    }.bind(this);
    //启动周期性定时器，任务函数为moveDown,时间间隔为interval
    this.timer=setInterval(
      this.moveDown.bind(this), this.interval);
  },
  pause(){//暂停
    //停止定时器，清空timer
    clearInterval(this.timer); this.timer=null;
    //设置游戏状态为PAUSE
    this.state=this.PAUSE;
    this.paint();//重绘一切
  },
  myContinue(){
    //启动定时器
    this.timer=setInterval(
      this.moveDown.bind(this), this.interval);
    //设置游戏状态为RUNNING
    this.state=this.RUNNING;
    this.paint();//重绘一切
  },
  quit(){
    //停止定时器，清空timer
    clearInterval(this.timer); this.timer=null;
    //设置游戏状态为GAMEOVER
    this.state=this.GAMEOVER;
    this.paint();//重绘一切
  },
  rotateR(){//右转
    this.shape.rotateR(); 
    if(this.canRotate()) this.paint();
    else this.shape.rotateL();
  },
  canRotate(){//判断能否旋转
    //遍历shape的cells中每个cell
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前格临时保存在cell中
      var cell=this.shape.cells[i];
      //如果cell的r<0或cell的r>=RN或cell的c<0或者cell的c>=CN,就返回false
      if(cell.r<0||cell.r>=this.RN
        ||cell.c<0||cell.c>=this.CN)
        return false;
      //否则，如果wall中cell相同位置有格，就返回false
      else if(this.wall[cell.r][cell.c]!==undefined)
        return false;
    }//(遍历结束)
    return true;//返回true
  },
  rotateL(){//左转
    this.shape.rotateL();
    if(this.canRotate()) this.paint();
    else this.shape.rotateR();
  },
  canLeft(){//能否左移
    //遍历shape的cells
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前格临时保存在cell中
      var cell=this.shape.cells[i];
      //如果cell的c等于0，就返回false
      if(cell.c==0) return false;
      //否则，如果wall中cell左侧有格,就返回false
      else if(
        this.wall[cell.r][cell.c-1]!==undefined)
        return false;
    }//(遍历结束)
    return true;//返回true
  },
  moveLeft(){//左移
    if(this.canLeft()){//如果可以左移
      //调用shape的moveLeft方法
      this.shape.moveLeft();
      this.paint();//重绘一切
    }
  },
  canRight(){//能否右移
    //遍历shape的cells
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前格临时保存在cell中
      var cell=this.shape.cells[i];
      //如果cell的c等于CN-1,就返回false
      if(cell.c==this.CN-1) return false;
      //否则如果wall中cell的右侧有格,就返回false
      else if(
        this.wall[cell.r][cell.c+1]!==undefined)
        return false;
    }//(遍历结束)
    return true;//返回true
  },
  moveRight(){//右移
    if(this.canRight()){//如果可以右移
      //调用shape的moveRight方法
      this.shape.moveRight();
      this.paint();//重绘一切
    }
  },
  hardDrop(){//一落到底
    //反复: 只要可以下落
    while(this.canDown())
      this.moveDown();//调用moveDown方法
  },
  canDown(){//判断能否下落
    //遍历shape的cells
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前格临时保存在cell中
      var cell=this.shape.cells[i];
      //如果cell的r等于RN-1，就返回false
      if(cell.r==this.RN-1) return false;
      //否则，如果wall中cell的下方位置不是undefined
      else if(
        this.wall[cell.r+1][cell.c]!==undefined)
        return false;//就返回false
    }//(遍历结束)
    return true;//返回true
  },
  landIntoWall(){//将停止下落的格，放入墙中
    //遍历shape的cells
    for(var i=0;i<this.shape.cells.length;i++){
      //临时将当前格保存在cell中
      var cell=this.shape.cells[i];
      //将cell保存到wall中相同位置
      this.wall[cell.r][cell.c]=cell;
    }
  },
  moveDown(){
    if(this.canDown()){//如果可以下落
      //调用shape的moveDown方法
      this.shape.moveDown();  
    }else{
      this.landIntoWall();//落入墙中
      var ln=this.deleteRows();//判断并删除满格行 
      this.lines+=ln;//将ln累加到lines
      //用ln作为下标获取SCORES数组中的分数累加到score属性
      this.score+=this.SCORES[ln];
      if(!this.isGameOver()){//如果游戏没有结束
        this.shape=this.nextShape;//备胎转正
        //生成新备胎
        this.nextShape=this.randomShape();
      }else{//否则
        this.quit();
      }
    }
    this.paint();//重绘一切
  },
  isGameOver(){//判断游戏结束
    //遍历nextShape的cells
    for(var i=0;i<this.nextShape.cells.length;i++){
      //将当前格临时保存在cell中
      var cell=this.nextShape.cells[i];
      //如果wall中cell相同位置有格,就返回true
      if(this.wall[cell.r][cell.c]!==undefined)
        return true;
    }//(遍历结束)
    return false;//返回false
  },
  deleteRows(){//删除所有满格行
    //r自底向上遍历wall中每一行,定义ln记录删除行数
    for(var r=this.RN-1,ln=0;ln<4&&r>=0;r--){
      if(this.wall[r].join("")==="") break;
      //如果wall中r行是满格行
      else if(String(this.wall[r])
            .search(/^,|,,|,$/)==-1){
        this.deleteRow(r++);//删除第r行,并r留在原地
        ln++;
      }
    }
    return ln;
  },
  deleteRow(r){//删除第r行
    for(;r>=0;r--){//r每次-1，到>=0结束
      //将wall中r-1行赋值给r行
      this.wall[r]=this.wall[r-1];
      //将wall中r-1行置为CN个空元素的数组
      this.wall[r-1]=new Array(this.CN);
      //遍历wall中r行的每个cell 
      for(var c=0;c<this.CN;c++){
        //将wall中r行c列的格保存到cell中
        var cell=this.wall[r][c];
        //如果cell不是undefined,就cell的r+1
        if(cell!==undefined) cell.r++;
      }
      //如果wall中r-2行是空行,就退出循环
      if(this.wall[r-2].join("")==="") break;
    }
  },
  paintScore(){//重绘得分
    //在pg下查找第1个p元素下的span，设置其内容为score
    this.pg.querySelector("p:first-child>span")
           .innerHTML=this.score;
    //在pg下查找第2个p元素下的span，设置其内容为lines
    this.pg.querySelector("p:nth-child(2)>span")
           .innerHTML=this.lines;
  },
  paintState(){//重绘状态
    //如果状态不是RUNNING
    if(this.state!=this.RUNNING){
      var img=new Image();//创建img
      //如果状态是GAMEOVER
      if(this.state==this.GAMEOVER){
        //设置img的src为"img/game-over.png"  
        img.src="img/game-over.png";
      }else{//否则
        //设置img的src为"img/pause.png"
        img.src="img/pause.png";
      }
      this.pg.appendChild(img);//将img追加到pg中
    }
  },
  paint(){//清除现有img，重绘一切
    //清除现有img
    var reg=/<img [^>]*>/g;
    this.pg.innerHTML=
      this.pg.innerHTML.replace(reg,"");
    this.paintShape();//重绘主角图
    this.paintWall();//重绘墙
    this.paintNext();//重绘备胎
    this.paintScore();//重绘得分
    this.paintState();//重绘状态
  },
  paintNext(){//重绘备胎
    //创建文档片段frag
    var frag=document.createDocumentFragment();
    //遍历nextShape中的cells数组
    for(var i=0;i<this.nextShape.cells.length;i++){
      //将当前cell临时保存在变量cell中
      var cell=this.nextShape.cells[i];
      var img=this.paintCell(cell,frag);
      //设置img的top为style的top+CSIZE
      img.style.top=
        parseFloat(img.style.top)+this.CSIZE+"px";
      //设置img的top为style的left+10*CSIZE
      img.style.left=
        parseFloat(img.style.left)
        +10*this.CSIZE+"px";
    }
    this.pg.appendChild(frag);//将frag追加到pg中
  },
  paintWall(){//绘制墙
    //创建文档片段frag
    var frag=document.createDocumentFragment();
    //r自底向上遍历wall中每一行
    for(var r=this.RN-1;r>=0;r--){
      //如果当前行是空行，就退出
      if(this.wall[r].join("")=="") break;
      //遍历wall中r行每个格
      for(var c=0;c<this.CN;c++){
        //将当前格临时保存在cell中
        var cell=this.wall[r][c];
        if(cell!==undefined)//跳过空格
          this.paintCell(cell,frag);//绘制cell
      }
    }
    this.pg.appendChild(frag);//将frag加入pg
  },
  paintCell(cell,frag){//绘制一个格
    var img=new Image();//新建一个image元素img
    img.src=cell.src;//设置img的src为cell的src
    //设置img的top为cell的r*CSIZE+OFFSET
    img.style.top=
      cell.r*this.CSIZE+this.OFFSET+"px";
    //设置img的left为cell的c*CSIZE+OFFSET
    img.style.left=
      cell.c*this.CSIZE+this.OFFSET+"px";
    //设置img的width为CSIZE
    img.style.width=this.CSIZE+"px";
    frag.appendChild(img);//将img追加到frag中
    return img;
  },
  paintShape(){//绘制主角图形
    //创建文档片段frag
    var frag=document.createDocumentFragment();
    //遍历shape中的cells数组
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前cell临时保存在变量cell中
      var cell=this.shape.cells[i];
      this.paintCell(cell,frag);
    }
    this.pg.appendChild(frag);//将frag追加到pg中
  },
}
game.start();
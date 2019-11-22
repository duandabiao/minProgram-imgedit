//index.js
//获取应用实例
const app = getApp()
const ctx = wx.createCanvasContext('myCanvas')
Page({
  data: {
    imgList: ["/img/1.jpg", "/img/2.jpg", "/img/3.jpeg", "/img/4.jpg"],
    isHidden:true,
    width:'',
    height:'',
    startX: 0,
    startY: 0
  },
  onLoad(){
    
    this.setData({
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight
    })
  },
  editImg(e){
    this.setData({isHidden:false})
    var src = e.currentTarget.dataset.src;
    var _this = this;
    // 获取图片的宽高
    wx.getImageInfo({
      src: src,
      success(res) {
        var imgRect = _this.containImg(0, 0, _this.data.width, _this.data.height, res.width, res.height);
        console.log(imgRect);
        ctx.drawImage(src,imgRect.dx, imgRect.dy, imgRect.dWidth, imgRect.dHeight); 
        ctx.draw();
      }
    })
  },
  downImg(e){

  },
  touchStart(e) {
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y//获取点击开始时的坐标
    ctx.setStrokeStyle("#000");//设置线的颜色
    ctx.setLineCap('round') //设置线两端的样式
    ctx.setLineWidth(20)//设置线的宽度
    ctx.beginPath()//开始画
  },
  touchMove(e) {
    let startX1 = e.changedTouches[0].x
    let startY1 = e.changedTouches[0].y//记录移动的坐标
    ctx.moveTo(this.startX, this.startY)//开始的坐标
    ctx.lineTo(startX1, startY1)//移动的坐标
    ctx.stroke()//画出当前路径
    this.startX = startX1;
    this.startY = startY1;//把移动的坐标赋值给开始坐标
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: ctx.getActions() // 获取绘图动作数组
    })
  },
  /*
  *sx 固定盒子的x坐标,sy 固定盒子的y左标
  *box_w 固定盒子的宽, box_h 固定盒子的高
  *source_w 原图片的宽, source_h 原图片的高
  */
  containImg(sx, sy, box_w, box_h, source_w, source_h){
    var dx = sx,
        dy = sy,
        dWidth = box_w,
        dHeight = box_h;
    if(source_w > source_h || (source_w == source_h && box_w < box_h)){
      dHeight = source_h * dWidth / source_w;
      dy = sy + (box_h - dHeight) / 2;
    }else if (source_w < source_h || (source_w == source_h && box_w > box_h)) {
      dWidth = source_w * dHeight / source_h;
      dx = sx + (box_w - dWidth) / 2;
    }
    return {
      dx,
      dy,
      dWidth,
      dHeight
    }
  }
})

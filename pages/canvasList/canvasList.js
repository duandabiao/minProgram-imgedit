// pages/canvasList/canvasList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',//图片地址
    imgWidth:'',//原图的宽
    imgHeight:'',//原图的高
    boxWidth: wx.getSystemInfoSync().windowWidth,//盒子的宽
    boxHeight: wx.getSystemInfoSync().windowHeight*0.9,//盒子的高
    tempPosition:{
      dx:'',
      dy:'',
      dWidth:'',
      dHeight:''
    },//目标canvas的属性值
    isChooseWidth:false,//是否点了线宽
    isChooseColor:false,//是否点了颜色
    allColor: ['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#ffaec9', '#a349a4', '#ffffff', '#c3c3c3'],//颜色面板
    allLine:[2,4,6,8,10],
    lineWidth:2,//默认线宽2
    lineColor:"#000000",//默认颜色是黑色
    isEraser:false,//橡皮擦是否被选中


    inputFocus:false,//控制input是否聚焦
    textValue:'',//文字内容
    textPx:100,//文字的x位置坐标
    textPy:100,//文字的y位置坐标
    isAddTextChoose:false,//是否选中了添加文字
    isTextSizeChoose:false,//是否选中了文字大小
    isTextColorChoose:false,//是否选中了文字颜色
    isTextBoldChoose:false,//是否选中了粗体
    isTextItalicChoose:false,//是否选中了斜体
    allTextFont:[12,16,20],//字体大小数组
    textSize:12,//默认字体大小
    textColor:"#000000",//默认字体颜色
  },
    /**
   * 文字添加的时候
   * 预览、线宽、线颜色、橡皮擦清除都是不能点的
   */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({imgUrl:options.src})
    var _this = this;
    wx.getImageInfo({
      src: _this.data.imgUrl,
      success(res) {
        var imgRect = _this.containImg(0, 0, _this.data.boxWidth, _this.data.boxHeight, res.width, res.height);
        _this.setData({
          tempPosition: imgRect,
          imgWidth: res.width,
          imgHeight: res.height
        })
      }
    })
    this.ctx = wx.createCanvasContext('myCanvas')
  },
  //文字改变
  inputChange(e){
    this.setData({
      textValue:e.detail.value
    })
  },
  // 改变线宽
  widthSliderChange(e) {
    this.setData({
      isChooseWidth: false,
      lineWidth: e.currentTarget.dataset.selected
    })
  },
  //改变颜色
  lineColorChange(e) {
    this.setData({
      isChooseColor: false,
      lineColor: e.currentTarget.dataset.selected
    })
  },
  //改变文字大小
  textSizeChange(e){
    this.setData({
      isTextSizeChoose: false,
      textSize: e.currentTarget.dataset.selected
    })
  },
  //改变文字颜色
  textColorChange(e){
    this.setData({
      isTextColorChoose: false,
      textColor: e.currentTarget.dataset.selected
    })
  },
  //选择线宽
  chooseLineWidth() {
    if (this.data.isAddTextChoose) return;
    if (this.data.isChooseWidth){
      this.setData({ isChooseWidth: false })
      return;
    }
    this.setData({
      isChooseColor: false,
      isChooseWidth: true,
      isEraser: false,
      isAddTextChoose: false,//是否选中了添加文字
      isTextSizeChoose: false,//是否选中了文字大小
      isTextColorChoose: false,//是否选中了文字颜色
    })
  },
  //选择颜色
  chooseLineColor(){
    if (this.data.isAddTextChoose) return;
    if (this.data.isChooseColor) {
      this.setData({ isChooseColor: false })
      return;
    }
    this.setData({
      isChooseColor: true,
      isChooseWidth: false,
      isEraser: false,
      isAddTextChoose: false,//是否选中了添加文字
      isTextSizeChoose: false,//是否选中了文字大小
      isTextColorChoose: false,//是否选中了文字颜色
    })
  },
  //添加文字
  chooseAddText(){
    if (this.data.isAddTextChoose){
      this.setData({ 
        isTextSizeChoose: false,
        isTextColorChoose: false,
        isAddTextChoose: false, 
        inputFocus: false, 
        textValue: '' 
      })
      return;
    }
    this.setData({
      isChooseColor: false,
      isChooseWidth: false,
      isEraser: false,
      isAddTextChoose: true,
      isTextSizeChoose: false,
      isTextColorChoose: false,
      textPx: 100,
      textPy: 100
    })
  },
  //选择文字大小
  chooseFontSize(){
    if (this.data.isTextSizeChoose){
      this.setData({
        isTextSizeChoose: false
      })
      return;
    }
    this.setData({
      isChooseColor: false,
      isChooseWidth: false,
      isEraser: false,
      isTextSizeChoose: true,//是否选中了文字大小
      isTextColorChoose: false,//是否选中了文字颜色
    })
  },
  //选择文字颜色
  chooseFontColor(){
    if (this.data.isTextColorChoose) {
      this.setData({
        isTextColorChoose: false
      })
      return;
    }
    this.setData({
      isChooseColor: false,
      isChooseWidth: false,
      isEraser: false,
      isTextSizeChoose: false,//是否选中了文字大小
      isTextColorChoose: true,//是否选中了文字颜色
    })
  },
  //选择文字粗体
  chooseFontBold(){
    this.setData({
      isTextBoldChoose: !this.data.isTextBoldChoose
    })
  },
  //选择文字斜体
  chooseFontItalic(){
    this.setData({
      isTextItalicChoose: !this.data.isTextItalicChoose
    })
  },
  //选择橡皮擦
  chooseEraser(){
    if (this.data.isAddTextChoose) return;
    this.setData({
      isEraser: !this.data.isEraser,
      isChooseColor: false,
      isChooseWidth: false,
    })
  },
  //选择清除
  chooseClear(){
    if (this.data.isAddTextChoose) return;
    this.setData({
      isChooseColor: false,
      isChooseWidth: false,
      isEraser: false
    })
    this.ctx.clearRect(0, 0, this.data.boxWidth, this.data.boxHeight);
    this.ctx.draw(true);
  },
  //选择预览
  /**
   * 第一步：把当前的canvas变成图片
   * 第二步：把原图片和第一步的图片都放大目标canvas里
   * 第三步：把目标canvas转化为图片
   * 第四步：预览图片
   */
  choosePreview(){
    if (this.data.isAddTextChoose) return;
    wx.showLoading({ title: 'loading...'})
    var _this = this;
    var tempPosition = _this.data.tempPosition;
    wx.canvasToTempFilePath({
      x: tempPosition.dx,
      y: tempPosition.dy,
      width: tempPosition.dWidth,
      height: tempPosition.dHeight,
      canvasId: 'myCanvas',
      success: function (res) {
        var ctx = wx.createCanvasContext('tempCanvas')
        ctx.drawImage(_this.data.imgUrl, 0, 0, tempPosition.dWidth,tempPosition.dHeight);
        ctx.drawImage(res.tempFilePath, 0, 0, tempPosition.dWidth, tempPosition.dHeight);
        ctx.draw()
        setTimeout(function(){
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: tempPosition.dWidth,
            height: tempPosition.dHeight,
            destWidth: _this.data.imgWidth,
            destHeight: _this.data.imgHeight,
            fileType: 'png',
            quality: 1,
            canvasId: 'tempCanvas',
            success: function (res2) {
              wx.previewImage({
                current: res2.tempFilePath,
                urls: [res2.tempFilePath],
                success:function(){
                  wx.hideLoading()
                },
                fail:function(){
                  wx.hideLoading()
                  wx.showToast({ title: '预览失败', icon: 'none' })
                }
              })
            },
            fail:function() {
              wx.hideLoading()
              wx.showToast({ title: '预览失败', icon: 'none' })
            }
          })
        },200)
      },
      fail:function(){
        wx.hideLoading()
        wx.showToast({ title: '预览失败', icon: 'none' })
      }
    })
  },
  touchStart(e){
    // 开始画图，隐藏所有的操作栏
    this.setData({
      isChooseWidth: false,
      isChooseColor: false
    })
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y//获取点击开始时的坐标
  },
  touchMove(e){
    if (this.data.isEraser) {
      this.ctx.clearRect(e.touches[0].x,e.touches[0].y, 30, 30)
      this.ctx.draw(true);
    } else {
      this.ctx.setStrokeStyle(this.data.lineColor);
      this.ctx.setLineWidth(this.data.lineWidth);
      this.ctx.setLineCap('round');
      this.ctx.setLineJoin('round');
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(e.touches[0].x,e.touches[0].y);
      this.ctx.stroke();
      this.ctx.draw(true);
    }
    this.startX = e.touches[0].x
    this.startY = e.touches[0].y
  },
  textStart(e){
    this.touchStart_x = e.touches[0].pageX;
    this.touchStart_y = e.touches[0].pageY;
    this.boxStartX = this.data.textPx;
    this.boxStartY = this.data.textPy;
  },
  //文字移动
  textMove(e){
    this.touchMove_x = e.touches[0].pageX - this.touchStart_x;
    this.touchMove_y = e.touches[0].pageY - this.touchStart_y;
    this.setData({
      textPx: this.boxStartX + this.touchMove_x,
      textPy: this.boxStartY + this.touchMove_y
    })
  },
  //文字取消
  textCancel(){
    this.setData({ isAddTextChoose: false, inputFocus: false, textValue: '', textPx: 100, textPy: 100 })
  },
  //文字完成
  textDone(){
    //如果文字是空则执行取消函数
    if(this.data.textValue==''){
      this.textCancel();
      return;
    }
    wx.showLoading({ title: '保存文字', mask: true })
    this.ctx.save();//保存绘图上下文
    this.ctx.setFillStyle(this.data.textColor);//设置颜色
    var fontStyle = this.data.isTextItalicChoose ? 'italic' : 'normal';
    var fontWeight = this.data.isTextBoldChoose ? 'bold' : 'normal';
    this.ctx.font = fontStyle + ' ' + fontWeight + ' ' + this.data.textSize + 'px sans-serif';//设置字体样式、粗细、大小
    this.ctx.setTextAlign('left')
    this.ctx.setTextBaseline('top')
    this.ctx.fillText(this.data.textValue, this.data.textPx, this.data.textPy);
    this.ctx.restore(); //恢复之前保存的绘图上下文
    this.ctx.draw(true);
    this.setData({ isAddTextChoose: false, inputFocus: false, textValue: '', textPx: 100, textPy:100 })
    wx.hideLoading();
  },
  //点击展示文字调起输入框
  clickTextShow(){
    this.setData({ inputFocus: true, })
  },
  /*
  *sx 固定盒子的x坐标,sy 固定盒子的y左标
  *box_w 固定盒子的宽, box_h 固定盒子的高
  *source_w 原图片的宽, source_h 原图片的高
  */
  containImg(sx, sy, box_w, box_h, source_w, source_h) {
    var dx = sx,
      dy = sy,
      dWidth = box_w,
      dHeight = box_h;
    if (source_w > source_h || (source_w == source_h && box_w < box_h)) {
      dHeight = source_h * dWidth / source_w;
      dy = sy + (box_h - dHeight) / 2;
    } else if (source_w < source_h || (source_w == source_h && box_w > box_h)) {
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
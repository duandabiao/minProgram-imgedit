//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgList: ["/img/1.jpg", "/img/2.jpg", "/img/3.jpeg", "/img/4.jpg"]
  },
  onLoad() {
    
  },
  editImg(e) {
    var src = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: '/pages/canvasList/canvasList?src='+src
    })
  }
})

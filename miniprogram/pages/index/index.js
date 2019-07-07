//index.js
const app = getApp()

Page({
    data: {
        
    },
    toPage: function(e) {
        var page=e.currentTarget.dataset.page;
        
        wx.navigateTo({
            url: '../'+page+'/'+page,
        })
    },
    onLoad: function() {
        
        var isLogin = wx.getStorageSync('isLogin');
        if (isLogin==false){
            wx.redirectTo({
                url: '../login/login',
            })
        }
        
    }

    

   
   

})
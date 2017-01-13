//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData:{
    userInfo:null,
  },

  getTask(task_id){
      let tasks = wx.getStorageSync('tasks')||[];
      const task =  tasks.find(x => Number(task_id) === x.task_id);
      return task;
      },

  changeTask(task){
        let tasks = wx.getStorageSync('tasks')||[];
        tasks = tasks.map(x => {
             if (Number(task.task_id) === x.task_id) {
                 x = task;
             }
             return x;
         });
         wx.setStorage({
         key: 'tasks',
         data: tasks,
       });
         return tasks;

    },
      
 })

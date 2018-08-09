var app = getApp()
var API = require('../../utils/API.js')

Page({
    data: {
        input:'',
        focus:false,
        sort:wx.getStorageSync('sort')||0,
        tasks:wx.getStorageSync('tasks')||[],
        scrollAtTop:true,
        toggleDoneText:"显示已完成任务",
        showDoneTask:false
    },

     getInput(e){
         this.setData({
            input: e.detail.value,
         });
     },

     addTask(){
         if(this.data.scrollAtTop){
             this.setData({
                 focus:true
             })
         } else{
             this.setData({
             scrollHeight:0,
             addTasking:true
             })
         }
     },

     bindscroll(e){
         if (e.detail.scrollTop == 0) {
             this.setData({
                 scrollAtTop:true
             })
         } else {
             this.setData({
                 scrollAtTop:false
             })
         }
     },



     scrollToTop(){
         var addTasking = this.data.addTasking;
         if (addTasking){
             console.log("toTop");
         this.setData({
             focus:true,
         })
         }
     },

     blurSet(){
         this.setData({
             focus:false,
             addTasking:false,
         })
     },


    saveNewTask(e){
        var that = this
        let {input,sort} = this.data;
        // let id = sort;
        // let tasks = wx.getStorageSync('tasks')||[];
        const newTask = {
            // id,
            title:this.data.input,
            isDone:false,
            note:'',
             };
        if (input.trim().length === 0) return;
        // tasks.unshift(newTask);
        newTask.note = input
        API.submitTask(newTask).then( function(){
            that.refresh()
        })
        this.setData({
        //  tasks,
         focus:true,
         input:'',
        //  sort:sort+1,
         scrollHeight:0,
     });


    this.syncData();

 },

 syncData(){
     wx.setStorage({
         key: 'tasks',
         data: this.data.tasks,
       });

     wx.setStorage({
         key: 'sort',
         data: this.data.sort,
       })
 },

  deleteTask(e){
      var that = this
        var id = e.currentTarget.dataset.taskid;
        console.log(id);
        API.deleteTask(id).then( function(tasks){
            console.log("tasks",tasks)
            that.setData({
                tasks
            })
            // that.refresh()
        })
        //   let tasks = wx.getStorageSync('tasks');
        //   console.info(tasks);
        //   tasks = tasks.filter(x => Number(id) !== x.id);
        //   console.log(tasks);
        //   this.setData({
        //       tasks,
        //   });
        //   this.checkDoneTask();
        //   this.syncData();
     },

toggleDone(){
    var showDoneTask = this.data.showDoneTask;
    this.setData({
        toggleDoneText:"隐藏已完成任务",
        showDoneTask:!showDoneTask
    })
},

checkDoneTask(){
    var that = this
    API.getTasks().then(function(tasks){
        console.log(tasks)
        var hasDoneTask = tasks.some( task => task.isDone);
        console.log("hasdone",hasDoneTask)
        if(hasDoneTask){
            console.log('有完成的')
            that.setData({
                hasDoneTask,
                showDoneTask:true
            })
        }
    })
        
        
        
},

refresh(){
    var that = this
    API.getMyUserInfo().then(function (myUserInfo) {
        console.log(myUserInfo)
    })
    //查找某个用户的tasks
    API.getTasks().then(function (tasks){
        console.log("tasks",tasks)
        that.tasks = tasks
        that.setData({
            tasks,
        })
    })
},


    toggleCheck(e){
        var that = this
        console.log("toggle");
        // var id = e.currentTarget.taskid;
        var {taskid} = e.currentTarget.dataset
        console.log(taskid);
        API.changeTask(taskid).then(function(){
            that.refresh()
        })
        // let task = app.getTask(id);
        // task.isDone = !task.isDone;
        // this.setData({
        //     tasks:app.changeTask(task)
        // });
        this.checkDoneTask();

    },

     openTaskDetail(e){
         var id = e.currentTarget.id;
         console.log(e.currentTarget.id)
         wx.navigateTo({
             url: '../task/task?id='+id
         });
        },

    onShareAppMessage: function (x) {
    return {
      title: '简单好用的待办事项清单',
      path: '/pages/list/list'
    }
  },

  onLoad: function() {
    var windowHeight = 603;
    wx.getSystemInfo({
      success: function(res) {
          windowHeight = res.windowHeight;
      }
    })
    this.setData({
        windowHeight,
    })
  },
  

  onShow: function() {
    this.checkDoneTask();
    this.refresh();
    this.setData({
        tasks:wx.getStorageSync('tasks'),
        //从返回list 页面时重新渲染
    });

  }


})

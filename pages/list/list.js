var app = getApp()
var API = require('../../utils/API.js')

Page({
    data: {
        input:'',
        focus:false,
        sort:0,
        tasks:[],
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
        let {input} = this.data;
        const newTask = {
            title:this.data.input,
            isDone:false,
            note:'',
        };
        if (input.trim().length === 0) return;
        API.submitTask(newTask).then( function(){
            that.refresh()
        })
        this.setData({
         focus:true,
         input:'',
         scrollHeight:0,
     });
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
        })
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
    API.loadMyUserInfo().then(function(tasks){
        console.log(tasks)
        var hasDoneTask = tasks.some( task => task.isDone);
        if(hasDoneTask){
            that.setData({
                tasks,
                hasDoneTask,
                showDoneTask:true
            })
        }
    })
},

refresh(){
    var that = this
    API.loadMyUserInfo().then(function (tasks){
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
    var {taskid} = e.currentTarget.dataset
    API.getTaskDetail(taskid).then(function(task){
        task.isDone = !task.isDone
        API.changeTask(taskid,task).then(function(task){
            that.refresh()
        })
    })
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


}


})

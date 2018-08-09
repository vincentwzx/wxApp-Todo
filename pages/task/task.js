var API = require('../../utils/API.js')
var app = getApp()
Page({

  onLoad: function(options) {  
    var that = this
    console.log(options)
    var id = options.id
    this.refresh(id)
  },
    data:{
      focusContent:false,
    },

      toggleCheck(e){
        var that = this
        console.log("toggle");
        var task = this.data.task
        task.isDone = !task.isDone
        console.log(task)
        var taskid = e.currentTarget.dataset.taskid
        API.changeTask(taskid,task).then(function(task){
            that.refresh(taskid)
        })
    },

    refresh(id){
      var that = this
      API.getTaskDetail(id).then( function(task){
        that.setData({
          task
        })
      })
    },

    focusOffTitle(e){
      var that = this
      let input = e.detail.value;
      let {task} = this.data;
      task.title = input;
      var id = task._id
      console.log(task)
      API.changeTask(id,task).then(function(newTask){
        that.refresh(id)
        that.setData({
          focusContent:false,
        });
      })
     },

    focusOnContent(){
      this.setData({
        focusContent:true,
      });
    },

    focusOffContent(e){
      var that = this
      let {task} = this.data;
      task.note = e.detail.value;
      var note = task.note
      var id = task._id
      console.log(task)
      API.changeTask(id,task).then(function(newTask){
        that.setData({
          task:newTask,
          focusContent:false,
        });
      })
      
    }

})

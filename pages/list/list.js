var app = getApp()
Page({
    data: {
        input:'',
        focus:true,
        task_id:0,
    },

     getInput(e){
         this.setData({
            input: e.detail.value,
         });
     },

    saveNewTask(e){
        let {input,task_id} = this.data;
        let {tasks} = app.globalData;
        const newTask = {
            task_id:task_id,
            taskContent:this.data.input,
            completed:false,
            note:'',
             };
        if (input.trim().length === 0) return;
        tasks.push(newTask);
        this.setData({
         tasks,
         focus:true,
         input:'',
         task_id:task_id+1,
     });
     wx.setStorage({
         key: 'tasks',
         data: this.data.tasks,
       })

 },

  deleteTask(e){
          var id = e.currentTarget.id;
          app.globalData.tasks = app.globalData.tasks.filter(x => Number(id) !== x.task_id);
          this.setData({
              tasks:app.globalData.tasks,
          });
          console.log(this.data);
          console.log(app.globalData);
     },


    toggleCheck(e){
        var id = e.currentTarget.id;
        let task = app.getTask(id);
        task.completed = !task.completed;
        this.setData({
            tasks:app.changeTask(task)
        });
        console.log(this.data);
          console.log(app.globalData);
    },

     openTaskDetail(e){
         var task_id = e.currentTarget.id;
         console.log(e.currentTarget.id)
         wx.navigateTo({
             url: '../task/task?task_id='+task_id
         });
        },

    onShareAppMessage: function (x) {
    return {
      title: 'Keep Calm',
      desc: 'And get SHIT done',
      path: '/pages/list/list?'
    }
  },

  onShow: function() {
      var {tasks} = app.globalData;
    this.setData({
        tasks,
    //从返回list 页面时重新渲染
    })
  }


})

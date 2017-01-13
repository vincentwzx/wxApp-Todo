var app = getApp()
Page({
    data: {
        input:'',
        focus:true,
        task_id:wx.getStorageSync('task_id')||0,
        tasks:wx.getStorageSync('tasks')||[],
        
    },

     getInput(e){
         this.setData({
            input: e.detail.value,
         });
     },

    saveNewTask(e){
        let {input,task_id} = this.data;
        let tasks = wx.getStorageSync('tasks')||[];
        // 为什么这里如果写成 let{tasks} = this.data; 会报错错？说push 不是 function 
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
     this.syncData();

 },

 syncData(){
     wx.setStorage({
         key: 'tasks',
         data: this.data.tasks,
       });

     wx.setStorage({
         key: 'task_id',
         data: this.data.task_id,
       })
 },

  deleteTask(e){
          var id = e.currentTarget.id;
          let tasks = wx.getStorageSync('tasks');
          tasks = tasks.filter(x => Number(id) !== x.task_id);
          this.setData({
              tasks,
          });
          this.syncData();
     },


    toggleCheck(e){
        var id = e.currentTarget.id;
        let task = app.getTask(id);
        task.completed = !task.completed;
        this.setData({
            tasks:app.changeTask(task)
        });
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
      path: '/pages/list/list'
    }
  },

  onShow: function() {
    this.setData({
        tasks:wx.getStorageSync('tasks'),
    //从返回list 页面时重新渲染
    })
  }


})

var app = getApp()
Page({

  onLoad: function(options) {  
    let task_id = options.task_id;
    let task = app.getTask(task_id);
    this.setData({    
      task_id,
      task
    }) 
  },
    data:{
      focusNote:true,
    },

      toggleCheck(e){
        let {task_id} = this.data;
        let task = app.getTask(task_id);
        //为什么不能把上面这句删掉，直接使用 this.data 中的 task 来赋值给函数中的 tasktask?
        task.completed = !task.completed;
        this.setData({
            tasks:app.changeTask(task),
            task:app.getTask(task_id)
        })
    },

     getNote(e){

      let {task_id} = this.data;
      let task = app.getTask(task_id);
      task.note = e.detail.value;
      this.setData({
            tasks:app.changeTask(task),
            task:app.getTask(task_id)
        })
    },

    focusOnNote(){
      console.log(this.data.focusNote);
      this.setData({
        focusNote:true,
      });
      console.log(this.data.focusNote);
    },

    focusOffNote(){
      console.log(this.data.focusNote);
      this.setData({
        focusNote:false,
      });
      console.log(this.data.focusNote);
    }









})

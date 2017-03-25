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
        let {task_id,task} = this.data;
        task.completed = !task.completed;
        this.setData({
            tasks:app.changeTask(task),
            task,
        })
    },

    changeTaskContent(e){
        let input = e.detail.value;
        let {task} = this.data;
        task.taskContent = input;
        this.setData({
            tasks:app.changeTask(task),
            task,
           })

     },

     getNote(e){

      let {task,task_id} = this.data;
      task.note = e.detail.value;
      this.setData({
            tasks:app.changeTask(task),
            task,
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

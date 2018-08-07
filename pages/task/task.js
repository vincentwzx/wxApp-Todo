var app = getApp()
Page({

  onLoad: function(options) {  
    let id = options.id;
    let task = app.getTask(id);
    this.setData({    
      id,
      task
    }) 
  },
    data:{
      focusContent:false,
    },

      toggleCheck(e){
        let {id,task} = this.data;
        task.state = !task.state;
        this.setData({
            tasks:app.changeTask(task),
            task,
        })
    },

    changeTitle(e){
        let input = e.detail.value;
        let {task} = this.data;
        task.title = input;
        this.setData({
            tasks:app.changeTask(task),
            task,
           })

     },

     getContent(e){

      let {task,id} = this.data;
      task.content = e.detail.value;
      this.setData({
            tasks:app.changeTask(task),
            task,
        })
    },

    focusOnContent(){
      this.setData({
        focusContent:true,
      });
    },

    focusOffContent(){
      this.setData({
        focusContent:false,
      });
    }

})

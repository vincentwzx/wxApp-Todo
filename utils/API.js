const url = 'http://localhost:3000/'

var getNewSession = function () {
	//在确定本地没有 session 或者 session 失效的时候使用
	return new Promise(function (resolve, reject) {
		console.log('调用getNewSession');
		wx.login({
			success: function (res) {
				if (res.code) {
					wx.request({
						url: url+'login',
						data: {
							code: res.code,
						},
						method: 'GET',
						success: function (res) {
							if (res.statusCode == 200) {
								var session = res.data.session;
								wx.setStorage({
									key: 'session',
									data: session,
								})
								wx.hideLoading();
								resolve(session);
							}
							else {
								wx.showToast({
									title: '登录失败',
								})
							}
						}
					});
				} else {
					reject(new Error('获取用户登录态失败！' + res.errMsg));
					wx.showToast({
						title: '登录失败',
					})
				}
			}
		})
	})
}

var getSession = function () {
	return new Promise(function (resolve, reject) {
		var session = wx.getStorageSync('session');
		if (session) {
			checkSession().then(function (result) {
				if (result) {
					resolve(session);
				}
				else {
					getNewSession().then(function (session) {
						resolve(session);
					})
				}
			})
		}
		else {
			getNewSession().then(function (session) {
				resolve(session);
			})
		}
	})
}

var checkSession = function () {
	//用来检查本地的 session 是否有效
	return new Promise(function (resolve, reject) {
		var session = wx.getStorageSync('session');
		var checked = wx.getStorageSync('checked');
		if (session) {
			if (checked) {
				var result = true;
				resolve(result);
			}
			else {
				wx.request({
					url: url+'login',
					data: {
						session: session,
					},
					method: 'POST',
					success: function (res) {
						if (res.data.result) {
							//如果检查结果正确，就将结果保存起来，本次小程序生命周期中都不用再到服务器检查了 
							wx.setStorage({
								key: 'checked',
								data: res.data.result,
							})
						}
						resolve(res.data.result);
					}
				})
			}
		}
	})
}


var loadMyUserInfo = function () {
	var app = getApp();
	return new Promise(function (resolve, reject) {
		console.log('调用 reloadMyUserInfo');
		getSession().then(function (session) {
			//获取个人除了 openid 以外的全部信息
			wx.request({
				url: url+'users/me',
				data: { session },
				method: 'GET',
				success: function (res) {
					if (res.statusCode == 200) {
						wx.hideLoading();
						var myUserInfo = res.data.myUserInfo;
						// if (myUserInfo.info.name) {
							app.globalData.myUserInfo = myUserInfo;
							resolve(myUserInfo);
					}
					else {
						wx.showToast({
							title: 'loadMyUserInfo 获取用户信息失败',
						})
					}
				},
				fail: function (error) {
					console.log(error)
					reject(error)
				}
			})
		}).catch(error => {
			console.log(error)
		})
	})
}

var getMyUserInfo = function () {
	var app = getApp();
	return new Promise(function (resolve, reject) {
		if (app.globalData.myUserInfo) {
			resolve(app.globalData.myUserInfo)
		}
		else loadMyUserInfo().then(function (myUserInfo) {
			resolve(myUserInfo);
		})
	})
}

var submitTask = function(newTask){
        console.log('submitTask');
        return new Promise(function (resolve, reject) {
            getSession().then(function (session) {
                wx.request({
                    url:url+'tasks',
                    data:{session,newTask},
                    method:'POST',
                    success: function (res) {
                        if (res.statusCode == 201) {
                            wx.hideLoading();
                            resolve(res.data.newTask);
                        }
                        else {
                            wx.showToast({
                                title: '保存失败'
                            })
                        }
                    }
                })
        })
    })
}

var getTasks = function(){
    console.log('getTasks');
    return new Promise(function (resolve, reject) {
        getSession().then(function (session) {
            wx.request({
                url:url+'tasks/me',
                data:{
                    session: session,
                },
                method:'GET',
                success: function (res) {
                    if (res.statusCode == 201) {
                        wx.hideLoading();
                        resolve(res.data.tasks);
                    }
                    else {
                        wx.showToast({
                            title: '获取失败'
                        })
                    }
                }
            })
        })
    })
}

var changeTask = function(id){
    console.log('getTaskById');
    return new Promise(function (resolve, reject) {
        wx.request({
            url:url+'tasks/toggle',
            data:{
                _id: id,
            },
            method:'POST',
            success: function (res) {
                if (res.statusCode == 201) {
                    wx.hideLoading();
                    resolve(res.data.tasks);
                }
                else {
                    wx.showToast({
                        title: '获取失败'
                    })
                }
            }
        })
    })
}

var deleteTask = function(id){
    console.log('deleteTask');
    return new Promise(function (resolve, reject) {
        getSession().then(function (session) {
            wx.request({
                url:url+'tasks/delete',
                data:{
                    session:session,
                    _id: id,
                },
                method:'POST',
                success: function (res) {
                    if (res.statusCode == 201) {
                        wx.hideLoading();
                        resolve(res.data.tasks);
                    }
                    else {
                        wx.showToast({
                            title: '获取失败'
                        })
                    }
                }
            })
        })
    })   
}

module.exports = {
	getSession,
	getNewSession,
	checkSession,
    getMyUserInfo,
    loadMyUserInfo,
    submitTask,
    getTasks,
    changeTask,
    deleteTask
}
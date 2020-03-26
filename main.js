// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
  dialog
} = require('electron')
const path = require('path')
const glob = require('glob')
const axios = require('axios')
const qs = require('qs')
var appshow = true
var show_diglog = true
var main_windows_show = true
var client_config = ''
var client_cookies = ''
var server_url=''
var username=''
var password=''

function init() {

  loadDemos()

  function createWindow() {
    function re_cookie (){
      setInterval(()=>{
        axios({
          url: `${server_url}/client/list`,
          method: 'post',
          data: qs.stringify({
            search: '',
            order: 'asc',
            offset:'0',
            limit:'10'
          }),
          headers: {
            cookie: client_cookies
          }
        }).then(res=>{
          // console.log(res.data)
          
        }).catch(err=>{
          console.log(err)
          
        })
      },600000)
     
    }
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 360,
      height: 640,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
      }
    })
    app.on('before-quit', event => {

    })
    ipcMain.on('tray', function () { //news 是自定义的命令 ，只要与页面发过来的命令名字统一就可以
      //接收到消息后的执行程序
      var trayMenuTemplate = [{
          label: '设置',
          click: function () {} //打开相应页面
        },
        {
          label: '意见反馈',
          click: function () {}
        },
        {
          label: '帮助',
          click: function () {}
        },
        {
          label: '关于我们',
          click: function () {}
        },
        {
          label: '退出软件',
          click: function () {
            //ipc.send('close-main-window');
            app.quit();
            // mainWindow.destroy()

          }
        }
      ];

      //系统托盘图标目录
      appTray = new Tray(path.join(__dirname, 'static', 'img', 'icon.png'));
      //图标的上下文菜单
      const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
      //设置此托盘图标的悬停提示内容
      appTray.setToolTip('内网穿透');
      //设置此图标的上下文菜单
      appTray.setContextMenu(contextMenu);
      appTray.on('click', () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
        mainWindow.show()
        main_windows_show = true
        // appTray.setHighlightMode('always')
        mainWindow.setSkipTaskbar(true);
        if (!appshow) {

        }
      })

      mainWindow.on('close', (event) => {
        const options = {
          type: 'info',
          title: 'information',
          message: "如果您要退出，请从右下角关闭",
          buttons: ['知道了']
        }
        appshow = false
        mainWindow.hide();
        mainWindow.setSkipTaskbar(true);
        if (main_windows_show) {
          event.preventDefault();
        }
        main_windows_show = false
        if (show_diglog) {
          dialog.showMessageBox(options, (index) => {
            if (index == 0) {
              show_diglog = false
            }
          })

        }

      });
      mainWindow.on('show', () => {
        appTray.setHighlightMode('always')
      })
      mainWindow.on('hide', () => {
        appTray.setHighlightMode('never')
      })

    })
    ipcMain.on('get_cookie', (event, arg) => {
      // console.log(arg); // prints "ping"
      // client_cookies = arg
      event.returnValue = client_cookies;
    })
    ipcMain.on('login', (event, arg) => {
      // console.log(arg); // prints "ping"  
      server_url=arg.url 
      axios({
        url: `${server_url}/login/verify`,
        method: 'post',
        data: qs.stringify({
          username: arg.username,
          password: arg.password
        })
      }).then(res=>{
        if(res.data.status == 1 && res.data.msg == 'login success'){
          client_cookies=(((res.headers['set-cookie'])[0]).split(';'))[0]
          // get_list(client_cookies)
          event.returnValue = 'login_success';
        }else{
          event.returnValue = res.data.msg;
        }     
      }).catch(err=>{

      })
    })
    ipcMain.on('get_list',(event,arg)=>{
      axios({
        url: `${server_url}/client/list`,
        method: 'post',
        data: qs.stringify({
          search: '',
          order: 'asc',
          offset:'0',
          limit:'10'
        }),
        headers: {
          cookie: client_cookies
        }
      }).then(res=>{
        // console.log(res.data)
        re_cookie()
        event.returnValue = res.data;
      }).catch(err=>{
        console.log(err)
        event.returnValue = err;
      })
    })
    ipcMain.on('get_config',(event,arg)=>{
      axios({
        url: `${server_url}/static/conf`,
        method: 'get',
      }).then(res=>{      
        event.returnValue = qs.parse(res.data) ;
      }).catch(err=>{
        console.log(err)
        event.returnValue = err;
      })
    })
    //屏蔽顶部菜单
    Menu.setApplicationMenu(null)



    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/static/img/png/icon.png')
    }


    // tray_icon = path.join(__dirname, '/static/img/png/icon.png')
    // let appIcon = null
    // const iconName = process.platform === 'win32' ? tray_icon : tray_icon
    // const iconPath = path.join(__dirname, iconName)
    // appIcon = new Tray(iconPath)

    // const contextMenu = Menu.buildFromTemplate([{
    //   label: 'Remove',
    //   click: () => {
    //     event.sender.send('tray-removed')
    //   }
    // }])

    // appIcon.setToolTip('Electron Demo in the tray.')
    // appIcon.setContextMenu(contextMenu)







    // and load the index.html of the app.
    mainWindow.loadFile('login.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
  }




  ipcMain.on('upload_client_config', (event) => {
    console.log('接受数据', event)
  })
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    const options = {
      type: 'info',
      title: '确认关闭软件？',
      message: "关闭软件，穿透服务将无法运行。",
      buttons: ['我要关闭', '还要运行']
    }
    if (main_windows_show) {
      if (process.platform !== 'darwin') app.quit()
    }
    // 
    // dialog.showMessageBox(options, (index) => {
    //   if(index==0){
    //     if (process.platform !== 'darwin') app.quit()
    //   }
    // })


  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function loadDemos() {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => {
    require(file)
  })
}

init()
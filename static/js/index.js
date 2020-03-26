window.onload = function () {


  ipc.send('tray') //注册的指令。send到主进程main.js中。
  var client_list = (ipc.sendSync('get_list')).rows //获取客户端列表
  var select_iteam = []
  var connect_vkey = ''
  for (var i = 0; i < client_list.length; i++) {
    select_iteam.push(`${client_list[i].Id}: ${client_list[i].Remark}`)
  }
  var server_con = ipc.sendSync('get_config')
  console.log(server_con)
  $(".loading2").hide();
  var send_obj = {
    net: {
      ip: '0.0.0.0',
      addr: '',
    },
    os: {
      type: os.type(),
      arch: os.arch(),
      release: os.release(),
      platform: os.platform()
    }
  }
  axios({
    url: 'https://www.ip.cn/',
    method: 'get',
  }).then((result) => {
    var $ = cheerio.load(result.data);
    var result_code = $('code')
    if ($('div').hasClass('well')) {
      var ip = (result_code[0].children)[0].data
      var addr = (result_code[1].children)[0].data
      send_obj.net.ip = ip
      send_obj.net.addr = addr
      console.log('系统信息', send_obj)
    } else {
      console.log('系统信息', send_obj)
    }
  }).catch((err) => {

  });

  $('.test1').on('click', () => {
    window.location.href = './buy.html'
  })
  var $client_connect = $('.client_connect')
  var $client_connect_i = $('.client_connect_i')
  var $npc_log = $('.npc_log')
  var is_connect = false
  var result
  $client_connect.on('click', () => {
    if (!is_connect) {
      if (connect_vkey) {
        $client_connect.addClass('weui-btn_loading')
        $client_connect_i.addClass('weui-loading')
        if (os.arch() == 'x64') {
          var sss = path.join(__dirname, 'static', 'npc', 'npc64.exe')
        } else {
          var sss = path.join(__dirname, 'static', 'npc', 'npc32.exe')
        }

        result = cp.spawn(sss, [`-server=${server_con.connect_ip||server_con.connect_http}:${server_con.connect_port}`, `-vkey=${connect_vkey}`, `-type=${server_con.connect_type}`]);
        result.on('close', function (code, signal) {
          if (code) {
            console.log('child process exited with code :' + code);
            $npc_log.text('子程序退出代码 :' + code)
          } else {
            console.log('child process signal with code :' + signal);
            $npc_log.text('子程序退出信号 :' + signal)
          }



        });
        result.stdout.on('data', function (data) {
          $npc_log.text(iconv.decode(data, 'GBK'))
          console.log('stdout', iconv.decode(data, 'GBK'))
          // console.log('stdout', data.toString())
          console.log('子进程ID', result.pid)
          nps_pid = result.pid
        });
        result.stderr.on('data', function (data) {
          // console.log('stderr',data)
        });
        $('.choose_client').attr('style', 'display:none')
        setTimeout(() => {
          $client_connect.removeClass('weui-btn_loading')
          $client_connect.text('已连接')
          $client_connect_i.removeClass('weui-loading')
          is_connect = true
        }, 2000)
      } else {
        $.alert("您还未选择连接客户端", "请先选择客户端", function () {

        });
      }

    } else {
      $client_connect.addClass('weui-btn_loading')
      $client_connect_i.addClass('weui-loading')
      var nps_kill = result.kill('SIGTERM');
      if (nps_kill) {
        $client_connect.removeClass('weui-btn_loading')
        $client_connect.text('点击连接')
        $client_connect_i.removeClass('weui-loading')
        $('.choose_client').attr('style', 'display')
        is_connect = false
      }
    }


  })
  $("#job").select({
    title: "请选择要连接的客户端",
    items: select_iteam,
    onChange: function (d) {
      var client_id = ((d.values).split(':'))[0]
      for (var i = 0; i < client_list.length; i++) {
        if (client_list[i].Id == client_id) {

          connect_vkey = client_list[i].VerifyKey
        }
      }
    },
    onClose: function () {
      console.log("close");
    },
    onOpen: function () {
      console.log("open");

    },
  });



}
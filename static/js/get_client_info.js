// var axios = require('axios')
var cheerio = require('cheerio');
var os = require('os')



function client_info() {
    
        var send_obj = {
            net: {
                ip: '0.0.0.0',
                addr: '',
            },
            os: {
                type: os.type(),
                arch: os.arch(),
                release:os.release(),
                platform:os.platform()
            }


        }
        axios({
            url: 'https://www.ip.cn/',
            method: 'get',
        }).then((result) => {
            var $ = cheerio.load(result.data);
            var result_code = $('code')
            // console.log($('div').hasClass('well'))
            if ($('div').hasClass('well')) {
                var ip = (result_code[0].children)[0].data
                var addr = (result_code[1].children)[0].data
                // var GeoIP = (result_code[2].children)[0].data
                // console.log(ip)
                // console.log(addr)
                // console.log(GeoIP)
                send_obj.net.ip=ip
                send_obj.net.addr=addr
                resolve(send_obj)
            }else{
                resolve(send_obj)
            }
        }).catch((err) => {

        });
    
}

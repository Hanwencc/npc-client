var os = require('os')
var axios = require('axios')
var cheerio = require('cheerio');
var sys = require('systeminformation')
console.log('返回操作系统类型', os.type())
console.log('返回操作系统 CPU 架构', os.arch())
console.log('返回系统发行版本', os.release())
console.log("返回操作系统名：",os.platform())
// console.log('CPU/内核的信息',os.cpus())
// console.log('网络信息',os.networkInterfaces())
// axios({
//     url:"https://ifconfig.me/ip",
//     method:'get'
// }).then(res=>{
//     console.log(res.data)
// })
// axios.get('https://ifconfig.me/ip').then(res=>{
//     console.log(res.data)
// }).catch(err=>{
//     console.log(err)
// })
axios({
    url: 'https://www.ip.cn/',
    method: 'get',
    //   data:qs.stringify(sendobj),
    //   headers:{
    //     'Content-Type':'application/x-www-form-urlencoded'
    //   },
    // proxy: {
    //   host: '127.0.0.1',
    //   port: 8888,

    // },

}).then((result) => {
    var $ = cheerio.load(result.data);
    var result_code=$('code')
    // console.log($('div').hasClass('well'))
    if ($('div').hasClass('well')) {
        var ip = (result_code[0].children)[0].data
        var addr = (result_code[1].children)[0].data
        var GeoIP = (result_code[2].children)[0].data
        console.log(ip)
        console.log(addr)
        console.log(GeoIP)
    }

    

    // console.log(result.data)
    // var result_url=$('#shorturl').text()
    // console.log('result',result_url)
    // resolve(url)

}).catch((err) => {

});
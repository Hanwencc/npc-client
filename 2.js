var axios = require('axios')
var qs = require('qs')
// var ss={
//     username:'admin',
//     password:'123'
// }
// axios({
//     url:'http://60.10.227.41:8899/login/verify',
//     method:'post',
//     headers:{

//     },
//     data:qs.stringify(ss)
// }).then(res=>{
//     // var se=
//     var see=(((res.headers['set-cookie'])[0]).split(';'))[0]
//     console.log(see)
//     console.log((res.headers['set-cookie'])[0])
// })
var ob={
    connect_ip:'60.10.227.41',
    connect_http:'',
    connect_port:'8025',
    connect_type:'kcp'
}
console.log(`${ob.connect_ip_port||ob.connect_http_port}`)
console.log(qs.stringify(ob))
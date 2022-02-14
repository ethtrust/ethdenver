const axios = require('axios');
const cheerio = require('cheerio');
var express = require('express');
var md5 = require('md5');
var poeAPI = express();
var port = 3000;

function merge(str1, str2) {
  var arr1 = str1.split("");
  var arr2 = str2.split("");
  var result = "";
  var index1 = 0;
  var index2 = 0;
  while ((index1 < arr1.length) || (index2 < arr2.length)) {
    if (index1 < arr1.length) {
      result += arr1[index1];
      index1++;
    }
    if (index2 < arr2.length) {
      result += arr2[index2];
      index2++;
    }
  }
  return result;
}

poeAPI.get('/on', function (req, res) {
  res.send('**STUB** - On Success');
  axios.get('http://192.168.0.139/login.cgi')
  .then(response => {
    const loginPage = cheerio.load(response.data);
    var pwSalt = loginPage('#rand').attr('value');
    var pwStr = 'Netgearshot1!';
    var pwHash = md5(merge(pwStr, pwSalt));
    return axios.post('http://192.168.0.139/login.cgi', 'password=' + pwHash)
    .then(response => {
      var sessionCookie = response.headers['set-cookie'][0].split(";")[0];
      console.log('Post Login Cookie: ' + sessionCookie);
      return axios.get('http://192.168.0.139/PoEPortConfig.cgi', {
      headers: {
        Cookie: sessionCookie
      }
    })
    .then((response) => {
      console.log('Get PoE Cookie: ' + sessionCookie);
      var poeStatusPage = cheerio.load(response.data);
      var poePortOneStatus = poeStatusPage('[name=isShowPot1] #hidPortPwr').attr('value');
      var hash = poeStatusPage('#hash').attr('value');
      return (axios.post('http://192.168.0.139/PoEPortConfig.cgi',
      'hash=' + hash
      + '&ACTION=Apply'
      + '&portID=0'
      + '&ADMIN_MODE=1'
      + '&PORT_PRIO=0'
      + '&POW_MOD=3'
      + '&POW_LIMT_TYP=2'
      + '&POW_LIMT=30.0'
      + '&DETEC_TYP=2', {
        headers: {
          Cookie: sessionCookie
        }
      })).then((response) => {
        console.log('Post PoE Cookie: ' + sessionCookie);
        return axios.post('http://192.168.0.139/logout.cgi', {
        headers: {
          Cookie: sessionCookie
        }
      })
    })
  })
})
})
.catch(error => console.log('ERROR (Or Logged Out, that\'s still a WIP)\n'+error));
})

poeAPI.get('/off', function (req, res) {
  res.send('**STUB** - Off Success');
  axios.get('http://192.168.0.139/login.cgi')
  .then(response => {
    const loginPage = cheerio.load(response.data);
    var pwSalt = loginPage('#rand').attr('value');
    var pwStr = 'Netgearshot1!';
    var pwHash = md5(merge(pwStr, pwSalt));
    return axios.post('http://192.168.0.139/login.cgi', 'password=' + pwHash)
    .then(response => {
      var sessionCookie = response.headers['set-cookie'][0].split(";")[0];
      console.log('Post Login Cookie: ' + sessionCookie);
      return axios.get('http://192.168.0.139/PoEPortConfig.cgi', {
      headers: {
        Cookie: sessionCookie
      }
    })
    .then((response) => {
      console.log('Get PoE Cookie: ' + sessionCookie);
      var poeStatusPage = cheerio.load(response.data);
      var poePortOneStatus = poeStatusPage('[name=isShowPot1] #hidPortPwr').attr('value');
      var hash = poeStatusPage('#hash').attr('value');
      return (axios.post('http://192.168.0.139/PoEPortConfig.cgi',
      'hash=' + hash
      + '&ACTION=Apply'
      + '&portID=0'
      + '&ADMIN_MODE=0'
      + '&PORT_PRIO=0'
      + '&POW_MOD=3'
      + '&POW_LIMT_TYP=2'
      + '&POW_LIMT=30.0'
      + '&DETEC_TYP=2', {
        headers: {
          Cookie: sessionCookie
        }
      })).then((response) => {
        console.log('Post PoE Cookie: ' + sessionCookie);
        return axios.post('http://192.168.0.139/logout.cgi', {
        headers: {
          Cookie: sessionCookie
        }
      })
    })
  })
})
})
.catch(error => console.log('ERROR (Or Logged Out, that\'s still a WIP)\n'+error));
})

poeAPI.listen(port, () => {
  console.log(`POE API is Listening on Port ${port}`);
})

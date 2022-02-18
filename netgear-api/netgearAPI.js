require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
var express = require("express");
const cors = require("cors");
var md5 = require("md5");

var poeAPI = express();
poeAPI.use(cors());

var routerHostname = process.env.ROUTER_IP || "172.17.1.6";
var port = process.env.PORT || 3000;
var apiState = {
  pwHash: "",
  sessionCookie: "",
  hash: "",
  poePortOneStatus: null,
};

function merge(str1, str2) {
  var arr1 = str1.split("");
  var arr2 = str2.split("");
  var result = "";
  var index1 = 0;
  var index2 = 0;
  while (index1 < arr1.length || index2 < arr2.length) {
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

function getLogin() {
  return axios.get("http://" + routerHostname + "/login.cgi");
}

function handleGetLogin(getLoginResponse) {
  if (!getLoginResponse.data || getLoginResponse.data.length === 0) {
    Promise.reject(
      new Error("Encountered an Error Retrieving Login Page. Stopping.")
    );
  } else {
    apiState.pwHash = calculatePWHash(getLoginResponse.data);
    return apiState;
  }
}

function postLogin() {
  return axios.post(
    "http://" + routerHostname + "/login.cgi",
    "password=" + apiState.pwHash
  );
}

function handlePostLogin(postLoginResponse) {
  var tempSID = postLoginResponse.headers["set-cookie"][0].split(";")[0];
  if (tempSID.includes("SID=")) {
    apiState.sessionCookie = tempSID;
    return apiState;
  } else {
    Promise.reject(new Error("Could Not Retrieve Session Cookie. Stopping."));
  }
}

function getPoEPortConfig() {
  return axios.get("http://" + routerHostname + "/PoEPortConfig.cgi", {
    headers: {
      Cookie: apiState.sessionCookie,
    },
  });
}

function handleGetPoEPortConfig(getPoEPortConfigResponse) {
  if (checkForRedirect(getPoEPortConfigResponse.data)) {
    // Promise.reject(new Error("Session Invalid - Redirected to Login"));
    console.log("FIX ME");
  } else {
    let portStatusResp = retrievePoEPortState(getPoEPortConfigResponse.data);
    apiState.hash = portStatusResp.hash;
    apiState.poePortOneStatus = portStatusResp.poePortOneStatus;
    return apiState;
  }
}

function postPoEPortConfig(powerMode) {
  return axios.post(
    "http://" + routerHostname + "/PoEPortConfig.cgi",
    "hash=" +
      apiState.hash +
      "&ACTION=Apply" +
      "&portID=0" +
      "&ADMIN_MODE=" +
      powerMode +
      "&PORT_PRIO=0" +
      "&POW_MOD=3" +
      "&POW_LIMT_TYP=2" +
      "&POW_LIMT=30.0" +
      "&DETEC_TYP=2",
    {
      headers: {
        Cookie: apiState.sessionCookie,
      },
    }
  );
}

function handlePostPoEPortConfig(postPoEPortConfigResponse) {
  if (postPoEPortConfigResponse.status != 200) {
    Promise.reject(new Error("Failed to Toggle PoE"));
  } else {
    return apiState;
  }
}

function postLogout() {
  return axios.post("http://" + routerHostname + "/logout.cgi", {
    headers: {
      Cookie: apiState.sessionCookie,
    },
  });
}

function retrievePoEPortState(poeDOM) {
  const cheerioPoEStatus = cheerio.load(poeDOM);
  var poePortOneStatus = cheerioPoEStatus("[name=isShowPot1] #hidPortPwr").attr(
    "value"
  );
  var hash = cheerioPoEStatus("#hash").attr("value");
  return { hash, poePortOneStatus };
}

function checkForRedirect(poeDOM) {
  const cheerioPoEStatus = cheerio.load(poeDOM);
  var titleStr = cheerioPoEStatus("title").text();
  if (titleStr == "Redirect to Login") {
    return true;
  } else {
    return false;
  }
}

// Parse the GET Login Response DOM, extract the hidden salt field,
// combine with the PW string per the JS, and calc the hash.
function calculatePWHash(loginDom) {
  const cheerioLogin = cheerio.load(loginDom);
  var pwSalt = cheerioLogin("#rand").attr("value");
  var pwStr = "Netgearshot1!";
  var pwHash = md5(merge(pwStr, pwSalt));
  return pwHash;
}

poeAPI.get("/on", function (req, res) {
  if (!apiState.sessionCookie || apiState.sessionCookie.length === 0) {
    console.log("No Session Cookie Found");
    getLogin()
      .then((getLoginResponse) => handleGetLogin(getLoginResponse))
      .then(() => postLogin())
      .then((postLoginResponse) => handlePostLogin(postLoginResponse))
      .then(() => getPoEPortConfig())
      .then((getPoEPortConfigResp) =>
        handleGetPoEPortConfig(getPoEPortConfigResp)
      )
      .then(() => postPoEPortConfig(1))
      .then((postPoEPortConfigResp) =>
        handlePostPoEPortConfig(postPoEPortConfigResp)
      )
      // Print State Obj for Debug
      // .then(localState => console.log(localState))
      // Logout is TBD - There's weidness there.
      // .then(postLogout())
      .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        // process.exit(1);
      })
      .then(() => res.json({ success: true, currentPoEState: "1" }));
  } else {
    console.log("Session Cookie Stored");
    getPoEPortConfig()
      .then((getPoEPortConfigResp) =>
        handleGetPoEPortConfig(getPoEPortConfigResp)
      )
      .then(() => postPoEPortConfig(1))
      .then((postPoEPortConfigResp) =>
        handlePostPoEPortConfig(postPoEPortConfigResp)
      )
      // Print State Obj for Debug
      // .then(localState => console.log(localState))
      // Logout is TBD - There's weidness there.
      // .then(postLogout())
      .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        // process.exit(1);
      })
      .then(() => res.json({ success: true, currentPoEState: "1" }));
  }
});

poeAPI.get("/off", function (req, res) {
  if (!apiState.sessionCookie || apiState.sessionCookie.length === 0) {
    console.log("No Session Cookie Found");
    getLogin()
      .then((getLoginResponse) => handleGetLogin(getLoginResponse))
      .then(() => postLogin())
      .then((postLoginResponse) => handlePostLogin(postLoginResponse))
      .then(() => getPoEPortConfig())
      .then((getPoEPortConfigResp) =>
        handleGetPoEPortConfig(getPoEPortConfigResp)
      )
      .then(() => postPoEPortConfig(0))
      .then((postPoEPortConfigResp) =>
        handlePostPoEPortConfig(postPoEPortConfigResp)
      )
      // Print State Obj for Debug
      // .then(localState => console.log(localState))
      // Logout is TBD - There's weidness there.
      // .then(postLogout())
      .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        process.exit(1);
      })
      .then(() => res.json({ success: true, currentPoEState: "0" }));
  } else {
    console.log("Session Cookie Stored");
    getPoEPortConfig()
      .then((getPoEPortConfigResp) =>
        handleGetPoEPortConfig(getPoEPortConfigResp)
      )
      .then(() => postPoEPortConfig(0))
      .then((postPoEPortConfigResp) =>
        handlePostPoEPortConfig(postPoEPortConfigResp)
      )
      // Print State Obj for Debug
      // .then(localState => console.log(localState))
      // Logout is TBD - There's weidness there.
      // .then(postLogout())
      .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        process.exit(1);
      })
      .then(() => res.json({ success: true, currentPoEState: "0" }));
  }
});

poeAPI.get("/status", function (req, res) {
  if (!apiState.sessionCookie || apiState.sessionCookie.length === 0) {
    console.log("No Session Cookie Found");
    getLogin()
      .then((getLoginResponse) => handleGetLogin(getLoginResponse))
      .then(() => postLogin())
      .then((postLoginResponse) => handlePostLogin(postLoginResponse))
      .then(() => getPoEPortConfig())
      .then((getPoEPortConfigResp) =>
        handleGetPoEPortConfig(getPoEPortConfigResp)
      )
      // Print State Obj for Debug
      // .then(localState => console.log(localState))
      // Logout is TBD - There's weidness there.
      // .then(postLogout())
      .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        process.exit(1);
      })
      .then(() => res.json({ currentPoEState: apiState.poePortOneStatus }));
  } else {
    console.log("Session Cookie Stored");
    getPoEPortConfig()
      .then((getPoEPortConfigResp) =>
        handleGetPoEPortConfig(getPoEPortConfigResp)
      )
      // Print State Obj for Debug
      // .then(localState => console.log(localState))
      // Logout is TBD - There's weidness there.
      // .then(postLogout())
      .catch((error) => {
        res.sendStatus(500);
        console.log(error);
        process.exit(1);
      })
      .then(() => res.json({ currentPoEState: apiState.poePortOneStatus }));
  }
});

poeAPI.listen(port, () => {
  console.log(`POE API is Listening on Port ${port}`);
});

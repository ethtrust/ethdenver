import axios from "axios";
import cheerio from "cheerio";
import { calculatePWHash } from ".";

const routerHostname = process.env.ROUTER_IP || "192.168.0.222";

export interface APIState {
  pwHash: string;
  sessionCookie: string;
  hash: string;
  poePortOneStatus: any | null;
}

class StatefulRouter {
  public apiState: APIState;

  constructor() {
    this.apiState = {
      pwHash: "",
      sessionCookie: "",
      hash: "",
      poePortOneStatus: null,
    };
  }

  getRouter() {
    return axios.get("http://" + routerHostname + "/login.cgi");
  }

  getLogin() {
    return axios.get("http://" + routerHostname + "/login.cgi");
  }

  handleGetLogin(getLoginResponse) {
    if (!getLoginResponse.data || getLoginResponse.data.length === 0) {
      return Promise.reject(
        new Error("Encountered an Error Retrieving Login Page. Stopping.")
      );
    } else {
      this.apiState.pwHash = calculatePWHash(getLoginResponse.data);
      return this.apiState;
    }
  }

  postLogin(newApiState) {
    return axios.post(
      "http://" + routerHostname + "/login.cgi",
      "password=" + newApiState.pwHash
    );
  }

  handlePostLogin(postLoginResponse, apiState) {
    const tempSID = postLoginResponse.headers["set-cookie"][0].split(";")[0];
    if (tempSID.includes("SID=")) {
      this.apiState.sessionCookie = tempSID;
      return this.apiState;
    } else {
      return Promise.reject(
        new Error("Could Not Retrieve Session Cookie. Stopping.")
      );
    }
  }

  getPoEPortConfig(apiState) {
    return axios.get("http://" + routerHostname + "/PoEPortConfig.cgi", {
      headers: {
        Cookie: apiState.sessionCookie,
      },
    });
  }

  handleGetPoEPortConfig(getPoEPortConfigResponse) {
    if (checkForRedirect(getPoEPortConfigResponse.data)) {
      // Promise.reject(new Error("Session Invalid - Redirected to Login"));
      console.log("FIX ME");
    } else {
      let portStatusResp = retrievePoEPortState(getPoEPortConfigResponse.data);
      this.apiState.hash = portStatusResp.hash;
      this.apiState.poePortOneStatus = portStatusResp.poePortOneStatus;
      return this.apiState;
    }
  }

  postPoEPortConfig(powerMode) {
    return axios.post(
      "http://" + routerHostname + "/PoEPortConfig.cgi",
      "hash=" +
        this.apiState.hash +
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
          Cookie: this.apiState.sessionCookie,
        },
      }
    );
  }

  handlePostPoEPortConfig(postPoEPortConfigResponse) {
    if (postPoEPortConfigResponse.status != 200) {
      Promise.reject(new Error("Failed to Toggle PoE"));
    } else {
      return this.apiState;
    }
  }

  postLogout() {
    return axios.post("http://" + routerHostname + "/logout.cgi", {
      headers: {
        Cookie: this.apiState.sessionCookie,
      },
    });
  }

  retrievePoEPortState(poeDOM) {
    const cheerioPoEStatus = cheerio.load(poeDOM);
    const poePortOneStatus = cheerioPoEStatus(
      "[name=isShowPot1] #hidPortPwr"
    ).attr("value");
    const hash = cheerioPoEStatus("#hash").attr("value");
    return { hash, poePortOneStatus };
  }

  checkForRedirect(poeDOM) {
    const cheerioPoEStatus = cheerio.load(poeDOM);
    var titleStr = cheerioPoEStatus("title").text();
    if (titleStr == "Redirect to Login") {
      return true;
    } else {
      return false;
    }
  }
}

export function createStatefulRouter() {
  return new StatefulRouter();
}

export const router = createStatefulRouter(); // TODO: Can we do this differently?

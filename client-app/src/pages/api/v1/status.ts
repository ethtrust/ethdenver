import { createStatefulRouter } from "../../../utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlePOEStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const router = createStatefulRouter();
  const sessionCookie = req.cookies["session-cookie"];
  console.log("ROUTER", router);
  let poeStatus = {};
  try {
    if (!sessionCookie || sessionCookie.length === 0) {
      console.log("No Session Cookie Found");
      const getLoginResponse = await router.getLogin();
      await router.handleGetLogin(getLoginResponse);

      const postLoginResponse = await router.postLogin();
      const newState = await router.handlePostLogin(postLoginResponse);
      res.cookie("session-cookie", newState.sessionCookie);

      const getPoEPortConfigResp = await router.getPoEPortConfig();
      poeStatus = await handleGetPoEPortConfig(getPoEPortConfigResp);
    } else {
      console.log("Session Cookie Stored");
      const getPoEPortConfigResp = await router.getPoEPortConfig();
      poeStatus = await router.handleGetPoEPortConfig(getPoEPortConfigResp);
    }
    console.log("poeStatus", poeStatus);

    return res
      .status(200)
      .json({ currentPoEState: router.apiState.poePortOneStatus });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
    // process.exit(1);
  }
}

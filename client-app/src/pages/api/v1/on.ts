import { createStatefulRouter } from "../../../utils";
export default async function checkIsOn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const router = createStatefulRouter();
  const sessionCookie = req.cookies["session-cookie"];
  try {
    if (!sessionCookie || sessionCookie.length === 0) {
      const getLoginResponse = await router.getLogin();
      const handledResponse = await router.handleGetLogin(getLoginResponse);
      const postLoginResponse = await router.postLogin();
      const handledLoginResponse = await router.handlePostLogin(
        postLoginResponse
      );
      res.cookie("session-cookie", handledLoginResponse.apiState.sessionCookie);
      const getPoEPortConfigResp = await router.getPoEPortConfig();
      await router.handleGetPoEPortConfig(getPoEPortConfigResp);

      const postPoEPortConfigResp = await router.postPoEPortConfig(1);
      await router.handlePostPoEPortConfig(postPoEPortConfigResp);
    } else {
      console.log("Session Cookie Stored");
      const getPoEPortConfigResp = await router.getPoEPortConfig();
      await router.handleGetPoEPortConfig(getPoEPortConfigResp);
      const postPoEPortConfigResp = await router.postPoEPortConfig(1);
      await router.handlePostPoEPortConfig(postPoEPortConfigResp);
    }
    return res.status(200).json({ success: true, currentPoEState: "1" });
  } catch (err) {
    console.log(error);
    res.sendStatus(500);
  }
}

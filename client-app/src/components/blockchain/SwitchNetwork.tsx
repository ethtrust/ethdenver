import React, { useMemo, useCallback } from "react";
import { Config } from "../../types";
import { switchNetwork as rpcSwitchNetwork } from "../../utils/rpc";

export default function SwitchNetworkContent({
  provider,
  config,
  nextStep,
}: {
  provider: ethers.providers.ExternalProvider | undefined;
  config: Config;
  nextStep: Function;
}) {
  const title = useMemo(() => "Switch Network", []);
  const description = useMemo(
    () => <div>Ready to switch to {config.targetNetwork.name}</div>,
    [config]
  );

  const onClick = useCallback(async () => {
    if (!provider) {
      console.log("Please connect wallet first");
      return;
    }
    const success = await rpcSwitchNetwork(provider, config);
    if (success) nextStep();
  }, [provider, config]);
  const networkDetail = (
    <div className={classes.center}>
      <div className={classes.child}>
        {config.targetNetwork.img && (
          <img className={classes.img} src={config.targetNetwork.img} />
        )}
      </div>
      <div className={classes.child}>
        Provider: {config.targetNetwork.rpcUrls[0]}
      </div>
      <div className={classes.child}>
        ChainId: {config.targetNetwork.chainId}
      </div>
      <Button onClick={onClick} variant="contained" color="primary">
        Switch
      </Button>
    </div>
  );

  return networkDetail;
}

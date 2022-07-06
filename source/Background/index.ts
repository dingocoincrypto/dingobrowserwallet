import browser from "webextension-polyfill";

const promptUser = (api: string, args: any) => {
  const url =
    api +
    ".html" +
    (Object.keys(args).length === 0
      ? ""
      : "?" + new URLSearchParams(args).toString());

  return new Promise((resolve) => {
    const bc_bg_popup = new BroadcastChannel("dingo_bg_popup_" + args.id);
    bc_bg_popup.addEventListener("message", (msg: any) => {
      bc_bg_popup.close();
      resolve(msg.data);
    });

    browser.windows.create({
      url: browser.runtime.getURL(url),
      type: "popup",
      height: 620,
      width: 580,
    });
  });
};

browser.runtime.onMessage.addListener((msg: any, _sender: any) => {
  const { request, origin } = msg;
  if (request.action === "getActiveAccountAddress") {
    return new Promise((resolve) => {
      browser.storage.sync.get("activeAccount").then((active: any) => {
        if ("activeAccount" in active) {
          resolve({ result: active.activeAccount.address });
        } else {
          resolve({ error: "No account selected" });
        }
      });
    });
  } else if (request.action === "requestSign") {
    return promptUser("signData", {
      id: request.id, // Used to create unique broadcast channel.
      origin: origin,
      data: request.data.content,
    });
  } else if (request.action === "requestSignTransaction") {
    const { vins, vouts } = request.data;
    let flattenedVins = "";
    for (const vin of vins) {
      if (flattenedVins !== "") {
        flattenedVins += ",";
      }
      flattenedVins += vin.txid;
      flattenedVins += ",";
      flattenedVins += vin.vout;
    }
    let flattenedVouts = "";
    for (const k of Object.keys(vouts)) {
      if (flattenedVouts !== "") {
        flattenedVouts += ",";
      }
      flattenedVouts += k;
      flattenedVouts += ",";
      flattenedVouts += vouts[k];
    }
    return promptUser("signTransaction", {
      id: request.id, // Used to create unique broadcast channel.
      origin: origin,
      vins: flattenedVins,
      vouts: flattenedVouts,
    });
  } else {
    return Promise.resolve({ error: "Unknown request" });
  }
});

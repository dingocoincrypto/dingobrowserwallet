// Load API.
(() => {
  console.log("Injecting dingoApi.");

  window.addEventListener(
    "message",
    function (event) {
      if (event.source !== window) {
        return;
      }
      if (event.data.type && event.data.type === "DingoApi") {
        const request = event.data;
        const origin = event.origin;

        browser.runtime
          .sendMessage(browser.runtime.id, {
            request: event.data,
            origin: event.origin
          })
          .then((response) => {
            window.postMessage(
              {
                type: "DingoApiResponse",
                id: request.id,
                response: response,
              },
              event.origin
            );
          });
      }
    },
    false
  );

  const s = document.createElement("script");
  s.type = "text/javascript";
  s.src = browser.runtime.getURL("assets/js/dingoApi.js");
  (document.head || document.documentElement).appendChild(s);

  console.log("Injected dingoApi.");
})();

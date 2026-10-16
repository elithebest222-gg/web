(() => {
  if (localStorage.getItem("adsEnabled") === "false") return;
  if (document.body?.classList.contains("proxy-browser-page")) return;
  if (document.querySelector("script[data-truffled-ad]")) return;
  if (/\/(iframe|unityframe)\.html$|^\/[iu]$/.test(location.pathname)) return;
  if (document.querySelector(".iframe-container, #gameframe")) return;
  const script = document.createElement("script");
  script.src =
    "https://pl27846331.effectivecpmnetwork.com/3f/32/36/3f3236be1ec5673d9ed3582262c4dab9.js";
  script.async = true;
  script.dataset.truffledAd = "";
  (document.body || document.head).appendChild(script);
  const script2 = document.createElement("script");
  script2.src = "https://bauval.org/14/1eca0b39c37917b7f099788bd311eae3";
  script2.setAttribute("data-cfasync", "false");
  script2.dataset.truffledAd = "";
  (document.body || document.head).appendChild(script2);
})();

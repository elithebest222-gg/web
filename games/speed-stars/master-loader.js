"use strict";

// 1. Establish the root asset path directory
var scripts = document.getElementsByTagName("script"),
    scriptUrl = scripts[scripts.length - 1].src,
    root = scriptUrl.split("master-loader.js")[0],
    loaders = {
        unity: "unity.js",
        "unity-beta": "./unity-beta.js",
        "unity-2020": "./unity-2020.js"
    };

// 2. Handle fallback parameters if local debugging flags are present
if (0 <= window.location.href.indexOf("pokiForceLocalLoader")) {
    loaders.unity = "/unity.js";
    loaders["unity-beta"] = "/unity-beta/dist/unity-beta.js";
    loaders["unity-2020"] = "/unity-2020/dist/unity-2020.js";
    root = "/loaders";
}

// 3. Safe Mock Config Injection: Prevents the "window.config not found" crash
if (!window.config) {
    window.config = {
        loader: "unity-2020",
        unityVersion: "2020.3.0",
        unityWebglLoaderUrl: "./b0e5ec181474d494c6ff3c9ad9c3b1bd.js"
    };
}

// 4. Resolve the targeted loader package script
var loader = loaders[window.config.loader];
if (!loader) {
    loader = "./unity-2020.js"; // Safe fallback to your structural unity-2020.js file
}

// 5. Establish WebGL Loader references if missing from context hooks
if (!window.config.unityWebglLoaderUrl) {
    var versionSplit = window.config.unityVersion ? window.config.unityVersion.split(".") : [],
        year = versionSplit[0],
        minor = versionSplit[1];
    
    switch (year) {
        case "2019":
            window.config.unityWebglLoaderUrl = 1 === minor ? "./UnityLoader.2019.1.js" : "./UnityLoader.2019.2.js";
            break;
        default:
            window.config.unityWebglLoaderUrl = "./UnityLoader.js";
    }
}

// 6. Creating a safe, localized Mock Object for Poki SDK APIs inside the runtime environment
window.PokiSDK = {
    init: function() { return Promise.resolve(true); },
    gameLoadingStart: function() {},
    gameLoadingProgress: function(progress) {},
    gameLoadingFinished: function() {},
    gameplayStart: function() {},
    gameplayStop: function() {},
    commercialBreak: function() { return Promise.resolve(true); },
    rewardedBreak: function() { return Promise.resolve(true); }
};

/* 
   BYPASSED COMPILATION LOCK:
   We no longer attach or wait for the tracking library 'poki-sdk.js' to fire an remote payload.
   Instead, we immediately spawn and append the targeted engine asset directly into the document frame.
*/
var gameLauncherScript = document.createElement("script");
gameLauncherScript.src = root + loader;
document.body.appendChild(gameLauncherScript);

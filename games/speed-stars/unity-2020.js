/* 
   BYPASSED WEBGL LAUNCHER: unity-2020.js
   Completely removes Poki's internal module dependency checks and boots the Unity WebAssembly canvas directly.
*/
"use strict";

(function() {
    // 1. Intercept and isolate any delayed Poki SDK runtime loops
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

    // 2. Fetch the target configuration maps setup by index.html
    var c = window.config;
    if (!c || !c.metadata) {
        console.error("[Engine Error] Configuration missing or misaligned.");
        return;
    }
    
    var s = c.metadata;
    var buildPath = c.unityWebglBuildUrl || "./";

    // 3. Assemble clear relative file bindings matching your assets
    var loaderUrl = buildPath + s.loader_filename;
    var dataUrl = buildPath + s.data_filename;
    var frameworkUrl = buildPath + s.framework_filename;
    var codeUrl = buildPath + s.code_filename;

    // 4. Inject the core framework compilation loader script into the frame hierarchy
    var launcherScript = document.createElement("script");
    launcherScript.src = loaderUrl;
    
    launcherScript.onload = function() {
        // Ensure a valid container exists for the engine graphics layout target canvas
        var targetCanvas = document.getElementById("game") || document.getElementById("unity-canvas") || document.querySelector("canvas");
        if (!targetCanvas) {
            targetCanvas = document.createElement("canvas");
            targetCanvas.id = "game";
            document.body.appendChild(targetCanvas);
        }

        console.log("[Engine Sync] Handing parameters over to WebAssembly compilation module...");

        // 5. Initialize the raw compiled Unity engine instance
        if (typeof createUnityInstance === "function") {
            createUnityInstance(targetCanvas, {
                dataUrl: dataUrl,
                frameworkUrl: frameworkUrl,
                codeUrl: codeUrl,
                companyName: s.company_name || "Unity",
                productName: s.product_name || "WebGL Player",
                productVersion: s.product_version || "1.0",
            }, function(progress) {
                // Supplying progress increments to clear any decorative visual spinner arrays
                var fillTracker = document.getElementById("progress-fill");
                var amountTracker = document.getElementById("progress-amount");
                if (fillTracker) fillTracker.style.width = (progress * 100) + "%";
                if (amountTracker) amountTracker.innerText = Math.round(progress * 100) + "%";
            }).then(function(unityInstance) {
                window.unityInstance = unityInstance;
                console.log("[Engine Sync] WebAssembly binaries compiled successfully! Game running.");
                
                // Hide or remove the decorative background loading wrappers if present
                var visualLoader = document.getElementById("loader");
                if (visualLoader) visualLoader.style.display = "none";
            }).catch(function(err) {
                console.error("Unity Compilation Error: ", err);
            });
        } else {
            console.error("[Engine Error] createUnityInstance function was not exposed by the engine layer.");
        }
    };

    document.body.appendChild(launcherScript);
})();

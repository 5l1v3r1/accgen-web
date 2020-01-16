var cached_settings = null;

function initSettings() {
    if (!cached_settings) {
        var storage = localStorage.getItem("settings");
        if (storage) {
            try {
                cached_settings = JSON.parse(storage);
                if (!cached_settings)
                    cached_settings = {};
            } catch (error) {
                cached_settings = {};
            }
        }
        else
            // If settings dont exist or cached_settings is invalid, use empty cached_settings object
            cached_settings = {};
    }
}

exports.get = function (setting) {
    // Init in case cached_settings isn't valid currently
    initSettings();
    // No need to parse settings again, all settings values are already known. Get from cache.
    return cached_settings[setting];
}

exports.set = function (setting, value) {
    // Init in case cached_settings isn't valid currently
    initSettings();
    // Set value
    cached_settings[setting] = value;
    // Also save instantly
    localStorage.setItem("settings", JSON.stringify(cached_settings));
}

function baseSettings() {
    exports.set("version", 4);
    exports.set("custom_domain", localStorage.getItem("settings_custom_domain"));
    exports.set("captcha_key", localStorage.getItem("settings_twocap"));
    exports.set("captcha_host", "https://2captcha.com");
    exports.set("captcha_key_type", "2captcha");
    exports.set("acc_apps_setting", "329385");
    exports.set("acc_steam_guard", true);
    console.log("Base settings configured!");
}

// Convert from legacy settings system to modern settings system
exports.convert = function () {
    // Init in case cached_settings isn't valid currently
    initSettings();
    // Check if we already converted our config
    if (!exports.get("version"))
        baseSettings();
    else {
        if (exports.get("version") == 1) {
            exports.set("version", 2);
            exports.set("acc_apps_setting", "329385");
            exports.set("acc_steam_guard", true);
            console.log("Migrated from version 1 to version 2!");
        }
        // localStorage.setItem("settings", JSON.stringify({version: 2, acc_apps_setting: 32985}))
        if (exports.get("version") == 2) {
            exports.set("version", 3);
            var subid = exports.get("acc_apps_setting");
            if (subid == "32985" || subid == "303386")
                exports.set("acc_apps_setting", "329385");
            console.log("Migrated from version 2 to version 3!");
        }
        if (exports.get("version") == 3) {
            exports.set("version", 4);
            exports.set("captcha_host", "https://2captcha.com");
            console.log("Migrated from version 3 to version 4!");
        }
    }
}
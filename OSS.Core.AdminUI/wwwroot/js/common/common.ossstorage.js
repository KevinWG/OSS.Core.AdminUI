var OssStorage = {
    setLocal: function(key, value) {
        this._set(key, value, "local");
    },
    getLocal: function(key) {
        return this._get(key, "local");
    },
    delLocal: function(key) {
        return this._del(key, "local");
    },

    _get: function(key, stoType) {
        if (!this._checkSupport())
            return null;
        var value = stoType === "local" ? window.localStorage.getItem(key) : window.sessionStorage.getItem(key);
        return value && JSON.parse(value);
    },
    _set: function(key, value, stoType) {
        if (!this._checkSupport())
            return false;
        var data = value && JSON.stringify(value);
        if (stoType === "local") {
            window.localStorage.setItem(key, data);
        } else {
            window.sessionStorage.setItem(key, data);
        }
        return true;
    },
    _del: function(key, stoType) {
        if (!this._checkSupport())
            return false;
        if (stoType === "local") {
            window.localStorage.removeItem(key);
        } else {
            window.sessionStorage.removeItem(key);
        }
        return true;
    },
    _checkSupport: function() {
        if (window.localStorage && window.sessionStorage) {
            return true;
        }
        return false;
    }
};
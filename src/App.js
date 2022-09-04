import moment from "jalali-moment";
import {default as lodash} from "lodash";

const uniqueTimeouts = {};
const uniqueIntervals = {};

class App {
    static LOG = {
        RENDER: 'Component rendering',
        PRINT: 'Printing on paper',
        SHOULD_COMPONENT_UPDATE: 'Component updating',
        COMPONENT_DID_UPDATE: 'Component updated',
        COMPONENT_DID_MOUNT: 'Component mounted',
        COMPONENT_WILL_UNMOUNT: 'Component will unmounted',
        FETCH: 'Fetching data from server'
    };
    static session = {
        set: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        get: (key, value) => JSON.parse(sessionStorage.getItem(key) || "null") || value,
        remove: (key) => sessionStorage.removeItem(key)
    };
    static storage = {
        set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        get: (key, value) => JSON.parse(localStorage.getItem(key) || "null") || value,
        remove: (key) => localStorage.removeItem(key)
    };

    static clearInterval(interval) {
        try {
            clearInterval(interval);
            return true;
        } catch (e) {
            return false;
        }
    }

    static clearTimeout(timeout) {
        try {
            clearTimeout(timeout);
            return true;
        } catch (e) {
            return false;
        }
    }

    static ellipse(content = '', count, suffix = '...', word = true) {
        let w = content.split(' ');
        count = count || (word ? w.length : content.length);
        return word ?
            w.slice(0, count).join(' ') + (count < w.length ? suffix : '') :
            content.slice(0, this[count] === ' ' ? count + 1 : count) + (count < content.length ? suffix : '');
    }

    static firstItem(array) {
        return array[0];
    }

    static formatMoney(number, separator = ',', decimalCount = 0,) {
        let int = [];
        number = parseFloat(number).toFixed(decimalCount);
        number = number.split('.');
        const m = number[0].length % 3;
        if ([1, 2].includes(m))
            int.push(number[0].slice(0, m));
        if (number[0].length > 2)
            int.push(...number[0].substr(m, number[0].length).match(/.{1,3}/g));

        return int.join(separator) + (number[1] ? '.' + number[1] : '');
    }

    static imageContrast(imageSrc, callback) {
        var img = document.createElement("img");
        img.src = imageSrc;
        img.style.display = "none";
        document.body.appendChild(img);

        var colorSum = 0;

        img.onload = function () {
            // create canvas
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;
            var r, g, b, avg;

            for (var x = 0, len = data.length; x < len; x += 4) {
                r = data[x];
                g = data[x + 1];
                b = data[x + 2];

                avg = Math.floor((r + g + b) / 3);
                colorSum += avg;
            }

            var brightness = Math.floor(colorSum / (this.width * this.height));
            callback(brightness);
        };
    }

    static isEmail(string) {
        return new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{1,3})$/g).test(string);
    }

    static isMobile(string) {
        return new RegExp(/^09\d{9}$/g).test(string);
        // return new RegExp(/^(\+98|0)?9\d{9}$/g).test(string);
    }

    static isNationalCode(string) {
        if (['0000000000', '1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'].includes(string))
            return false;

        string = string?.toString() || '';
        let L = string.length;
        if (L < 8 || L > 10 || parseInt(string, 10) === 0)
            return false;
        string = ('0000' + string).substr(L + 4 - 10);
        if (parseInt(string.substr(3, 6), 10) === 0)
            return false;
        let c = parseInt(string.substr(9, 1), 10);
        let s = 0;
        for (let i = 0; i < 9; i++)
            s += parseInt(string.substr(i, 1), 10) * (10 - i);
        s = s % 11;
        return (s < 2 && c === s) || (s >= 2 && c === (11 - s));
    }

    static isTell(string) {
        return new RegExp(/^0\d{10}$/g).test(string);
        // return new RegExp(/^(\+98|0)?\d{10}$/g).test(string);
    }

    static lastItem(array) {
        return array[array.length - 1];
    }

    static log(local, text, ...data) {
        // if (!window.ENV.DEBUG_MOOD)
        // return;

        if (typeof local !== "string")
            local = local.constructor.name;

        let gap;
        if (typeof local === "object") {
            console.log(`%c${local} >`, 'color:#ff7580;', text);
            if (data)
                gap = ' '.repeat(local.length + 1);
        } else {
            console.log(`%c${local} >`, 'color:#ff7580;', text);
            if (data)
                gap = ' '.repeat(local.length + 1);
        }
        if (data)
            for (let item of data)
                console.log(`%c${gap}Data >`, 'color:#ffbd31;', item);
    }

    static password(password = null, strongerThan = null) {
        if (Var.isVoid(password))
            return {value: 0, message: 'empty'};

        let regex = [];
        regex.push("[$@$!%*#?&]"); // Special Character
        regex.push("[A-Z]"); // Uppercase Alphabet's
        regex.push("[a-z]"); // Lowercase Alphabet's
        regex.push("[0-9]"); // Numbers
        regex.push(".{8}"); // More Than 8 Char

        let res = {value: 0, message: null};

        // Check the conditions
        for (let i = 0; i < regex.length; i++)
            if (new RegExp(regex[i]).test(password))
                res.value++;

        switch (res.value) {
            case 1:
                res.message = 'Very Weak';
                break;
            case 2:
                res.message = 'Weak';
                break;
            case 3:
                res.message = 'Medium';
                break;
            case 4:
                res.message = 'Strong';
                break;
            case 5:
                res.message = 'Very Strong';
                break;
            default :
                res.message = 'Error';
                break;
        }

        if (Var.isNotNull(strongerThan))
            return res.value >= strongerThan;
        return res;
    }

    static rand(from = 0, to = 100) {
        return Math.floor(Math.random() * (++to - from)) + from;
    }

    static setUniqueInterval(callback, millisecond) {
        this.clearInterval(uniqueIntervals[callback]);
        uniqueIntervals[callback] = setInterval(callback, millisecond);
    }

    static setUniqueTimeout(callback, millisecond) {
        this.clearTimeout(uniqueTimeouts[callback]);
        uniqueTimeouts[callback] = setTimeout(callback, millisecond);
    }

    static smartSearch(search, content) {
        try {
            const statement = search.split(' ') // generates words
                .map(word => "(?=.*" + word + ")") // convert words to regexp
                .join('');
            const regExp = new RegExp(statement, "gi");
            return regExp.test(content);
        } catch (e) {
            return false;
        }
    }

    static stringToHtmlDom(string) {
        return new DOMParser().parseFromString(string, "text/html");
    }

    static stringToXML(string) {
        if (window.DOMParser) {
            const parser = new DOMParser();
            return parser.parseFromString(string, "text/xml");
        } //else // Internet Explorer
        // {
        //     const xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        //     xmlDoc.async = false;
        //     xmlDoc.loadXML(string);
        //     return xmlDoc;
        // }
    }

    static toEnglishNumber(string = '') {
        return this.translate(string, {
            '۰': 0,
            '۱': 1,
            '۲': 2,
            '۳': 3,
            '۴': 4,
            '۵': 5,
            '۶': 6,
            '۷': 7,
            '۸': 8,
            '۹': 9
        }, false);
    }

    static toPersianNumber(string = '') {
        return this.translate(string, {
            0: '۰',
            1: '۱',
            2: '۲',
            3: '۳',
            4: '۴',
            5: '۵',
            6: '۶',
            7: '۷',
            8: '۸',
            9: '۹'
        }, false);
    }

    static translate(string, dictionary, addColon = true) {
        for (let key in dictionary)
            string = string.replace(new RegExp(`${addColon ? ':' : ''}${key}`, 'g'), dictionary[key]);
        return string;
    }
}

class Service {
    static ACCELEROMETER = 'accelerometer';
    static AMBIENT_LIGHT_SENSOR = 'ambient-light-sensor';
    static BACKGROUND_SYNC = 'background-sync';
    static BATTERY = 'battery';
    static CAMERA = 'camera';
    static GEOLOCATION = 'geolocation';
    static GYROSCOPE = 'gyroscope';
    static MAGNETOMETER = 'magnetometer';
    static MICROPHONE = 'microphone';
    static MIDI = 'midi';
    static NETWORK = 'onLine';
    static NOTIFICATIONS = 'notifications';
    static ORIENTATION = 'orientation';
    static PUSH = 'push';
    static VIBRATION = 'vibrate';

    static async battery() {
        if (Service.isAvailable(Service.BATTERY)) {
            if ('getBattery' in navigator)
                return navigator.getBattery();
            else
                return Promise.resolve(navigator.battery);
        } else
            return 'Service unavailable';
    }

    static async camera(params = {}) {
        // params={
        //     width:1920,
        //     height:1080,
        //     videoDevice:'asdsadmksalndjasdjlasjhljadjdl'
        // };
        if (Service.isAvailable(Service.CAMERA)) {
            if ('mediaDevices' in navigator) {
                const video = {};
                video.facingMode = ['user', 'environment'];
                if (params.width) video.width = {ideal: params.width};
                if (params.height) video.height = {ideal: params.height};
                if (params.videoDevice) video.deviceId = params.videoDevice;
                return navigator.mediaDevices.getUserMedia({
                    video: JSON.stringify(video) !== '{}' ? video : true
                    , audio: true
                });
            }

            const legacyApi = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            if (legacyApi)
                return new Promise(function (resolve, reject) {
                    legacyApi.bind(navigator)({video: true, audio: true}, resolve, reject);
                });
        } else
            return 'Service unavailable';
    }

    static async checkPermission(permissionName, listenner) {
        return new Promise((resolve, reject) => {
            try {
                navigator.permissions.query(Object.assign({name: permissionName}, (permissionName === 'push' && {userVisibleOnly: true}) || (permissionName === 'midi' && {sysex: true}) || undefined))
                    .then(permission => {
                        resolve(permission.state);
                        if (listenner)
                            permission.addEventListener('onchange', listenner);
                    });
            } catch (e) {
                resolve('unsupported');
            }
        });
    }

    static clipboard() {
        //todo
    }

    static geoLocation(listener) {
        if (Service.isAvailable(Service.GEOLOCATION))
            if (listener)
                return listener && navigator.geolocation.watchPosition(listener);
            else
                return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(location => {
                        resolve(location);
                    });
                });
        else
            return 'Service unavailable';
    }

    static isAvailable(service) {
        switch (service) {
            case Service.GEOLOCATION:
                return Service.GEOLOCATION in navigator;
            case Service.BATTERY:
                return 'getBattery' in navigator ||
                    ('battery' in navigator && 'Promise' in window);
            case Service.ORIENTATION:
                return 'DeviceOrientationEvent' in window;
            case Service.CAMERA:
            case Service.MICROPHONE:
                return ('mediaDevices' in navigator && 'Promise' in window) ||
                    'getUserMedia' in navigator ||
                    'webkitGetUserMedia' in navigator ||
                    'mozGetUserMedia' in navigator ||
                    'msGetUserMedia' in navigator;
            default:
                return service in navigator;
        }
    }

    static async mediaDevices() {
        if ('mediaDevices' in navigator)
            return navigator.mediaDevices.enumerateDevices();
        else
            return [];
    }

    static async microphone(params = {}) {
        if (Service.isAvailable(Service.MICROPHONE)) {
            if ('mediaDevices' in navigator) {
                return navigator.mediaDevices.getUserMedia({
                    audio: true
                });
            }

            const legacyApi = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            if (legacyApi)
                return new Promise(function (resolve, reject) {
                    legacyApi.bind(navigator)({audio: true}, resolve, reject);
                });
        } else
            return 'Service unavailable';
    }

    static network(onlineCallback, offlineCallback) {
        if (Service.isAvailable(Service.NETWORK)) {
            onlineCallback && window.addEventListener('online', onlineCallback);
            offlineCallback && window.addEventListener('offline', offlineCallback);
            return navigator.onLine;
        } else
            return 'Service unavailable';
    }

    static orientation(callback) {
        if (Service.isAvailable(Service.ORIENTATION)) {
            window.addEventListener('deviceorientation', callback, false);
            return true;
        } else
            return false;
    }

    static sessionStorageSynchronize(config = {}) {
        if (typeof config === typeof {})
            config = {
                // both will sync deleted parameters too
                // but went will sunc updated and added parameters
                syncDirection: 'both',// both or went
                syncFrequency: 100, // number or false = 0
                ...config
            };

        const sendSession = _ => {
            // saving sessionStorage inside localStorage in order to cross tab access
            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));

            // the other tabs should now have it, so we're done width it
            localStorage.removeItem('sessionStorage');
        };

        const receiveSession = data => {
            // another tab sent data <- get it
            data = JSON.parse(data);

            // clear sessionStorage at first
            if (config.syncDirection === 'both')
                sessionStorage.clear();

            for (const key in data)
                if (data.hasOwnProperty(key))
                    sessionStorage.setItem(key, data[key]);
        };

        // Ask other tabs for session storage (this is ONLY to trigger event)
        const requestSession = _ => {
            localStorage.setItem('requestSessionStorage', 'granted');
            localStorage.removeItem('requestSessionStorage');
        };

        //starts session update
        const update = sendSession;

        // routing events result
        const router = event => {
            !event && (event = window.event);

            if (!event.newValue) return;          // do nothing if no value to work with

            if (event.key === 'requestSessionStorage')
                sendSession();
            else if (event.key === 'sessionStorage')
                receiveSession(event.newValue);
        };

        if (config === 'update')
            update();
        else {
            // listen for changes to localStorage
            if (window.addEventListener) {
                window.addEventListener("storage", router, false);
                window.addEventListener('focus', requestSession, false);
            } else {
                window.attachEvent("onstorage", router);
                window.attachEvent('onfocus', requestSession);
            }

            requestSession();

            config.syncFrequency &&
            App.setUniqueInterval(update, config.syncFrequency);
        }
    }

    static vibrate(pattern = 200) {
        if (Service.isAvailable(Service.VIBRATION)) {
            navigator.vibrate(pattern);
            return true;
        } else
            return 'Service unavailable';
    }

    static wakeLock() {
        //todo
    }
}

class Url {
    static bind(url, parameters = {}) {
        const u = Url.unbind(url);
        const props = [];
        parameters = {...u.props, ...parameters};
        for (let key in parameters)
            props.push(`${key}=${Array.isArray(parameters[key]) ? parameters[key].join(',') : parameters[key]}`);
        return `${u.origin}${u.pathname}?${props.join('&')}`;
    }

    static extention(url) {
        const regex = new RegExp(/.(svg|jpeg|jpg)$/, 'g');
        try {
            return regex.exec(url)[1];
        } catch (e) {
            return null;
        }
    }

    static parse(url, parameters) {
        for (let key in parameters)
            url = url.replace(new RegExp(`:${key}`, 'g'), parameters[key]);
        return url;
    }

    static unbind(url) {
        const u = new URL(url);
        const search = u.search ? u.search.substr(1, u.search.length - 1).split('&') : [];
        const params = {};
        for (const i in search) {
            const prop = search[i].split('=');
            params[prop[0]] = prop[1] || null;
        }

        return {
            ...lodash.pick(u, ['hostname', 'pathname', 'protocol', 'port', 'origin']),
            props: params
        };
    }
}

class Var {
    static SHA256(string) {
        string = typeof string === "object" ? JSON.stringify(string) : string;
        let chrsz = 8;
        let hexcase = 0;

        function safe_add(x, y) {
            let lsw = (x & 0xFFFF) + (y & 0xFFFF);
            let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function S(X, n) {
            return (X >>> n) | (X << (32 - n));
        }

        function R(X, n) {
            return (X >>> n);
        }

        function Ch(x, y, z) {
            return ((x & y) ^ ((~x) & z));
        }

        function Maj(x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        }

        function Sigma0256(x) {
            return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
        }

        function Sigma1256(x) {
            return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
        }

        function Gamma0256(x) {
            return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
        }

        function Gamma1256(x) {
            return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
        }

        function core_sha256(m, l) {
            let K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
            let HASH = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
            let W = [64];
            let a, b, c, d, e, f, g, h;
            let T1, T2;
            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;
            for (let i = 0; i < m.length; i += 16) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];
                for (let j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }
                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        function str2binb(str) {
            let bin = [];
            let mask = (1 << chrsz) - 1;
            for (let i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
            }
            return bin;
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            let utftext = "";
            for (let n = 0; n < string.length; n++) {
                let c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }

        function binb2hex(binarray) {
            let hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            let str = "";
            for (let i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            }
            return str;
        }

        string = Utf8Encode(string);
        return binb2hex(core_sha256(str2binb(string), string.length * chrsz));
    }

    static decode(data) {
        data = decodeURIComponent(escape(atob(data))).split('||');
        try {
            switch (data[0]) {
                case "number":
                    return parseInt(data[1], 10);
                case "string":
                    return data[1];
                case "object":
                    return JSON.parse(data[1]);
                default :
                    console.log('%cdata type not supported', 'color:red');
            }
        } catch (e) {
            console.log('%csomethimng went wrong!!!', 'color:red');
        }
    }

    static encode(data) {
        switch (typeof data) {
            case "number":
                return btoa(unescape(encodeURIComponent(`number||${data}`)));
            case "string":
                return btoa(unescape(encodeURIComponent(`string||${data}`)));
            case "object":
                return btoa(unescape(encodeURIComponent(`object||${JSON.stringify(data)}`)));
            default :
                console.log('%cdata type not supported', 'color:red');
        }
    }

    static isDefined(v) {
        return !Var.isUndefined(v);
    }

    static isEmpty(v) {
        return v === '';
    }

    static isNotEmpty(v) {
        return !Var.isEmpty(v);
    }

    static isNotNull(v) {
        return !Var.isNull(v);
    }

    static isNotNumber(v) {
        return !Var.isNumber(v);
    }

    static isNotVoid(v) {
        return !Var.isVoid(v);
    }

    static isNotZero(v) {
        return !Var.isZero(v);
    }

    static isNull(v) {
        return v === null || v === 'null';
    }

    static isNumber(v) {
        return typeof v === "number";
    }

    static isUndefined(v) {
        return v === undefined || v === 'undefined';
    }

    static isVoid(v) {
        return Var.isNull(v) || Var.isUndefined(v) || Var.isEmpty(v);
    }

    static isZero(v) {
        return (typeof v === "string" ? parseInt(v, 10) || 0 : v) === 0;
    }

    static shuffle(string = 'abcdefghijklmnopqrstuvwxyz0123456789', count = string.length) {
        if (string === undefined || string === null || string === 'string') {
            string = 'abcdefghijklmnopqrstuvwxyz0123456789';
            count = 10;
        } else if (string === 'number') {
            string = '0123456789';
            count = 10;
        } else if (string === 'alphabet') {
            string = 'abcdefghijklmnopqrstuvwxyz';
            count = 10;
        }

        let text = string.split('');
        let textLength = text.length;
        let str = '';
        for (let i = 0; i < count; i++)
            str += text[App.rand(0, textLength - 1)];
        return str;
    }

    static translate(string, dictionary) {
        for (let key in dictionary)
            string = string.replace(new RegExp(`:${key}`, 'g'), dictionary[key]);
        return string;
    }
}

class PromiseController {
    constructor() {
        this.promiseController = new AbortController();
    }

    abort() {
        try {
            this.promiseController.abort();
        } catch (e) {
        }
    }

    signal() {
        if (this.promiseController.signal.aborted)
            this.promiseController = new AbortController();
        return this.promiseController.signal;
    }

    state() {
        return this.promiseController.signal.aborted;
    }
}

class Tool {
    static METHODS = {
        POST: 'POST',
        GET: 'GET',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE'
    };
    static historyStack = [];
    static mapBarcodeToBloodGroups = {
        62: {id: 1, name: "A+(POS)"},
        73: {id: 2, name: "B+(POS)"},
        84: {id: 3, name: "AB+(POS)"},
        51: {id: 4, name: "O+(POS)"},
        'H6': {id: null, name: "OH+(POS)"},
        '06': {id: 5, name: "A-(NEG)"},
        17: {id: 6, name: "B-(NEG)"},
        28: {id: 7, name: "AB-(NEG)"},
        95: {id: 8, name: "O-(NEG)"},
        'G6': {id: null, name: "OH-(NEG)"}
    };
    static mapBarcodeToProductTypes = {
        1: {id: 1, name: "خون کامل (WB)", shortName: "WB", enzymeType: 1},
        '0195': {id: 2, name: "گلبول قرمز متراکم (RBC)", shortName: "RBC", enzymeType: 1},
        3: {id: 3, name: "گلبول قرمز کم لکوسیت (L.RBC)", shortName: "L.RBC", enzymeType: 1},
        4: {id: 4, name: "کیسه خون اطفال (Pediatrict RBC)", shortName: "Pediatrict RBC", enzymeType: 1},
        '2833': {id: 5, name: "پلاکت (PLT)", shortName: "PLT", enzymeType: 3},
        6: {id: 6, name: "پلاکت کم لکوسیت (LR.PLT)", shortName: "LRPLT", enzymeType: 3},
        '0707': {id: 7, name: "پلاسمای تازه منجمد (FFP)", shortName: "FFP", enzymeType: 2},
        '1905': {id: null, name: "پلاسمای تازه منجمد کوید(Covid FFP)", shortName: "Covid FFP", enzymeType: 2},
        8: {id: 8, name: "پلاسمای فاقد کرایو (CPP)", shortName: "CPP", enzymeType: 2},
        '5165': {id: 9, name: "رسوب کرایو (CRY)", shortName: "CRY", enzymeType: 2},
        10: {id: 10, name: "گلبول قرمز شسته شده (Washed.RBC)", shortName: "Washed RBC", enzymeType: 1},
        11: {id: 11, name: "گلبول قرمز اشعه دیده (Radiated.RBC)", shortName: "Radiated RBC", enzymeType: 1},
        12: {id: 12, name: "پلاکت فریزیس (Friesis.PLT)", shortName: "Friesis PLT", enzymeType: 3}
    };

    static addToHistory(key, callback) {
        if (this.historyStack.find(item => item.key === key)) {
            console.log(`Duplicated [${key}] key in history stack`);
            return;
        }
        this.historyStack.push({key, callback});
        console.log('historyChunks', 'add', key, this.historyStack);
    }

    static applyGridDefaultSettings(defaultSettings = {}, grid = {}) {
        const removeHeaderParents = columns => {
            const array = [];

            for (let col of columns)
                array.push(...(col.children ? col.children : [col]));

            return array;
        };
        const changes = {};

        // removes parent header if settings wants
        if (!defaultSettings.showParentHeader || !defaultSettings.showHeaderFilters) {
            if (!defaultSettings.showParentHeader)
                changes.columnDefs = removeHeaderParents(grid.columnDefs);

            if (!defaultSettings.showHeaderFilters)
                changes.defaultColDef = {
                    floatingFilter: false
                };

            return {
                ...grid,
                ...changes
            };
        }
        return false;
    }

    static backToHistory() {
        const history = Tool.removeFromHistory();
        if (history)
            history.callback();
        else
            window.open('/exit', '_parent');
    }

    static can(...names) {
        const permissions = App.storage.get('redux', {})?.user?.permissions || [];
        const permission = {};

        for (let i in names) {
            permission[names[i]] = Boolean(permissions.find(item => item.name === names[i]));

            // if (window.ENV.DEBUG_MOOD) {
            if (permission[names[i]]) {
                console.log('%cUser has access to:', 'color:#4dc0b5', names[i]);
            } else {
                console.log('%cAccess denied for:', 'color:#e3342f', names[i]);
            }
            // }
        }
        const flags = Object.values(permission);

        return flags.length > 1 ? {
            and: _ => flags.find(item => item === false) === undefined,
            or: _ => flags.find(item => item === true) !== undefined,
            checks: _ => permission,
            flags: _ => flags
        } : flags[0];
    }

    static checkBarcode(text) {
        const isEnglish = _ => !(/[ضصثقفغعهخحجچپشسیبلاتنمکگظطزرذدئوًٌٍَُِّۀآةيژؤإأء]+/.test(text));

        const barcodeRegex = {
            PRODUCT_EXPIRE_DATE: /^=>([0-9]{3})([0-9]{3})$/,
            PRODUCT_COLLECTION_DATE: /^=\*([0-9]{3})([0-9]{3})$/,
            PRODUCT_BLOOD_GROUP: /^=%([0-9A-Z]{2})([0-9]{1})([0-9]{1})$/,
            PRODUCT_TYPE: /^=<([A-Z]{1})([0-9]{4})([A-Z]{1})([0-9A-Z]{1})([0-9A-Z]{1})$/,
            PRODUCT_NUMBER: /^=([A-Z0-9]{5})([0-9]{2})([0-9]{6})([0-9]{2})([A-Z0-9]{1})$/
        };

        const barcode = {
            english: isEnglish(),
            text,
            type: undefined,
            match: undefined,
            data: undefined,
            success: false
        };

        if (!barcode.english)
            // new Notif('کیبورد خود را به انگلیسی تغییر دهید.').show();

            for (const key in barcodeRegex) {
                const regex = barcodeRegex[key];
                if (regex.test(text)) {
                    barcode.type = key;
                    barcode.match = text.match(regex);
                    barcode.success = true;
                    break;
                }
            }

        switch (barcode.type) {
            case 'PRODUCT_EXPIRE_DATE':
                barcode.data = moment(`2${barcode.match[1]}/${barcode.match[2]}`, 'Y/DDD');
                break;
            case 'PRODUCT_COLLECTION_DATE':
                barcode.data = moment(`2${barcode.match[1]}/${barcode.match[2]}`, 'Y/DDD');
                break;
            case 'PRODUCT_BLOOD_GROUP':
                barcode.data = Tool.mapBarcodeToBloodGroups[barcode.match[1]];
                break;
            case 'PRODUCT_TYPE':
                barcode.data = Tool.mapBarcodeToProductTypes[barcode.match[2]];
                break;
            case 'PRODUCT_NUMBER':
                barcode.data = `${barcode.match[1]}${barcode.match[2]}${barcode.match[3]}${barcode.match[5]}`;
                break;
            default:
                break;
        }

        // if (window.ENV.DEBUG_MOOD)
        console.log(barcode);
        return barcode;
    }

    static headers(params = {}) {
        let token = App.storage.get('redux', {})?.user?.sessionGUID || false;

        // token && (token = `Bearer ${token}`);

        const headers = {
            'Accept': 'text/plain',
            'Content-Type': 'application/json',
            'Authorization': token,
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
            ...params
        };
        for (let key in headers)
            if (headers[key] === false)
                delete headers[key];
        return headers;
    }

    static loadImage(url) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                cache: 'no-cache',
            })
                .then(response => {
                    if (response.status !== 200)
                        reject('not found');
                    return response.blob();
                })
                .then(image => {
                    resolve(URL.createObjectURL(image));
                })
                .catch(message => {
                    reject(message);
                });
        });
    }

    static meta(key, value) {
        const meta = document.querySelector(`meta[name=${key}]`);

        if (value)
            meta.setAttribute("content", value);
        else
            return meta.content;
    }

    static removeFromHistory(key) {
        if (key) {
            let i = null;
            const history = this.historyStack.find((item, index) => item.key === key && (i = index));
            if (i === null) {
                console.log('historyChunks', 'remove', key, 'NotFound');
                return null;
            }
            this.historyStack = this.historyStack.slice(0, i);
            console.log('historyChunks', 'remove', key, this.historyStack);
            return history;
        } else {
            const history = this.historyStack.pop();
            console.log('historyChunks', 'remove last one', history ? history.key : '', this.historyStack);
            return history;
        }
    }

    static response(response, roles = {}) {
        roles = {
            '200:-3,200:-2': _ => {
                // new Notif({message: 'برای استفاده از سامانه باید دوباره لاگین کنید.', theme: 'error'}).show();
                // setTimeout(_ => {
                window.location.href = '/logout';
                // }, 10000);
            },
            '403': _ => {
                console.log('شما دسترسی به این صفحه را ندارد.');
            },
            ...roles
        };
        const rolesMapGenerator = roles => {
            const rolesMap = {};

            for (let key in roles) {
                //default functionality doesn't need to be mapped
                if (key === 'default') continue;

                const keyo = key.split(',');
                for (let k of keyo) {
                    const x = k.split(':');

                    if (!rolesMap[x[0]]) rolesMap[x[0]] = {};
                    if (!rolesMap[x[0]][x[1] || 'default']) rolesMap[x[0]][x[1] || 'default'] = [];

                    rolesMap[x[0]][x[1] || 'default'].push(key);
                }
            }

            return rolesMap;
        };
        const runMethods = (keys, result) => {
            for (const key of keys)
                roles[key](result);
        };
        const rolesMap = rolesMapGenerator(roles);
        const status = response.status;

        response.json().then(result => {
            let flag = true;

            // if status predicted
            if (rolesMap[status]) {

                // if roles has http status code case
                if (rolesMap[status]['default']) {
                    runMethods(rolesMap[status]['default'], result);
                    flag = false;
                }

                // if roles has http status code and specified code case
                if (rolesMap[status][result.resultCode]) {
                    runMethods(rolesMap[status][result.resultCode], result);
                    flag = false;
                }

            }

            if (flag && roles['default']) { // if programmer has a default case
                runMethods(['default'], result);
            }
        });
    }

    static validate(...refs) {
        const validates = [];

        for (let ref of refs) {
            if (Array.isArray(ref)) {
                if (ref[0].current) {
                    const validate = ref[0].current.validate(...ref.slice(1));
                    if (validate !== true)
                        validates.push(validate);
                }
            } else {
                if (ref.current) {
                    const validate = ref.current.validate();
                    if (validate !== true)
                        validates.push(validate);
                }
            }
        }

        const fields = validates.map(item => item?.label);
        const errors = validates.map(item => item?.message);
        const fieldsLength = fields.length;

        if (fieldsLength > 1) {
            fields[fieldsLength - 2] += ` و ${fields.pop()}`;
        }

        return validates.length === 0 ? true : {
            validations: validates,
            fields,
            errors,
            message: `فیلد‌${fieldsLength > 1 ? 'های' : ''} ${fields.join('، ')} خطا دار${fields.length > 1 ? 'ن' : ''}د.`
        };
    }
}

export default App;
export {Service, Url, Var, PromiseController, Tool};
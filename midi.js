!(function (t) {
    try {
        (t.MIDIjs = new Object()), (t.MIDIjs.initError = "initializing ...");
        var n,
            s,
            l,
            u,
            r,
            d,
            c = 6,
            m = null,
            p = 0,
            o = 32768,
            f = 8192,
            g = 0,
            a = 0,
            I = 0,
            b = !1,
            M = "",
            w = -1,
            j = "",
            y = !1,
            v = 0,
            h = !1,
            _ = 100,
            D = null,
            A = null,
            k = "libtimidity-for-worklet.js?v=" + c,
            x = null,
            O = new Array(),
            C = 440,
            E = new Int32Array(128),
            T = Math.pow(2, 1 / 12);
        function R(e) {
            var t = 0;
            return void 0 !== e && (!0 === e ? (t = -1) : !isNaN(e) && 0 < e && (t = e)), t;
        }
        var N = !1;
        function q(e, t) {
            for (var n = 0; n < document.scripts.length; n++) {
                var r = document.scripts[n].src;
                if (ce == r) {
                    if (N) return void t();
                    var o = newjs.onload;
                    return (
                        (newjs.onreadystatechange = function () {
                            ("loaded" !== newjs.readyState && "complete" !== newjs.readyState) || ((newjs.onreadystatechange = null), (N = !0), o(), t());
                        }),
                        void (newjs.onload = function () {
                            (N = !0), o(), t();
                        })
                    );
                }
            }
            var a = document.getElementsByTagName("script")[0];
            (newjs = document.createElement("script")),
                (newjs.onreadystatechange = function () {
                    ("loaded" !== newjs.readyState && "complete" !== newjs.readyState) || ((newjs.onreadystatechange = null), (N = !0), t());
                }),
                (newjs.onload = function () {
                    (N = !0), t();
                }),
                (newjs.onerror = function () {
                    Y("Error: Cannot load  JavaScript file " + e);
                }),
                (newjs.src = e),
                (newjs.type = "text/javascript"),
                a.parentNode.insertBefore(newjs, a);
        }
        function P(e) {
            if (!I || !b) return Y("process(): No song started, returning true"), !0;
            if (0 == (a = Module.ccall("mid_song_read_wave", "number", ["number", "number", "number", "number"], [I, s, 2 * f, y]))) return Y("Reached end of song"), U(), void (b = !1);
            for (var t = 0; t < f; t++) e.outputBuffer.getChannelData(0)[t] = t < a / 2 ? Module.getValue(s + 2 * t, "i16") / o : 0;
            -1 == w && (w = m.currentTime);
        }
        function W() {
            var e = new Object();
            (e.time = -1 != w ? m.currentTime - w : 0), (e.status = "playing"), MIDIjs.player_callback && MIDIjs.player_callback(e);
        }
        function e() {
            m && m.suspend && m.suspend();
        }
        function L() {
            if (m && m.resume) return m.resume();
        }
        function H(e) {
            m || ((window.AudioContext = window.AudioContext || window.webkitAudioContext), (m = new AudioContext())), m.resume ? m.resume().then(S(e)) : S(e);
        }
        function S(e) {
            (w = -1),
                W(),
                Y("Loading libtimidity ... "),
                q(ce, function () {
                    V(e, F, null);
                });
        }
        function V(e, t, n) {
            if (-1 != e.indexOf("data:")) {
                var r = e.indexOf(",") + 1,
                    o = atob(e.substring(r));
                u = new Uint8Array(new ArrayBuffer(o.length));
                for (var a = 0; a < o.length; a++) u[a] = o.charCodeAt(a);
                return t("data:audio/x-midi ...", u, n);
            }
            Y("Loading MIDI file " + e + " ..."), n || MIDIjs.message_callback("Loading MIDI file " + e + " ...");
            var i = new XMLHttpRequest();
            i.open("GET", e, !0),
                (i.responseType = "arraybuffer"),
                (i.onerror = function () {
                    Y("Error: Cannot retrieve MIDI file " + e);
                }),
                (i.onload = function () {
                    if (200 == i.status) return Y("MIDI file loaded: " + e), (u = new Int8Array(i.response)), t(e, u, n);
                    Y("Error: Cannot retrieve MIDI file " + e + " : " + i.status);
                }),
                i.send();
        }
        function F(e, t, n) {
            (l = Module._malloc(t.length)), Module.writeArrayToMemory(t, l), (rval = Module.ccall("mid_init", "number", [], []));
            var r = Module.ccall("mid_istream_open_mem", "number", ["number", "number", "number"], [l, t.length, !1]),
                t = Module.ccall("mid_create_options", "number", ["number", "number", "number", "number"], [m.sampleRate, 32784, 1, 2 * f]);
            if (((I = Module.ccall("mid_song_load", "number", ["number", "number"], [r, t])), (rval = Module.ccall("mid_istream_close", "number", ["number"], [r])), 0 < (g = Module.ccall("mid_song_get_num_missing_instruments", "number", ["number"], [I]))))
                for (var o = 0; o < g; o++) {
                    var a = Module.ccall("mid_song_get_missing_instrument", "string", ["number", "number"], [I, o]);
                    !(function (n, r, o) {
                        var a = new XMLHttpRequest();
                        a.open("GET", r + o, !0),
                            (a.responseType = "arraybuffer"),
                            (a.onerror = function () {
                                Y("Error: Cannot retrieve patch file " + r + o);
                            }),
                            (a.onload = function () {
                                var e, t;
                                200 == a.status
                                    ? (g--,
                                      FS.createDataFile("pat/", o, new Int8Array(a.response), !0, !0),
                                      MIDIjs.message_callback && 0 < g && MIDIjs.message_callback("Instruments to be loaded: " + g),
                                      Y("Instruments to be loaded: " + g),
                                      0 == g &&
                                          ((e = Module.ccall("mid_istream_open_mem", "number", ["number", "number", "number"], [l, u.length, !1])),
                                          (t = Module.ccall("mid_create_options", "number", ["number", "number", "number", "number"], [m.sampleRate, 32784, 1, 2 * f])),
                                          (I = Module.ccall("mid_song_load", "number", ["number", "number"], [e, t])),
                                          Module.ccall("mid_istream_close", "number", ["number"], [e]),
                                          Module.ccall("mid_song_start", "void", ["number"], [I]),
                                          (b = !0),
                                          (p = m.createScriptProcessor(f, 0, 1)),
                                          (s = Module._malloc(2 * f)),
                                          (p.onaudioprocess = P),
                                          p.connect(m.destination),
                                          (d = setInterval(W, _)),
                                          W(),
                                          MIDIjs.message_callback && MIDIjs.message_callback("Playing: " + n),
                                          Y("Playing1: " + n + " ... song: " + I)))
                                    : Y("Error: Cannot retrieve patch file " + r + o + " : " + a.status);
                            }),
                            a.send();
                    })(e, M + "pat/", a);
                }
            else Module.ccall("mid_song_start", "void", ["number"], [I]), (b = !0), (p = m.createScriptProcessor(f, 0, 1)), (s = Module._malloc(2 * f)), (p.onaudioprocess = P), p.connect(m.destination), (d = setInterval(W, _)), W(), MIDIjs.message_callback && MIDIjs.message_callback("Playing: " + e), Y("Playing2: " + e + " ... song: " + I);
        }
        function U() {
            Y("release_player"), p && (p.disconnect(), (p.onaudioprocess = 0), (p = 0)), I && (Module._free(s), Module._free(l), Module.ccall("mid_song_free", "void", ["number"], [I]), (I = 0));
        }
        function B() {
            y || (Y("stopping player"), U(), clearInterval(d), Y(j));
        }
        function G(e) {
            return -1 != e.indexOf("http:") ? e : ((e = e), ((r = void 0 === r ? document.createElement("a") : r).href = e), r.href).replace("https:", "http:");
        }
        function z() {
            var e = new Object();
            -1 == w && (w = new Date().getTime()), (e.time = (new Date().getTime() - w) / 1e3), (e.status = "playing"), MIDIjs.player_callback && MIDIjs.player_callback(e);
        }
        function X(e, t) {
            J(), (v = R(t)), (url = G(e));
            t = v;
            -1 == v && (t = "infinite");
            e = document.getElementById("scorioMIDI");
            e ? (e.lastChild.setAttribute("src", url), e.lastChild.setAttribute("loop", t)) : ((e = document.createElement("div")).setAttribute("id", "scorioMIDI"), (e.innerHTML = '&nbsp;<bgsound src="' + url + '" loop="' + t + '" volume="0"/>'), document.body && document.body.appendChild(e)), (d = setInterval(z, _)), (w = -1), (p = e), Y("Playing " + url + " ...");
        }
        function J() {
            p && (p.lastChild.setAttribute("src", G(M) + "../midi/silence.mid"), clearInterval(d), (p = 0)), Y(j);
        }
        function K() {
            var e;
            p && ((e = p).parentNode.removeChild(e), clearInterval(d), (p = 0)), Y(j);
        }
        function Q(e, t, n) {
            var r = Module._malloc(t.length);
            Module.writeArrayToMemory(t, r);
            Module.ccall("mid_init", "number", [], []);
            var o = Module.ccall("mid_istream_open_mem", "number", ["number", "number", "number"], [r, t.length, !1]),
                t = Module.ccall("mid_create_options", "number", ["number", "number", "number", "number"], [44100, 32784, 1, 2 * f]),
                t = Module.ccall("mid_song_load", "number", ["number", "number"], [o, t]),
                o = (Module.ccall("mid_istream_close", "number", ["number"], [o]), Module.ccall("mid_song_get_total_time", "number", ["number"], [t]) / 1e3);
            Module.ccall("mid_song_free", "void", ["number"], [t]), Module._free(r), n && n(o);
        }
        function Y() {
            if (h) {
                for (var e = new Array("[midijs] "), t = 0; t < arguments.length; t++) e.push(arguments[t]);
                console.log.apply(null, e);
            }
        }
        function Z(e, t) {
            $(),
                (v = R(t)),
                (function (i, s) {
                    Y("play_WebAudioWorklet2 " + i), m || ((window.AudioContext = window.AudioContext || window.webkitAudioContext), (m = new AudioContext()));
                    (w = -1),
                        m.audioWorklet.addModule(M + k).then(function () {
                            D = new AudioWorkletNode(m, "midijs-audio-worklet");
                            var e = new Object();
                            (e.type = "set-logging"), (e.logging = h), D.port.postMessage(e), D.connect(m.destination);
                            var a = D;
                            (D.port.onmessage = function (e) {
                                var n = e.data;
                                if ((Y("Request from worklet: ", n), "get-patches" == n.type)) {
                                    var t = n.patches;
                                    if (0 == (g = t.length)) {
                                        e = new Object();
                                        (e.type = "start-player"), (e.url = i), D.port.postMessage(e), m.resume(), (w = m.currentTime), (d = setInterval(W, _)), W(), Y("Start playing " + i), s && s(), MIDIjs.message_callback && MIDIjs.message_callback("Now playing " + i);
                                    } else
                                        for (var r = 0; r < t.length; r++) {
                                            var o = t[r];
                                            re(D, i, M + "pat/", o, y);
                                        }
                                } else
                                    "song-finished" == n.type
                                        ? (a.disconnect(),
                                          clearInterval(d),
                                          setTimeout(function () {
                                              var e, t;
                                              MIDIjs.player_callback && ((e = n.duration), 0 < v && (e = n.duration * (1 + v)), ((t = new Object()).time = e), (t.status = "finished"), MIDIjs.player_callback(t));
                                          }, 1))
                                        : Y("Error. Unkown request from worklet: " + n.type);
                            }),
                                V(
                                    i,
                                    function (e, t, n) {
                                        Y("Got MIDI data from URL: " + e), le(D);
                                        var r = new Object();
                                        (r.type = "prepare-player"), (r.url = e), (r.midiDataArray = t), (r.sampleRate = m.sampleRate), (r.isEndless = !1), (r.looping = v), D.port.postMessage(r);
                                    },
                                    function () {
                                        Y("HIHO from and_then_callback");
                                    }
                                );
                        });
                })(e, null);
        }
        function $() {
            var e;
            y || (D && (D.disconnect(), ((e = new Object()).type = "release-player"), D.port.postMessage(e)), (D = null), (y = !1), (v = 0), clearInterval(d));
        }
        function ee(o, a, i) {
            var e;
            12 == (240 & o) >> 4
                ? V(
                      M + "../midi/init.midi?v=" + c,
                      function (e, t, n) {
                          Y("Got MIDI data from URL: " + e), (t[43] = a);
                          var r = new Object();
                          (r.type = "prepare-player"), (r.url = e), (r.midiDataArray = t), (r.sampleRate = m.sampleRate), (r.isEndless = !0), (r.looping = !1), A.port.postMessage(r), ((r = new Object()).type = "midi-message"), (r.status = o), (r.a = a), (r.b = i), A.port.postMessage(r);
                      },
                      function () {}
                  )
                : (((e = new Object()).type = "midi-message"), (e.status = o), (e.a = a), (e.b = i), A.port.postMessage(e));
        }
        function te(e, t, n) {
            A || ne(),
                "suspended" === m.state
                    ? m.resume().then(function () {
                          x.then(function () {
                              ee(e, t, n);
                          });
                      })
                    : x.then(function () {
                          ee(e, t, n);
                      });
        }
        function ne(e) {
            var a;
            A ||
                (m || ((window.AudioContext = window.AudioContext || window.webkitAudioContext), (m = new AudioContext())),
                (a = null),
                (x = new Promise(function (e) {
                    a = e;
                })),
                m.audioWorklet.addModule(M + k).then(function () {
                    A = new AudioWorkletNode(m, "midijs-audio-worklet");
                    var e = new Object();
                    (e.type = "set-logging"),
                        (e.logging = h),
                        A.port.postMessage(e),
                        A.connect(m.destination),
                        (A.port.onmessage = function (e) {
                            var t = e.data;
                            if ((Y("Request from worklet: ", t), "get-patches" == t.type)) {
                                var n = t.patches;
                                if (0 == (g = n.length)) {
                                    e = new Object();
                                    (e.type = "start-player"), (e.url = M + "../midi/init-expander.midi?v=" + c), A.port.postMessage(e);
                                } else
                                    for (var r = 0; r < n.length; r++) {
                                        var o = n[r];
                                        re(A, M + "../midi/init-expander.midi?v=" + c, M + "pat/", o, !0);
                                    }
                            } else "song-finished" == t.type ? a() : Y("Error. Unkown request from expanderAudioWorket: ", t);
                        }),
                        V(
                            M + "../midi/init-expander.midi?v=" + c,
                            function (e, t, n) {
                                Y("Got MIDI data from URL: " + e), le(A);
                                var r = new Object();
                                (r.type = "prepare-player"), (r.url = e), (r.midiDataArray = t), (r.sampleRate = m.sampleRate), (r.isEndless = !0), (r.looping = !1), A.port.postMessage(r);
                            },
                            function () {
                                Y("HIHO from and_then_callback");
                            }
                        );
                }));
        }
        function re(t, n, r, o, a) {
            var i = new XMLHttpRequest();
            i.open("GET", r + o, !0),
                (i.responseType = "arraybuffer"),
                (i.onerror = function () {
                    Y("Error: Cannot retrieve patch file " + r + o);
                }),
                (i.onload = function () {
                    var e;
                    200 == i.status ? (g--, ((e = new Object()).type = "save-patch"), (e.filename = o), (e.patchDataArray = new Int8Array(i.response)), t.port.postMessage(e), Y("Instruments to be loaded: " + g), 0 == g && (((e = new Object()).type = "prepare-player"), (e.url = n), (e.midiDataArray = u), (e.sampleRate = m.sampleRate), (e.isEndless = a), (e.looping = v), t.port.postMessage(e))) : Y("Error: Cannot retrieve patch file " + r + o + " : " + i.status);
                }),
                i.send();
        }
        function oe(e, t) {
            for (i = 0; i < 128; i++) {
                var n = 5 - Math.floor(i / 12);
                e[i] = (t[i % 12] / Math.pow(2, n)) * 1e3;
            }
        }
        function ae(e, t) {
            (e[9] = C), (e[2] = e[9] / t), (e[7] = (e[2] / t) * 2), (e[0] = e[7] / t), (e[5] = (e[0] / t) * 2), (e[10] = (e[5] / t) * 2), (e[3] = e[10] / t), (e[4] = (e[9] * t) / 2), (e[11] = e[4] * t), (e[6] = (e[11] * t) / 2), (e[1] = (e[6] * t) / 2), (e[8] = e[1] * t);
        }
        function ie(e, t, n) {
            var r;
            for (i = 0; i < 12; i++) (r = i - n < 0 ? 2 : 1), (r /= 9 - n < 0 ? 2 : 1), (e[i] = ((C / t[(9 - n + 12) % 12]) * t[(i - n + 12) % 12]) / r);
        }
        function se(e) {
            A ? A.port.postMessage(e) : O.push(e);
        }
        function le(e) {
            for (var t = 0; t < O.length; t++) e.port.postMessage(O[t]);
            O = new Array();
        }
        function ue(t, n) {
            m.audioWorklet.addModule(M + k).then(function () {
                var o = new AudioWorkletNode(m, "midijs-audio-worklet"),
                    e = new Object();
                (e.type = "set-logging"),
                    (e.logging = h),
                    o.port.postMessage(e),
                    (o.port.onmessage = function (e) {
                        e = e.data;
                        Y("Request from worklet: ", e), "duration" == e.type ? n && n(e.duration) : "finished" == e.type || Y("Error. Unkown request from worklet: " + e.type);
                    }),
                    V(
                        t,
                        function (e, t, n) {
                            Y("Got MIDI data from URL: " + e);
                            var r = new Object();
                            (r.type = "get-duration"), (r.url = e), (r.midiDataArray = t), (r.sampleRate = m.sampleRate), o.port.postMessage(r);
                        },
                        function () {
                            Y("HIHO from and_then_callback");
                        }
                    );
            });
        }
        function de(e) {
            for (i = 0; i < 128; i++) e[i] = Math.round(C * Math.pow(T, i - 69) * 1e3);
        }
        0 == location.href.indexOf("http:") && console.warn("[midijs] Using MIDIjs on HTTP pages is DEPRECATED. HTTP support will be removed in upcoming releases. https://www.midijs.net");
        var ce =
                (M = (M = (function () {
                    for (var e = 0; e < document.scripts.length; e++) {
                        var t = document.scripts[e].src,
                            n = t.lastIndexOf("/midi.js");
                        if (n == t.length - 8) return t.substr(0, n + 1);
                    }
                    return null;
                })()).match(/https?:\/\/[^\.]+\.(scorio.com|midijs.net).*/)
                    ? "https://cdn.scorio.com/midijs/lib/"
                    : M) +
                "libtimidity.js?v=" +
                c,
            me =
                ((Ie = navigator.userAgent),
                (be = navigator.appName),
                (Me = "" + parseFloat(navigator.appVersion)),
                (we = parseInt(navigator.appVersion, 10)),
                -1 != (ge = Ie.indexOf("Opera"))
                    ? ((be = "Opera"), (Me = Ie.substring(ge + 6)), -1 != (ge = Ie.indexOf("Version")) && (Me = Ie.substring(ge + 8)))
                    : -1 != (ge = Ie.indexOf("MSIE"))
                    ? ((be = "Microsoft Internet Explorer"), (Me = Ie.substring(ge + 5)))
                    : -1 != (ge = Ie.indexOf("Trident"))
                    ? ((be = "Microsoft Internet Explorer"), (Me = -1 != (ge = Ie.indexOf("rv:")) ? Ie.substring(ge + 3) : "0.0"))
                    : -1 != (ge = Ie.indexOf("Chrome"))
                    ? ((be = "Chrome"), (Me = Ie.substring(ge + 7)))
                    : -1 != (ge = Ie.indexOf("Android"))
                    ? ((be = "Android"), (Me = Ie.substring(ge + 8)))
                    : -1 != (ge = Ie.indexOf("Safari"))
                    ? ((be = "Safari"), (Me = Ie.substring(ge + 7)), -1 != (ge = Ie.indexOf("Version")) && (Me = Ie.substring(ge + 8)))
                    : -1 != (ge = Ie.indexOf("Firefox"))
                    ? ((be = "Firefox"), (Me = Ie.substring(ge + 8)))
                    : (fe = Ie.lastIndexOf(" ") + 1) < (ge = Ie.lastIndexOf("/")) && ((be = Ie.substring(fe, ge)), (Me = Ie.substring(ge + 1)), be.toLowerCase() == be.toUpperCase() && (be = navigator.appName)),
                -1 != (Ie = (Me = -1 != (Ie = (Me = -1 != (Ie = Me.indexOf(";")) ? Me.substring(0, Ie) : Me).indexOf(" ")) ? Me.substring(0, Ie) : Me).indexOf(")")) && (Me = Me.substring(0, Ie)),
                (we = parseInt("" + Me, 10)),
                isNaN(we) && ((Me = "" + parseFloat(navigator.appVersion)), (we = parseInt(navigator.appVersion, 10))),
                ((Ie = new Object()).browserName = be),
                (Ie.fullVersion = Me),
                (Ie.majorVersion = we),
                (Ie.appName = navigator.appName),
                (Ie.userAgent = navigator.userAgent),
                (Ie.platform = navigator.platform),
                Ie);
        try {
            ("iPhone" == me.platform || "iPod" == me.platform || "iPad" == me.platform) && me.majorVersion <= 6 ? (n = "none") : ((window.AudioContext = window.AudioContext || window.webkitAudioContext), (m = new AudioContext()), (n = "WebAudioAPI"), null != m.audioWorklet && ((n = "WebAudioWorklet"), me.platform.includes("Linux") && "Chrome" == me.browserName && me.majorVersion < 94 && 92 != me.majorVersion && t.alert("For perfect sound, please update your Google Chrome browser (version " + me.fullVersion + ") to a current version (94 or greater).")));
        } catch (je) {
            n = "Microsoft Internet Explorer" == me.browserName ? "bgsound" : "Android" == me.browserName ? "none" : "object";
        }
        function pe(e) {
            console.warn("[midijs] " + e + ": Function not implemented for detected audio method: " + n);
        }
        (t.MIDIjs.set_logging = function (e) {
            (h = e), Y("Detected audioMethod: " + n, m || "");
        }),
            (t.MIDIjs.setLogging = function (e) {
                (h = e), Y("Detected audioMethod: " + n, m || "");
            }),
            (t.MIDIjs.get_logging = function () {
                return h;
            }),
            (t.MIDIjs.getLogging = function () {
                return h;
            }),
            (t.MIDIjs.player_callback = function (e) {}),
            (t.MIDIjs.setPlayerCallback = function (e) {
                t.MIDIjs.player_callback = e;
            }),
            (t.MIDIjs.message_callback = function (e) {}),
            (t.MIDIjs.setMessageCallback = function (e) {
                t.MIDIjs.message_callback = e;
            }),
            (t.MIDIjs.get_audio_status = function () {
                return j;
            }),
            (t.MIDIjs.getAudioStatus = function () {
                return j;
            }),
            (t.MIDIjs.get_duration = function (e, t) {
                "Microsoft Internet Explorer" == me.browserName && me.fullVersion < 10
                    ? t && t(-1)
                    : q(ce, function () {
                          V(e, Q, t);
                      });
            }),
            (t.MIDIjs.getDuration = t.MIDIjs.get_duration),
            de(E),
            (t.MIDIjs.getFreqTable = function () {
                return E;
            }),
            (t.MIDIjs.pause = function () {
                pe("pause");
            }),
            (t.MIDIjs.resume = function () {
                pe("resume");
            }),
            (t.MIDIjs.setFreqTable = function () {
                pe("setFreqTable");
            }),
            (t.MIDIjs.setMasterPitch = function () {
                pe("setMasterPitch");
            }),
            (t.MIDIjs.noteOn = function () {
                pe("noteOn");
            }),
            (t.MIDIjs.midiMessage = function () {
                pe("midiMessage");
            }),
            (t.MIDIjs.startExpander = function () {
                pe("startExpander");
            }),
            "WebAudioWorklet" == n
                ? ((t.MIDIjs.get_duration = ue),
                  (t.MIDIjs.getDuration = ue),
                  (t.MIDIjs.pause = e),
                  (t.MIDIjs.resume = L),
                  (t.MIDIjs.play = Z),
                  (t.MIDIjs.stop = $),
                  (j = "audioMethod: WebAudioWorklet, sampleRate (Hz): " + m.sampleRate),
                  (t.MIDIjs.noteOn = function (e, t, n) {
                      te(144 + (e % 16), t, n);
                  }),
                  (t.MIDIjs.midiMessage = te),
                  (t.MIDIjs.startExpander = ne),
                  (t.MIDIjs.setFreqTable = function (e) {
                      var t,
                          n = new Array(12);
                      if (Array.isArray(e))
                          if (128 == e.length) for (t = 0; t < 128; t++) E[t] = 1e3 * e[t];
                          else {
                              if (!Array.isArray(e) || 12 != e.length) return console.warn("Ignoring unknown frequency table. Must be array[12] or array[128]"), !1;
                              oe(E, e);
                          }
                      else if ("string" == typeof e) {
                          var r = e.split("-")[0],
                              o = parseInt(e.split("-")[1], 10);
                          if (((void 0 === o || isNaN(o) || o < 0 || 11 < o) && (o = 0), "detuned" == r))
                              for (t = 0; t < 128; t++) {
                                  var a = 1 + (Math.random() - 0.5) / ((1 / o) * 100);
                                  E[t] = a * Math.round(C * Math.pow(T, t - 69) * 1e3);
                              }
                          else if ("equal" == r) de(E);
                          else if ("pythagorean" == r) {
                              var i = new Array(12);
                              ae(i, 1.5), ie(n, i, o), oe(E, n);
                          } else if ("meantone" == r) {
                              var s = new Array(12);
                              ae(s, Math.pow(5, 0.25)), ie(n, s, o), oe(E, n);
                          } else if ("just" == r) {
                              s = new Array(12);
                              (s[0] = 1), (s[1] = 1.6 / 1.5), (s[2] = 9 / 8), (s[3] = 1.2), (s[4] = 5 / 4), (s[5] = 4 / 3), (s[6] = 1.40625), (s[7] = 1.5), (s[8] = 1.6), (s[9] = 5 / 3), (s[10] = 1.8), (s[11] = 15 / 8), ie(n, s, o), oe(E, n);
                          } else {
                              if ("werckmeister" != r) return console.warn("Ignoring unknown frequency table: ", e), !1;
                              r = new Array(12);
                              (r[0] = 1), (r[1] = (8 / 9) * Math.pow(2, 0.25)), (r[2] = 9 / 8), (r[3] = Math.pow(2, 0.25)), (r[4] = (8 / 9) * Math.sqrt(2)), (r[5] = (9 / 8) * Math.pow(2, 0.25)), (r[6] = Math.sqrt(2)), (r[7] = 1.5), (r[8] = 128 / 81), (r[9] = Math.pow(8, 0.25)), (r[10] = 3 / Math.pow(8, 0.25)), (r[11] = (4 / 3) * Math.sqrt(2)), ie(n, r, o), oe(E, n);
                          }
                      }
                      return se({ type: "set-freq-table", table: E }), !0;
                  }),
                  (t.MIDIjs.getFreqTable = function () {
                      return E;
                  }),
                  (t.MIDIjs.setMasterPitch = function (e) {
                      var t = new Object();
                      (t.type = "set-master-pitch"), (t.frequency = e), se(t);
                  }))
                : "WebAudioAPI" == n
                ? ((t.MIDIjs.pause = e),
                  (t.MIDIjs.resume = L),
                  (t.MIDIjs.play = function (e) {
                      (y = !1), B(), (f = 8192), H(e);
                  }),
                  (t.MIDIjs.stop = B),
                  (j = "audioMethod: WebAudioAPI, sampleRate (Hz): " + m.sampleRate + ", audioBufferSize (Byte): " + f),
                  (t.MIDIjs.noteOn = function ye(e, t, n) {
                      Y("noteOn channel: " + e + " key: " + t + " velocity: " + n + " isEndless: " + y + " song: " + I),
                          y ||
                              (B(),
                              (y = !0),
                              (f = 512),
                              H(M + "../midi/init-expander.midi?v=" + c),
                              setTimeout(function () {
                                  ye(e, t, n);
                              }, 1e3),
                              setTimeout(function () {
                                  ye(e, t, 0);
                              }, 1500)),
                          0 != I && Module.ccall("mid_song_note_on", "void", ["number", "number", "number", "number"], [I, e, t, n]);
                  }))
                : (j =
                      "bgsound" == n
                          ? ((t.MIDIjs.play = X), (t.MIDIjs.stop = J), "audioMethod: &lt;bgsound&gt;")
                          : "object" == n
                          ? ((t.MIDIjs.play = function (e) {
                                K();
                                var t = document.getElementById("scorioMIDI");
                                t ? t.lastChild.setAttribute("data", e) : ((t = document.createElement("div")).setAttribute("id", "scorioMIDI"), (t.innerHTML = '<object data="' + e + '" autostart="true" volume="0" type="audio/mid"></object>'), document.body && document.body.appendChild(t)), (d = setInterval(z, _)), (w = -1), (p = t), Y("Playing " + e + " ...");
                            }),
                            (t.MIDIjs.stop = K),
                            "audioMethod: &lt;object&gt;")
                          : ((t.MIDIjs.play = function (e) {}), (t.MIDIjs.stop = function (e) {}), "audioMethod: No method found")),
            "Microsoft Internet Explorer" == me.browserName &&
                "https:" == location.protocol.toLowerCase() &&
                setTimeout(function () {
                    X(G(M) + "../midi/silence.mid"), clearInterval(d);
                }, 1),
            (-1 == location.href.indexOf("scorio.com") && -1 == location.href.indexOf("weblily.net") && -1 == location.href.indexOf("local")) || ("WebAudioWorklet" == n && ne()),
            (t.MIDIjs.initError = null);
    } catch (ve) {
        (t.MIDIjs = new Object()), (t.MIDIjs.initError = ve);
    }
    var fe, ge, Ie, be, Me, we;
})(this);
//# sourceMappingURL=https://midijs.intern.scorio.com/lib/midi.js.map

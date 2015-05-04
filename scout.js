/** Copyright (c) 2015 Sailthru, Inc. | Custom HTTPS Scout Recommendation Version | Author: Joe Pikowski (jpikowski@sailthru.com) | Generated: Thu Apr 23 20:46:42 EDT 2015 **/
SailthruScout = {
    config: {
        numVisible: 10
    },
    allContent: [],
    visibleContent: [],
    lastIndex: -1,
    setup: function(options) {
        for (var k in options) {
            SailthruScout.config[k] = options[k]
        }
        if (options.renderItem) {
            SailthruScout.renderItem = options.renderItem
        }
        if (options.jQuery) {
            SailthruScout.jq = options.jQuery
        } else {
            if (window.jQuery) {
                SailthruScout.jq = window.jQuery
            } else {
                if (window.$) {
                    SailthruScout.jq = window.$
                }
            }
        }
        SailthruScout.fetchContent(SailthruScout.config.numVisible + 5);
        var set_scout_vars = "var index = SailthruScout.jq(this).parents('.content-item').index();var id = SailthruScout.visibleContent[index].id;var url = SailthruScout.visibleContent[index].url;";

        function mousedown_handler() {
            eval(set_scout_vars);
            SailthruScout.track(id, "mhit", {
                index: index,
                url: url
            });
            return true
        }

        function hide_handler() {
            eval(set_scout_vars);
            SailthruScout.removeContentItem(this);
            SailthruScout.track(id, "mhide", {
                index: index,
                url: url
            });
            return true
        }
        if (typeof(SailthruScout.jq().on) === "function") {
            SailthruScout.jq(document).on("mousedown", "#sailthru-scout a", mousedown_handler);
            SailthruScout.jq(document).on("click", "#sailthru-scout .hide", hide_handler)
        } else {
            SailthruScout.jq("#sailthru-scout a").live("mousedown", mousedown_handler);
            SailthruScout.jq("#sailthru-scout .hide").live("click", hide_handler)
        }
    },
    track: function(e, d, a) {
        if (window.location.protocol === "https:") {
            var f = SailthruScout.getCookie("sailthru_hid");
            var g = SailthruScout.getCookie("sailthru_bid");
            var c = "https://horizon.sailthru.com/horizon/recommendtrack?d=" + SailthruScout.config.domain + "&event=" + d
            if (f !== null) {
                c += "&hid=" + f
            }
            if (g !== null) {
                c += "&bid=" + g
            }
        } else {
            var c = "http://" + SailthruScout.config.domain + "/horizon/recommendtrack?event=" + d
        } if (e) {
            c += "&id=" + e
        }
        if (SailthruScout.method) {
            c += "&method=" + SailthruScout.method
        }
        if (SailthruScout.config.trackType) {
            c += "&type=" + encodeURIComponent(SailthruScout.config.trackType)
        }
        if (a) {
            for (var b in a) {
                c += "&" + b + "=" + encodeURIComponent(a[b])
            }
        }
        if (SailthruScout.config.useFullUrl) {
            c += "&from_url=" + encodeURIComponent(document.location)
        }
        c += "&cb=" + Math.random();
        SailthruScout.jq("body").append('<img id="st-track-px" src="' + c + '" />')
    },
    debug: function() {
        console.log("ALL CONTENT");
        for (var a = 0; a < SailthruScout.allContent.length; a++) {
            console.log(SailthruScout.allContent[a].url)
        }
        console.log("VISIBLE CONTENT");
        for (var a = 0; a < SailthruScout.visibleContent.length; a++) {
            console.log(SailthruScout.visibleContent[a].url)
        }
    },
    renderItem: function(a, b) {
        return SailthruScout.defaultItemRender(a, b)
    },
    defaultItemRender: function(b, c) {
        var a = "";
        a += '<div class="content-item">';
        a += '<div class="hide">X</div>';
        if (b.image) {
            a += '<div class="image"><a href="' + b.url + '" target="_blank"><img src="' + b.image.thumb + '" /></a></div>'
        }
        a += '<div class="title"><a href="' + b.url + '" target="_blank">' + b.title + "</a></div>";
        a += "</div>";
        return a
    },
    contentItemExists: function(b) {
        if (!b) {
            return false
        }
        for (var a = 0; a < SailthruScout.allContent.length; a++) {
            if (SailthruScout.allContent[a].url == b.url) {
                return true
            }
        }
        return false
    },
    addContentItem: function(a) {
        if (!a) {
            return false
        }
        if (SailthruScout.contentItemExists(a)) {
            return
        }
        a.index = SailthruScout.allContent.length;
        SailthruScout.allContent.push(a)
    },
    refreshVisibleItems: function() {
        if (SailthruScout.visibleContent.length < SailthruScout.config.numVisible) {
            var d = SailthruScout.lastIndex;
            SailthruScout.visibleContent = SailthruScout.visibleContent.concat(SailthruScout.allContent.slice(d + 1, d + 1 + SailthruScout.config.numVisible - SailthruScout.visibleContent.length));
            if (SailthruScout.visibleContent.length) {
                SailthruScout.lastIndex = Math.max(SailthruScout.lastIndex, SailthruScout.visibleContent[SailthruScout.visibleContent.length - 1].index)
            }
            var b = "";
            for (var a = 0; a < SailthruScout.visibleContent.length; a++) {
                var c = SailthruScout.visibleContent[a];
                b += SailthruScout.renderItem(c, a)
            }
            SailthruScout.jq("#sailthru-scout").html(b);
            SailthruScout.jq(".sailthru-scout-loaded").show()
        }
    },
    removeContentItem: function(b) {
        var a = SailthruScout.jq(b).parents(".content-item").index();
        SailthruScout.visibleContent.splice(a, 1);
        SailthruScout.jq(b).parents(".content-item").fadeOut(500, function() {
            SailthruScout.refreshVisibleItems()
        });
        if (SailthruScout.allContent.length < SailthruScout.lastIndex + 3) {
            SailthruScout.fetchContent(SailthruScout.allContent.length + 10)
        }
    },
    cookieIsEnabled: function(){
        return navigator.cookieEnabled || (Array.prototype.indexOf.call(document, "cookie") >= 0 && (document.cookie.length > 0 || (document.cookie = "test").indexOf.call(document.cookie, "test") > -1))
    },
    getCookie: function(c){
        var j, f, i, h, e;
        if (SailthruScout.cookieIsEnabled() !== true) {
            return null
        }
        i = c + "=";
        f = document.cookie.split(";");
        for (h = 0, e = f.length; h < e; h++) {
            j = f[h];
            while (j.charAt(0) === " ") {
                j = j.substring(1, j.length)
            }
            if (j.indexOf(i) === 0) {
                return j.substring(i.length, j.length)
            }
        }
        return null;
    },
    fetchContent: function(b) {
        if (window.location.protocol === "https:") {
            var c = SailthruScout.getCookie("sailthru_hid");
            var d = SailthruScout.getCookie("sailthru_bid");
            var a = "https://horizon.sailthru.com/horizon/recommend?format=jsonp&d=" + SailthruScout.config.domain + "&number=" + b + "&nospider=1"
            if (c !== null) {
                a += "&hid=" + c
            }
            if (d !== null) {
                a += "&bid=" + d
            }
        } else {
            var a = "http://" + SailthruScout.config.domain + "/horizon/recommend?format=jsonp&number=" + b + "&nospider=1"
        } if (SailthruScout.config.includeConsumed) {
            a += "&include_consumed=1"
        }
        if (SailthruScout.config.noPageview) {
            a += "&nopageview=1"
        }
        if (SailthruScout.config.useStoredTags) {
            a += "&use_stored_tags=1"
        }
        if (SailthruScout.config.filter && SailthruScout.config.filter.tags) {
            tags = SailthruScout.config.filter.tags instanceof Array ? SailthruScout.config.filter.tags.join(",") : SailthruScout.config.filter.tags;
            tags = encodeURIComponent(tags);
            a += "&filter[tags]=" + tags
        }
        if (SailthruScout.config.useFullUrl) {
            a += "&url=" + encodeURIComponent(document.location)
        }
        if (SailthruScout.config.alternateJsonpMode) {
            SailthruScout.jq("body").append('<script type="text/javascript" src="' + a + '&callback=SailthruScout.fetchContentCallback"><\/script>')
        } else {
            SailthruScout.jq.ajax({
                url: a,
                dataType: "jsonp",
                success: SailthruScout.fetchContentCallback
            })
        }
    },
    fetchContentCallback: function(b) {
        if (!SailthruScout.method && b.method) {
            SailthruScout.method = b.method;
            var c = "";
            for (var a = 0; a < b.content.length; a++) {
                c += "," + b.content[a].id
            }
            c = c.substring(1);
            SailthruScout.track(null, "mshow", {
                ids: c,
                visible: SailthruScout.config.numVisible
            })
        }
        for (var a = 0; a < b.content.length; a++) {
            SailthruScout.addContentItem(b.content[a])
        }
        SailthruScout.refreshVisibleItems()
    },
    jq: null
};
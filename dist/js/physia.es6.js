
window.P = {
    CSS: {
        TOP_INDEX: 1000
    },
    MO: []
};
class C {
    /**
    * @constructor
    */
    constructor() {

        document.documentElement.classList.remove(":loaded");
        document.addEventListener('DOMContentLoaded', function () {
            document.documentElement.classList.add(":loaded");
        });
        this.P = window.P;
    }

    static addTopZIndex(el) {
        P.CSS.TOP_INDEX++;
        el.style.setProperty("z-index", P.CSS.TOP_INDEX);
    }

    static removeZIndex(el) {
        P.CSS.TOP_INDEX++;
        el.style.removeProperty("z-index");
    }


    static addClasses(_el, _classes) {
        if (_classes instanceof Array) {
            _classes.forEach(_class => {
                _el.classList.add(_class);
            });
        } else {
            _el.classList.add(_classes);
        }
    }

    static removeClasses(_el, _classes) {
        if (_classes instanceof Array) {
            _classes.forEach(_class => {
                _el.classList.remove(_class);
            });
        } else {
            _el.classList.remove(_classes);
        }
    }
    static getAnimationDuration(_el) {
        return window.getComputedStyle(_el).animationDuration.replace("s", "") * 1000;
    }
    static getTransitionDuration(_el) {
        return window.getComputedStyle(_el).transitionDuration.replace("s", "") * 1000;
    }
    static animate(_el, _animations, _onEnd = function (e) { }, endByEvent = false) {
        if (_animations instanceof Function) {
            let _duration = C.getAnimationDuration(_el);
            return setTimeout(() => {
                _animations();
            }, _duration);
        }
        C.addClasses(_el, _animations);
        let onEnd = function (e) {
            //let isIn = _animations instanceof Array ? _animations.includes(e.animationName.replace("anm-", "")) : _animations == e.animationName;
            //if (isIn && e.target == _el) {
            C.removeClasses(_el, _animations);
            if (endByEvent) {
                _el.removeEventListener('animationend', onEnd);
            }
            _onEnd(e);
            //}
        }
        if (endByEvent) {
            _el.addEventListener('animationend', onEnd);
        } else {
            let _duration = C.getAnimationDuration(_el);
            return setTimeout(() => {
                onEnd();
            }, _duration);
        }
    }

    static moveAfter(_el, _ref) {
        _el.parentNode.insertBefore(_ref, _el.nextSibling);
    }

    static asList(_string, _split = " ") {
        return typeof _string === "string" && _string.trim() != "" ? _string.trim().replace(_split + _split, _split).split(" ") : [];
    }

}


window.C = C;

class MO {
    constructor(options) {
        this.observer = new MutationObserver(this.callback);
        this.options = options || { childList: true, subtree: true };
    }

    callback(records) {
        records.forEach(function (record) {
            var list = record.addedNodes;
            var i = list.length - 1;

            for (; i > -1; i--) {
                for (let item in MO.newList) {
                    if (MO.newList.hasOwnProperty(item) && list[i].matches(MO.newList[item])) {
                        window.W[item].class.init(list[i]);
                    }
                }
            }
        });
    }
    on() {
        this.observer.observe(document.body, { childList: true, subtree: true });
    }
    off() {
        this.observer.disconnect();
    }
}
window.MO = MO;
window.MO.newList = {};



class Physia {
    /**
    * @constructor
    */
    constructor(based) {
        this._B_ = based[0].toLocaleUpperCase();
        this._Nid_ = Date.now();
        this._name_ = this.constructor.name || this.name;
        this._id_ = this._name_ + "_" + this._Nid_;
        this._sname_ = this._name_.toLocaleLowerCase();
        this._logname_ = this._sname_;
        this._data_ = this._name_ + "_D_" + this._Nid_;
    }

    /** registe  */ // DEV...
    registe() {
        if (window[this._B_]) {
            if (window[this._B_][this._sname_]) {
                window[this._B_][this._sname_].list[this._id_] = this;
                window[this._name_] = window[this._name_] || this.constructor;
            } else {
                window[this._B_][this._sname_] = {
                    enabled: true, // In dev...
                    list: [],
                    class: this.constructor,
                };
                this.registe();
            }
        } else {
            window[this._B_] = {};
            this.registe();
        }
    }
    // DEV...
    static disable(_status = "disable") {
        if (window[this._B_]) {
            if (window[this._B_][this._name_]) {
                window[this._B_][this._name_].count = window[this._B_][this._name_].count == undefined ? 0 : window[this._B_][this._name_].count++;
                window[this._B_][this._name_].rippleCount = window[this._B_][this._name_].rippleCount == undefined ? 0 : window[this._B_][this._name_].rippleCount++;
            } else {
                window[this._B_][this._name_] = {};
                this.registe();
            }
        } else {
            window[this._B_] = {};
            this.registe();
        }
    }

    //
    by(id, b = this._B_) {
        return window[this._B_][id] || undefined;
    }


}


class Feature extends Physia {
    /**
    * @constructor
    * @param {Object} defaults
    * @param {String} setupMode
    */
    constructor(defaults, setupMode = "global") {
        super("feature");
        this.$ = defaults;

        for (const key in defaults) {
            this[key] = defaults[key]
        }

        this.actions = {};
        this.widget = null;
        this.status = null;
        this.ready = 0;
    }
    /** Update Status */
    update(newStatus) {
        this.status = newStatus;
        Object.keys(this.$el[this._sname_]).forEach(key => {
            if (this.$el[this._sname_][key] instanceof Element) {
                this.$el[this._sname_][key].setAttribute(this._sname_, this.status);
            }
        });
    }

    setup() {
        this.registe();
        if (this.actions instanceof Object) {
            this._controlBind = this._control.bind(this);
            this.widget.$el.addEventListener(this.widget._sname_ + ":update", this._controlBind);
        }
    }
    _control(e) {
        this.widget = e.detail.widget;
        this.$wEl = this.widget.$el;
        this.wElDATA = this.$wEl[this.widget._name_];
        this.config = this.wElDATA.Features[this._sname_];
        this.$el = this.wElDATA[this.config.options.el];
        this.actions = this.config.actions;

        if (!this.config.enabled) {
            return; // DEV ... إيقاف
        }

        //if (!this.$el[this._sname_]) {
        this._build();
        //}

        if (this.actions.hasOwnProperty(this.widget.status)) {
            this[this.actions[this.widget.status]]();
        }
    }
    of(el) {
        this.$el = el;
        return this;
    }
    reset() {
        this.destroy();
        this.setup();
    }
    destroy() {
        this.status = undefined;
        this.$el = undefined;
        this.$wEl.removeEventListener(this.widget._sname_ + ":update", this._controlBind);
    }

}

//
//class Physia {
//    /**
//     * Widgets constructor
//     * @constructor
//     */
//    constructor() {
//    }
//
//    /**
//     * Initializes widgets
//     * @param  widget
//     * @param {Object} settings
//     */
//}
// Feature
class Widget extends Physia {
    /**
    * @constructor
    * @param {Object} defaults
    * @param {String} setupMode
    */
    constructor(defaults, setupMode = "global") {
        super("widget");

        this._defaults = defaults;
        this._defaults.prefix = "";
        this._defaults.key = this._defaults.key || "";
        this._defaults.levels = this._defaults.levels || 1; // number: 0,1,Infinity...
        this._defaults.showId = this._defaults.showId || false;
        this._defaults.showKey = this._defaults.showKey || true;
        this._defaults.showStatus = this._defaults.showStatus || true;

        this._settings = Object.assign({}, this._defaults);
        this._features = this._settings.features || {};
        this._triggers = {};
        this._tasks = this._settings.tasks || {};

        this._event = null;
        this._events = {};
        this._customEvents = {};

        this.EL_TYPE = setupMode;

        this.$ = this._settings;

    }
    static new(_settings) {
        let $this = this;
        if (_settings.el instanceof Element || typeof _settings.el === "string") {
            let inst = new $this();
            for (let key in _settings) {
                inst.$[key] = _settings[key];
            }
            inst.setup();
            return inst;
        }
        if (_settings.el instanceof NodeList) {
            let insts = [], i = 0;
            [].forEach.call(_settings.el, function (el) {
                insts[i] = new $this();
                for (let key in _settings) {
                    insts[i].$[key] = _settings[key];
                }
                insts[i].$.el = el;
                insts[i].setup();
                i++;
            });
            return insts;
        }
    }

    /** Custom Events */
    _addCustomEvents(eventName) {
        this._customEvents[eventName] = new CustomEvent(this._sname_ + ":" + eventName, {
            detail: {
                widget: this
            }
        });
    }
    _removeCustomEvents(eventName) {
        this._customEvents[eventName] = undefined;
    }
    /** Setup */
    setup() {
        this.S = Object.assign({}, this.$);
        this._addCustomEvents("update");
        this.update("setup");
        /** init if el instanceof Element  */ // DEV...
        //if (this.S.el instanceof NodeList) {
        //    return Widget.new(this.$, Wv);
        //} else if (this.S.el instanceof Element) {
        //    this.EL_TYPE = "Element";
        //    if (this.S.el.matches(this.S.q.n)) {
        //        this.S.scope = this.S.el;
        //        this._config(this.S.el);
        //    } else {
        //        return false;
        //    }
        //}
        /** setup Widget */
        this.registe();
        /** setup all events */
        if (this._setupEvents) {
            this._setupEvents();
        }
        /** setup gBuild */
        if (this.EL_TYPE == "global" && this._setup) {
            this._setup();
        }
    }


    builder(name, force = false) {
        let elemByName = this.in("[" + this._logname_ + "--name='" + name + "']");
        if (force && elemByName) {
            elemByName.remove();
        }
        if (!elemByName) {
            elemByName = document.createElement(this.S.builder[name].tag || "div");
            elemByName.setAttribute(this._logname_ + "--name", name);

            if (this.S.builder[name].class) {
                elemByName.classList.add(...this.S.builder[name].class);
            }
            //console.log(elemByName,name);

            this.$area.append(elemByName);
        }

        return elemByName;
    }
    /** Update Status */
    update(newStatus, css = true) {
        this.status = newStatus;
        if (this.$el) {
            if (this.D) {
                this.$el[this._name_].status = newStatus;
            }
            if (!this._customEvents[newStatus]) {
                this._addCustomEvents(newStatus);
            }
            this._dispatchCustomEvent(newStatus);
            if (css) {
                this.updateStatus();
            }
        }
            try {
                document.querySelector('.btn-n[mdl-q="#picker"]').innerHTML = document.querySelector('.btn-n[mdl-q="#picker"]').Mdl.status;
                document.querySelector('.btn-n[mdl-q="#picker2"]').innerHTML = document.querySelector('.btn-n[mdl-q="#picker2"]').Mdl.status;

            } catch (error) {
                
            }
    }
    _dispatchCustomEvent(customEvent) {
        this.$el.dispatchEvent(this._customEvents['update']);
        this.$el.dispatchEvent(this._customEvents[customEvent]);
    }
    /** Update Classes */
    updateStatus() {
        this.removeUpdates();
        this.addUpdates();
    }
    addUpdates() {
        Object.keys(this.D).forEach(key => {
            if (this.D[key] instanceof Element) {
                this.D[key][this.ID] = this.$el;
                //this.D[key][this.TID] = this.$el;
                this.D[key].setAttribute(this._logname_, this.status);
                this.D[key].setAttribute(this._logname_ + "--name", key.replace("$", ""));
            }
        });
        if (this.$el.getAttribute(this._logname_ + "::" + this.status)) {
            let classList = this.$el.getAttribute(this._logname_ + "::" + this.status).trim().replace("  ", " ");
            this.$el.classList.add(...classList);
        }
        if (this.S.updates instanceof Object) {
            for (var _key in this.S.updates) {
                for (let _value in this.S.updates[_key]) {
                    if (this.status === _key && this.D[_value]) {
                        if (this.S.updates[_key][_value] instanceof Array) {
                            this.S.updates[_key][_value].forEach(_val => {
                                this.D[_value].classList.add(this.S.prefix + _val);
                            });
                        } else {
                            this.D[_value].classList.add(this.S.prefix + this.S.updates[_key][_value]);
                        }
                    }
                }
            }
        }

    }
    removeUpdates() {
        Object.keys(this.D).forEach(key => {
            if (this.D[key] instanceof Element) {
                this.D[key][this.ID] = undefined;
                this.D[key].removeAttribute(this._logname_);
                this.D[key].removeAttribute(this._logname_ + "--name");
            }
        });

        if (this.$el.getAttribute(this._logname_ + "::" + this.status)) {
            let classList = this.$el.getAttribute(this._logname_ + "::" + this.status).trim().replace("  ", " ");
            this.$el.classList.remove(...classList);
        }
        if (this.S.updates instanceof Object) {
            for (var _key in this.S.updates) {
                for (let _value in this.S.updates[_key]) {
                    if (this.status === _key && this.D[_value]) {
                        if (this.S.updates[_key][_value] instanceof Array) {
                            this.S.updates[_key][_value].forEach(_val => {
                                this.D[_value].classList.remove(this.S.prefix + _val);
                            });
                        } else {
                            this.D[_value].classList.remove(this.S.prefix + this.S.updates[_key][_value]);
                        }
                    }
                }
            }
        }
    }

    /** Features */
    _addFeatures() {
        for (let feature in this.F) {
            this.F[feature].feature.widget = this;
            this.F[feature].feature.setup();
        }
    }
    _removeFeatures() {
        for (let feature in this.F) {
            this.F[feature].feature.destroy();
        }
    }
    /** init El */
    once(e/*,matchesParents=false, willChangeElems = false*/) {
        let el = e.target || e;
        if (this._matches(el)) {
            if (el.closest("." + this._logname_ + "-skip") && el.closest(this.Q("skip")) != this._el(el)) {
                return false;
            }
            this._event = e.type ? e : false;
            this._config(this._el(el));
            //if (this.S.withTriggers && !Object.values(this._triggers).includes(el)) {
            //    let _id = Object.values(this._triggers).length + 1;
            //    this._triggers[_id];
            //    this.TID = this.ID + "," + _id;
            //}
            //if (willChangeElems) {
            //    this.removeUpdates();
            //}
            //this._setupOptions();
            return true;
        }
        return false;
    }

    init(e, action, status = false, level = this.S.levels) {
        if (this.once(e)) {
            if (action === undefined) {
                return 1;
            }
            action();
            if (this.matchesParent() && (level - 1) > 0) {
                let ev = e.target ? (Object.assign({}, e).target = this.$el.parentElement.closest(this.S.el)) : this.$el.parentElement.closest(this.S.el);
                this.init(ev, action, status, level - 1);
            }
            if (status) {
                this.update(status);
            }
        }
    }
    initFrom(el) {
        let _el = el.closest("[" + this._sname_ + "]");

        return _el ? this.once(_el[this.ID] || _el) : false;
    }
    on(status, action, options) {
        this.$el.addEventListener(this._sname_ + ":" + status, action.bind(this), options);
    }

    _elUp(el = this.$el) {
        if (el.closest(this.S.el)) {
            if (el.closest(this.S.el).matches(this.S.q.n)) {
                return el.closest(this.S.el);
            }
            //return this._elUp(el.closest(this.S.el));
        }
        return 0;
    }
    _findElUp() {
        if (this.$el.closest(this.S.el) && this.$el.closest(this.S.el).matches(this.S.q.n)) {
            return this.$el.closest(this.S.el);
        }

        return 0;
    }

    _setupOptions(data = this.S) {
        Object.keys(data).forEach(option => {
            let _val = this.$el.getAttribute(this._sname_ + ":" + option) || undefined;
            if (_val) {
                //if (_val.indexOf(".") !== -1) {
                //    console.log("IN DEV...!");
                //}
                if (typeof this.$[option] === "string") {
                    this.S[option] = _val;
                } else {
                    this.S[option] = eval(_val);
                }
            }
        });

        //let prefix = this._sname_ + ":";
        //Array.prototype.slice.call(this.$el.attributes).forEach(function (item) {
        //    if (item.name.indexOf(prefix) !== -1) {
        //        let key = item.name;//this.S.hasOwnProperty(item.name.replace(prefix,""));
        //        let path = this.S;
        //        key.split(".").forEach(item => {
        //            path = path[item];
        //        });
        //    }
        //});
        //Array.prototype.slice.call(cars).forEach(function (item) {
        //    if (item.indexOf(prefix) !== -1) {
        //        let key = item.replace(prefix, "");
        //        let path = { Volvo: "Volvo", AAA: { BBB: { CCC: "مبروك! لقد وصلت" } } };
        //        key.split(".").forEach(items => {
        //            path = path[items];
        //        });
        //        console.log(path);
        //    }
        //});


    }

    /** Matches El */
    _matches(el) {
        let _el = this._el(el);
        return (_el && _el.matches(this.S.q.n));
    }
    /** Get El */
    _el(_el) {
        if (this.S.el instanceof Element) {
            return this.S.el;
        }
        if (_el === this.S.el) {
            return this.S.el;
        }
        if (typeof _el.matches === 'function' && _el.matches(this.S.q.n) && _el.matches(this.S.el)) {
            return _el;
        }
        if (typeof _el.closest === 'function' && _el.closest(this.S.el) && _el.closest(this.S.el).matches(this.S.q.n)) {
            return _el.closest(this.S.el);
        }

        return false;
    }
    /** config el */
    _config(el) {
        if (el == this.$el) return;
        this.$el = el;

        let area = this.$el.querySelector(this.S.q.area || "." + this._sname_ + "-area");
        this.$area = area && area.closest(this.S.q.n) == this.$el ? area : this.$el;

        let areatop = this.$el.closest(this.S.q.areatop || "." + this._sname_ + "-areatop");
        this.$areatop = areatop && areatop.querySelector(this.S.q.n) == this.$el ? areatop : this.$el;

        if (!this.$el[this._name_]) {
            this.ID = this._name_.toLowerCase() + "-" + this._Nid_;
            this.KEY = "";

            if (this.S.showId) {
                this.$el.setAttribute(this._name_ + "--id", this.ID);
            }
            if (this.S.key != "") {
                this.KEY = this.S.key;
            }
            this.$el[this._name_] = this.$el[this._name_] || {};
            this.$el[this._name_].Settings = Object.assign({}, this.$);

            this._configData();

            this._build();
            this._configDataObjects();
            this._addFeatures();

        } else {
            //Object.keys(this).forEach(key => {
            //    if (this[key] instanceof Element) {
            //        //this.D[key].setAttribute(this._name_ + "--for", this.ID);
            //        this.D[key] = this[key];
            //    }
            //});
            this._configData();
            this._configDataObjects();
        }
        this.status = this.D.status || this.status;

        //this.update("config", false);
    }
    _configData() {
        this.D = this.$el[this._name_];
        this.D.$el = this.$el;
        this.D.$area = this.$area;
        this.D.$areatop = this.$areatop;
        this.D.id = this.ID;


        this.D.Features = this._features;
        this.D.Tasks = this._tasks;
        this.D.Widget = this;
        this.D.Event = this._event;

        this.F = this.D.Features;
        this.T = this.D.Tasks;
        this.W = this;
        this.S = this.D.Settings;
        this.E = this.D.Event;

        this._setupOptions();
    }
    _configDataObjects() {
        Object.keys(this.D).forEach(key => {
            if (this.D[key] instanceof Element) {
                //this.D[key].setAttribute(this._name_ + "--for", this.ID);
                this[key] = this.D[key];
                if (key !== "$el" && this.showKey && this.key !== "") {
                    this[key].setAttribute(this._logname_ + "--key", this.KEY);
                }
            }
        });
    }
    /**
     * Events
     */
    //_eventsLayer(eventFn) {
    //    return eventFn;
    //}
    _addEvents() {
        var op;
        if (this._events) {
            for (let _event in this._events) {
                if (!this._events[_event].exists) {
                    if (this._events[_event].op === undefined) {
                        op = true;
                    } else {
                        op = false;
                    }
                    //this._events[_event].el.addEventListener(_event, this._eventsLayer(this._events[_event].fn), op);
                    this._events[_event].el.addEventListener(_event, this._events[_event].fn, op);
                    this._events[_event].exists = 1;
                }
            }
        }
    }
    _removeEvents() {
        var op;
        if (this._events) {
            for (let _event in this._events) {
                if (this._events[_event].op === undefined) {
                    op = true;
                } else {
                    op = false;
                }
                //this._events[_event].el.removeEventListener(_event, this._eventsLayer(this._events[_event].fn), op);
                this._events[_event].el.removeEventListener(_event, this._events[_event].fn, op);
                this._events[_event].exists = 0;
            }
        }
    }

    _destroyEvents() {
        this._removeEvents();
        delete this._events;
    }

    /** clean widget */
    clean() {
        //    this.removeUpdates();
        //
        //    let _styleRegEx = new RegExp("^--" + this._sname_ + "--", 'i'),
        //        _attributeRegEx = new RegExp("^" + this._sname_ + "--", 'i'),
        //        _attributesList = [],
        //        _styleList = [];
        //
        //    let _temp = document.querySelectorAll(this.S.q.temp || "." + this._sname_ + "--temp");
        //    _temp.forEach(_el => {
        //        _el.remove();
        //    });
        //
        //    let _els = document.querySelectorAll("." + this._sname_);
        //    _els.forEach(_el => {
        //        delete _el[this._name_];
        //
        //        for (let _i = 0; _i < _el.attributes.length; _i++) {
        //            if (_attributeRegEx.exec(_el.attributes[_i].name)) {
        //                _attributesList.unshift(_el.attributes[_i]);
        //            }
        //        }
        //        _attributesList.forEach(_attribute => {
        //            _el.removeAttribute(_attribute.name);
        //        });
        //
        //
        //        for (let _i = 0; _i < _el.style.length; _i++) {
        //            if (_styleRegEx.exec(_el.style[_i])) {
        //                _styleList.unshift(_el.style[_i]);
        //            }
        //        }
        //        _styleList.forEach(_property => {
        //            _el.style.removeProperty(_property);
        //        });
        //    });

    }

    /** destroy widget */
    reset() {
        this.update("reset");
        this.destroy();
        this.setup();
    }
    /** destroy widget */
    destroy() {
        this.update("destroy");
        this.status = undefined;
        this.$el = undefined;
        this.$area = undefined;
        this.$areatop = undefined;
        //delete widgets[this._name_].list[this._id_];
        this._destroyEvents();
        this.clean();
    }




    // halpers
    static of (el) {
        let widget = el[this.name].Widget;
        el.click();
        //widget.init(el);
        return widget;
    }

    in(q) {
        let qEl = this.$el.querySelector(q) || undefined;
        if (qEl && qEl.closest("[" + this._logname_ + "--id]") == this.$el) {
            return qEl;
        }
        return false;
    }
    isInside(q) {
        let __el = this.$el.querySelector(q);
        return (__el.closest(this.S.q.n) && __el.closest(this.S.q.n) === this.$el) || this.$e.matches(q);
    }
    own(e, q = false) {
        let _el = q ? (e.target || e).closest(q) : (e.target || e);
        return _el && _el.closest("[" + this._logname_ + "--id]") == this.$el ? _el : undefined;
    }
    getTempChild(q, matches = null) {
        let qEl = this.$el.querySelector(q) || this.$el.closest(q);
        if (qEl && qEl.closest(matches || this.Q("n")) == this.$el) {
            return qEl;
        }
        return false;
    }

    Q(_q, _not = false) {
        var q = this.S.q[_q] || "." + this._logname_ + "-" + _q;
        return _not ? ":not(" + q + ")" : q;
    }

    matchesParent() {
        return this.$el.parentElement.closest(this.S.el);
    }

    //link(widget,options) {
    //    this._links = options;
    //    this._linkEvent = options;
    //    let link = {
    //        widget: new Ovrly(),
    //        actions: {
    //            open: "open",
    //            close: "close",
    //        },
    //        options: {
    //            el: "$modal",
    //            noscroll: 1,
    //        },
    //        events: {
    //            close: "close"
    //        },
    //        enabled: 1
    //    };
    //    
    //}


}

//  \__/ 
// (•-•)
//  ⊃🍕 

class Ovrly extends Feature {
    /**
     * @constructor 
     * @param {Object} settings 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: document.body,

        };
        super(defaults);
    }
    /** Update Status */
    _build() {
        P.CSS.TOP_INDEX++;
        if (!this.$el[this._sname_]) {
            this.$el[this._sname_] = {};
            this.$el[this._sname_].$ovrly = document.createElement("div");
            this.$el[this._sname_].$ovrly.$el = this.$el;
            this.$el[this._sname_].$ovrly.classList.add("ovrly");
            this.$el[this._sname_].$ovrly.setAttribute(this._sname_ + "-temp", "");
            this.$el.parentNode.insertBefore(this.$el[this._sname_].$ovrly, this.$el.nextSibling);
            this.clickBind = this.click.bind(this);
            this.$el[this._sname_].$ovrly.addEventListener("click", this.clickBind);
            this.ready = 1;
        }
    }
    // events 
    click(e) {
        this._build();
        this.widget.once(e.target.$el[this.widget.ID]);
        if (this.widget.status === this.config.actions.open) {
            this.widget[this.widget.F[this._sname_].events.close](e);
            this.close();
        }
    }


    // actions 
    open() {
        let $el = this.$el,
            $ovrly = this.$el[this._sname_].$ovrly;
        $ovrly.classList.add("anm");
        if (this.widget.status === this.config.actions.open) {
            this.of($el).update("open");
            C.addTopZIndex($ovrly);
            C.addTopZIndex($el);
            C.animate($ovrly, ["fd-in"]);
        }

    }
    close() {
        let $el = this.$el,
            $ovrly = this.$el[this._sname_].$ovrly;
        C.animate($ovrly, ["fd-out"], () => {
            if (this.widget.status === "end") {
                this.of($el).update("end");
                C.removeZIndex($ovrly);
                C.removeZIndex($el);
            }
        });
    }
}
class Mdl extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".mdl",
            scope: document,
            type: "mdl",
            q: {
                n: ":not(.mdl-n)",
                temp: ".mdl-temp",
                box: ".mdl-box",
                keep: ".mdl-keep",
                skip: ".mdl-skip",
                close: ".mdl-close",
                area: ".mdl-area"
            },
            autoClose: 0,
            boxed: 1,
            defaultQ: "close",// dev
            clean: true,
            mode: "normal", // dev
            content: false, // dev
            effact: false,// dev
            anims: {
                open: "scl-in",
                close: "scl-out"
            },
            features: {
                ovrly: {
                    feature: new Ovrly(),
                    actions: {
                        open: "open",
                        close: "close",
                    },
                    options: {
                        el: "$modal",
                        noscroll: 1,
                    },
                    events: {
                        close: "close"
                    },
                    enabled: 1
                }
            }
        };
        super(defaults);


    }
    /** Setup target */
    _buildStatus() { }
    _build() {
        this._logname_ = "mdl";

        if (!this.D.$modal || !this.$el.getAttribute(this.S.type + "-q")) {
            let $modal = document.querySelector(this.$el.getAttribute(this.S.type + "-q")), $box;
            $modal.classList.add("mdl");
            this.D.$modal = $modal;
            this.D.$scrlEl = document.scrollingElement;
            if (this.S.boxed) {
                this.addInBox();
            }
            this._addEvents();
            //this._buildStatus();
        }

    }
    addInBox() {
        if (!this.D.$modal.parentNode.matches(".mdl-box")) {
            this.D.$box = document.createElement("div");
            this.D.$box.classList.add("mdl-box", "b", "b-cl");
            this.D.$modal.parentNode.insertBefore(this.D.$box, this.D.$modal);
            this.D.$box.appendChild(this.D.$modal);
        } else {
            this.D.$box = this.D.$modal.closest(".mdl-box");
        }
        this.S.boxed = 1;
    }
    /**
     * setup Events
     */

    _setupEventsStatus() {
        this._events["click"] = { fn: this._toggleBind, el: this.S.scope };
        this._events["keypress"] = { fn: this._closeBind, el: window };
    }
    _setupEvents() {
        this._toggleBind = this._toggle.bind(this);
        this._events = {};
        this._setupEventsStatus();
        this._addEvents();
    }


    //
    toggle() {
        if (this.status === "close") {
            this.open();
        } else if (this.status === "open") {
            this.close();
        }
    }

    open() {
        this.update("open");
        C.addTopZIndex(this.$modal);
        if (this.$area != this.$el) {
            C.addTopZIndex(this.$area);
        }
        //(this.D.$box || this.D.$modal).style.overflow = "auto";

        C.animate(this.$modal, ["anm", this.S.anims.open]);
    }

    close() {
        this.update("close");
        C.animate(this.$modal, ["anm", this.S.anims.close], this.end.bind(this));
    }

    end() {
        if (this.status === "close") {
            this.update("end");
            C.removeZIndex(this.$modal);
            if (this.$area != this.$el) {
                C.removeZIndex(this.$area);
            }
            //(this.D.$box || this.D.$modal).style.overflow = "";
        }
    }
    /**
     * all Events
     */
    _toggle(e) {
        let $_el = this.once(e);
        if (e.target && !$_el && !(e.target.closest(".mdl") && e.target.closest(".mdl")[this.ID])) return;
        console.log(this.D.status);
        if (this.D.status !== "open") {
            this._open(e);
        } else {
            console.log("_close");
            this._close(e);
        }
    }

    _openStatus() { }
    _open(e) {
        this.open();
        this._openStatus(e);
    }

    _closeStatus() { }
    _close(e) {
        //var isOwn = this.initFrom(e.target);
        //console.log(isOwn);
        //let _trg = e.target,
        //    _trgKeep = _trg.closest(this.S.q.keep) || undefined,
        //    _trgClose = _trg.closest(this.S.q.close) || undefined,
        //    _trgMdl = _trg.closest(".mdl") || undefined,
        //    _isKeep = _trgKeep && (_trg.closest("[" + this._sname_ + "-q]") == this.$el || _trgKeep.closest(".mdl") == this.$modal),// || (_trg.closest(this.S.q.n) && _trg.closest(this.S.q.n) != this.$el),
        //    _isClose = _trgClose && _trgClose.closest(".mdl") == this.$modal,
        //    _isEl = _trgMdl && _trgMdl == this.$modal;

        //if (e.key == "Escape" || this.S.boxed && _trg.matches(this.S.q.box) && _trg.getAttribute(this.S.type + "--for") == this.ID || (_isEl || this.$.autoClose) && !_isKeep || _isClose) {
            //if (e.target && this.initFrom(e.target) && !this.init(e)) {
        if (!e.target.closest(this.S.q.keep) && e.target.closest(this.S.q.close)) {
            this.close();
            this._closeStatus(e);
        }
        //}

        //}
    }

    _endStatus() { }
    _end(e) {
        if (e.animationName === "an-sld-out" && e.target == this.$modal) {
            this.end();
            this._endStatus(e);
        }
    }
}

const mdl = new Mdl();
mdl.$.el = "[mdl-q]";
mdl.setup();


class Drp extends Mdl {
    /**
     * @constructor  
     */
    constructor() {
        super();
        this.$.type = "drp";
        this._features.ovrly.enabled = 0;
        this.$.noscroll = 0;
        this.$.boxed = 0;
        this.$.q.below = ".mdl-below";
        this.$.autoClose = 1;
    }
    _buildStatus() {
        if (!this.S.boxed) {
            this.$el.parentNode.insertBefore(this.D.$modal, this.$el.nextSibling);
        }
    }

    calc() {
        let $el = this.$el,
            $mdl = this.$modal,
            $area = this.$area,
            __rect = $area.getBoundingClientRect(),
            __t = $area.offsetTop,
            __l = $area.offsetLeft,
            __max_width,
            __max_height,
            __o,
            __top = $area.offsetTop,
            __left = $area.offsetLeft,
            isBelow = $el.matches(this.S.q.below) ? 1 : 1;


        if (this.S.boxed) {
            __top = __rect.top;
            __left = __rect.left;
        }
        if (__rect.top > (window.innerHeight / 2)) {
            __t = __top + $el.offsetHeight - $mdl.offsetHeight - ($el.offsetHeight * isBelow);
            __o = "bottom";
            __max_height = __rect.top + $el.offsetHeight - ($el.offsetHeight * isBelow);

        } else {
            __t = __top + ($el.offsetHeight * isBelow);
            __o = "top";
            __max_height = window.innerHeight - __rect.top - ($el.offsetHeight * isBelow);

        }

        if (__rect.left > (window.innerWidth / 2)) {

            __l = __left + $el.offsetWidth - $mdl.offsetWidth;
            __o += " right";
            __max_width = __rect.left + $el.offsetWidth;

        } else {
            __l = __left;
            __o += " left";
            __max_width = window.innerWidth - __rect.left;

        }


        $mdl.style.setProperty("--mdl-offset-left", __l);
        $mdl.style.setProperty("--mdl-offset-top", __t);
        $mdl.style.setProperty("--mdl-origin", __o);
        $mdl.style.setProperty("--mdl-max-width", __max_width);
        $mdl.style.setProperty("--mdl-max-height", __max_height);
        $mdl.style.setProperty("--mdl-min-width", $el.offsetWidth);
        $mdl.style.setProperty("--mdl-min-height", $el.offsetHeight);

    }

    _openStatus(e) {
        this.$el.parentNode.insertBefore(this.D.$modal, this.$el.nextSibling);
        this.calc();
    }
}

const drp = new Drp();
drp.$.el = "[drp-q]";
drp.setup();


class Pnl extends Mdl {
    /**
     * @constructor 
     */
    constructor() {
        super();
        this.$.type = "pnl";
        this._features.ovrly.enabled = 1;
    }
}

const pnl = new Pnl();
pnl.$.el = "[pnl-q]";
pnl.setup();




class Drw extends Mdl {
    /**
     * @constructor 
     */
    constructor() {
        super();
        this.$.type = "drw";
        this._features.ovrly.enabled = 1;
        this.$.boxed = 1;
    }
}

const drw = new Drw();
drw.$.el = "[drw-q]";
drw.setup();


//window.ResizeObserver = require('resize-observer-polyfill');
// يحتاج بعض التحسينات
class Sld extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** settings */
        let defaults = {
            el: ".sld",
            scope: document,
            type: "auto",
            effect: "indctrs",// padding | indctrs تحتاج عمل
            q: {
                n: ":not(.sld-n)",
                temp: ".sld-temp",
                next: "[sld-next]",
                prev: "[sld-prev]",
                go: "[sld-go]",
                area: ".sld-area",
                stp: ".sld-stp"
            },
            onlyControle : false,
            defaultInMobile: true,
            //isPrivate: false, // DEV... نسيتها
            // stepX: false, // DEV... تم استبدالها
            // stepY: false, // DEV... تم استبدالها
            //canDrag: false, // تم التخطي
        };


        super(defaults);

    }
    /** Build */
    _build() {
        if (/* this.S.effect == "indctrs" && */ !this.$el.querySelector('.sld--indctrs')) {
            let group = document.createElement("div");
            let indctrs = "<span class='sld--indctr sld--indctr-top'></span><span class='sld--indctr sld--indctr-bottom'></span><span class='sld--indctr sld--indctr-left'></span><span class='sld--indctr sld--indctr-right'></span>";
            group.classList.add("sld--indctrs", ">");
            group.innerHTML = indctrs;
            this.$area.append(group);
        }
        this.D.$indctrs = this.$el.querySelector('.sld--indctrs') || indctrs;



    }
    /**
     * add Events
     */
    _setupEvents() {
        this._startBind = this._start.bind(this);
        this._moveBind = this._move.bind(this);
        this._endBind = this._end.bind(this);
        this._resizeObserverBind = this._resizeObserver.bind(this);

        this._events = {};

        if ('ontouchstart' in window) {
            this._events["touchstart"] = { fn: this._startBind, el: this.S.scope };
            this._events["touchmove"] = { fn: this._moveBind, el: document };
            this._events["touchend"] = { fn: this._endBind, el: document };
            this._events["touchcancel"] = { fn: this._endBind, el: document };
        } else {
            this._events["mousedown"] = { fn: this._startBind, el: this.S.scope };
            this._events["mousemove"] = { fn: this._moveBind, el: document };
            this._events["mouseup"] = { fn: this._endBind, el: window };
        }

        this.RO = new ResizeObserver(this._resizeObserverBind);

        this._addEvents();

    }
    _resizeObserver(entries) {
        this.$area.style.setProperty("--sld-stp-width", entries[0].target.offsetWidth + "px");
        this.$area.style.setProperty("--sld-stp-height", entries[0].target.offsetHeight + "px");
    }
    /**
     * all Events
     */
    _start(e) {
        if (this.init(e) && !this.S.onlyControle) {
            this.update("start");
            if (this.S.resizing) {
                this.RO.disconnect();
            }
            this.updateIndctr(this.$el);
            this._control(e);
            this.__log = {
                cx: (e.clientX || (e.touches ? e.touches[0].clientX : 0)),
                cy: (e.clientY || (e.touches ? e.touches[0].clientY : 0)),
                sx: this.$area.scrollLeft,
                sy: this.$area.scrollTop,
                sw: this.$area.scrollWidth,
                sh: this.$area.scrollHeight,
                maxx: (this.$area.scrollWidth - this.$area.offsetWidth) || 100,
                maxy: (this.$area.scrollHeight - this.$area.offsetHeight) || 100,
                dx: 0,
                dy: 0,
                speed:0, // dev...
            };
            //this.$stp = this.own(e,this.S.q.stp); 
            this.$stp = e.target.closest(this.S.q.stp);
        }
    }
    _move(e) {
        if (this.$el && (this.status === "start" || this.status === "move")) {

            if (this.S.type === "x" || this.S.type === "auto") {
                this._scroll(e, "x");
            }
            if (this.S.type === "y" || this.S.type === "auto") {
                this._scroll(e, "y");
            }
            this.__log.ex = this.$area.scrollLeft;
            this.__log.ey = this.$area.scrollTop;
            this.update("move");
        }
    }
    _scroll(e, type) {
        let clientXY = "client" + type.toLocaleUpperCase(),
            scrollWH = type == "x" ? "scrollWidth" : "scrollHeight",
            clientWH = type == "x" ? "offsetWidth" : "offsetHeight",
            scrollLT = type == "x" ? "scrollLeft" : "scrollTop";

        this.__log._min = this.$area[scrollLT] + this.__log["s" + type] + this.__log["c" + type] - (e[clientXY] || (e.touches ? e.touches[0][clientXY] : 0));

        if ((this.$area[scrollWH] - this.$area[clientWH]) > 5) {
            if ('ontouchstart' in window && this.S.defaultInMobile) {
                this.$area.classList.add("-ovr-a");
            } else {
                this.$area[scrollLT] = this.__log["s" + type] + (this.__log["c" + type] - (e[clientXY] || (e.touches ? e.touches[0][clientXY] : 0)));
            }
            if (this.$area[scrollLT] + this.__log["s" + type] + this.__log["c" + type] - (e[clientXY] || (e.touches ? e.touches[0][clientXY] : 0)) > 0) {
                this.$el.style.setProperty("--sld-" + (type === "x" ? "right" : "bottom"), Math.min(114, this.__log.maxy, this.__log._min));
                this.$el.style.setProperty("--sld-" + (type === "x" ? "left" : "top"), 0);

            } else {
                this.$el.style.setProperty("--sld-" + (type === "x" ? "left" : "top"), Math.min(114, this.__log.maxy, -(this.__log._min)));
                this.$el.style.setProperty("--sld-" + (type === "x" ? "right" : "bottom"), 0);
            }
        }
    }
    _control(e) {
        if (e.target.closest("[sld-next-x]")) {
            this.next(e.target.closest("[sld-next-x]").getAttribute("sld-next-x") || this.$area.offsetWidth, 0);
        }
        if (e.target.closest("[sld-next-y]")) {
            this.next(0, e.target.closest("[sld-next-y]").getAttribute("sld-next-y") || this.$area.offsetHeight);
        }
        if (e.target.closest("[sld-prev-x]")) {
            this.prev(e.target.closest("[sld-prev-x]").getAttribute("sld-prev-x") || this.$area.offsetWidth, 0);
        }
        if (e.target.closest("[sld-prev-y]")) {
            this.prev(0, e.target.closest("[sld-prev-y]").getAttribute("sld-prev-y") || this.$area.offsetHeight);
        }
    }
    _end(e) {
        if (this.status === "start" || this.status === "move") {
            this.update("end");
            if (this.$stp) {
                this._endStp(this.$area.scrollLeft);
            }
        }
    }
    _endStp(_scrollLeft) {
        setTimeout(() => {
            if (this.$area.scrollLeft != _scrollLeft) {
                return this._endStp(this.$area.scrollLeft);
            }
            let P = window.getComputedStyle(this.$area).direction === "rtl" ? "nextElementSibling" : "previousElementSibling",
                N = window.getComputedStyle(this.$area).direction === "rtl" ? "previousElementSibling" : "nextElementSibling",
                x_nextOrPrev = this.__log.sx - this.$area.scrollLeft > 0 ? P : N,
                y_nextOrPrev = this.__log.sy - this.$area.scrollTop > 0 ? "previousElementSibling" : "nextElementSibling",
                _stp = this.$stp;


            if ((this.$area.scrollWidth - this.$area.offsetWidth) && this.S.type === "x" || this.S.type === "auto") {
                _stp = this.getStopStp(this.$stp, this.__log.sx - this.$area.scrollLeft, x_nextOrPrev, "x");
            }

            this.select(_stp);

            // dev.........
            C.animate(this.$indctrs, this._hideIndctrs.bind(this));
        }, 200);
    }
    _hideIndctrs() {
        if (this.status === "end") {
            this.$indctrs.classList.add("-d-n");
        }
    }

    /** control  */
    next(x = this.$area.offsetWidth, y = this.$area.offsetHeight) {
        this.go({ x: x, y: y }, {
            fromX: this.$area.scrollLeft,
            fromY: this.$area.scrollTop
        });
    }
    prev(x = this.$area.offsetWidth, y = this.$area.offsetHeight) {
        this.go({ x: x, y: y }, {
            fromX: this.$area.scrollLeft,
            fromY: this.$area.scrollTop,
            rX: -1,
            rY: -1,
        });
    }
    go(to, _options = {}) {
        let options = _options,
            dir = window.getComputedStyle(this.$area, null).getPropertyValue("direction") === "rtl" ? -1 : 1,
            _top = 0,
            _left = 0,
            _toX = (to.x || to),
            _toY = (to.y || to);
        options.behavior = options.behavior || 'smooth';
        options.fromX = options.fromX || 0;
        options.fromY = options.fromY || 0;
        options.rX = options.rX || 1;
        options.rY = options.rY || 1;
        options.type = options.type || this.S.type;
        if (_toX && typeof _toX === 'string' && _toX.indexOf("%") !== -1) {
            _toX = -(this.$area.scrollWidth - this.$area.offsetWidth) / 100 * Number(_toX.replace("%", ""));
        }
        if (_toY && typeof _toY === 'string' && _toY.indexOf("%") !== -1) {
            _toY = -(this.$area.scrollHeight - this.$area.offsetHeight) / 100 * Number(_toY.replace("%", ""));
        }

        this.$area.scrollTo({
            top: (_toY + options.fromY) * options.rY,
            left: (_toX * dir + options.fromX) * options.rX,
            behavior: options.behavior
        });
    }
    updateIndctr(_el) {
        let _area = _el[this._name_].$area;
        _el.style.setProperty("--sld-width", _area.offsetWidth);
        _el.style.setProperty("--sld-height", _area.offsetHeight);
        _el.style.setProperty("--sld-scroll-width", _area.scrollWidth);
        _el.style.setProperty("--sld-scroll-height", _area.scrollHeight);
        _el.style.setProperty("--sld-scroll-x", _area.scrollWidth - _area.offsetWidth + _area.scrollLeft);
        _el.style.setProperty("--sld-scroll-y", _area.scrollHeight - _area.offsetHeight + _area.scrollTop);
        this.$indctrs.classList.remove("-d-n");
    }
    getStopStp(_stp, _pos, _np, _xy) {
        let offsetWH = _xy === "x" ? "offsetWidth" : "offsetHeight";
        if (Math.abs(_pos) > _stp[offsetWH] * 1.4 && _stp[_np]) {
            return this.getStopStp(_stp[_np], Math.abs(_pos) - _stp[offsetWH], _np, _xy);
        } else {
            if (_stp[_np] && Math.abs(_pos) > _stp[_np][offsetWH] * 0.45) {
                return _stp[_np];
            } else {
                return _stp;
            }
        }
    }
    select(_el, _axis = this.S.type) {
        let dir = window.getComputedStyle(this.$area).direction === "rtl" ? -1 : 1;

        if (_el instanceof String) {
            _el = this.$el.querySelector(_el);
        }
        this.$area.scroll({
            top: (_axis === "y" || _axis === "auto") ? _el.offsetTop : this.$area.scrollTop,
            left: (_axis === "x" || _axis === "auto") ? _el.offsetLeft * dir : this.$area.scrollLeft * dir,
            behavior: 'smooth'
        });
        this.$stp = _el;
        if (this.S.resizing) {
            this.RO.observe(this.$stp);
        }
    }
}

window.sld = new Sld();
sld.setup();




class Wv extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".btn,.wv",
            scope: document,
            overflow: "hidden",
            q: {
                n: ":not(.wv-n)",
                temp: ".wv-temp",
                circle: ".wv-c",
                area: ".wv-area",
                fld: ".wv-fld",
                ripples: ".wv-ripples",
                ripple: ".wv-ripple",
            },
            clean: true,// dev
            mode: "normal", // dev
            content: false, // dev
        };
        super(defaults);


    }
    /** Setup target */
    _build() {
        let $ripples = this.getTempChild(this.Q("ripples"));
        if (!$ripples) {
            this.D.$ripples = this.$area.querySelector(this.Q("ripples")) || document.createElement("div");
            this.D.$ripples.classList.add("wv--ripples", "wv-temp", "-o-h", "u-f", "abs", ".r", ".t", "-r-i", "-pe-n");
            this.$area.prepend(this.D.$ripples);
        }

    }
    /**
     * setup Events
     */
    _setupEvents() {
        this._startEventBind = this._startEvent.bind(this);
        this._endEventBind = this._endEvent.bind(this);

        if ('ontouchstart' in window) {
            this._events["touchstart"] = { fn: this._startEventBind, el: this.S.scope };
            this._events["touchend"] = { fn: this._endEventBind, el: this.S.scope };
            this._events["touchcancel"] = { fn: this._endEventBind, el: document };
        } else {
            this._events["mousedown"] = { fn: this._startEventBind, el: this.S.scope };
            this._events["dragend"] = { fn: this._endEventBind, el: document };
            this._events["mouseup"] = { fn: this._endEventBind, el: document };
        }
        this._events["blur"] = { fn: this._endEventBind, el: document };

        this._addEvents();

    }
    /**
     * all Events
     */
    _startEvent(e) {
        this.init(e, () => {
            let $ripples = this.D.$ripples,
                $ripple = this.D.$ripple = document.createElement("span"),
                _areaRect = this.$area.getBoundingClientRect(),
                _clientX = (e.clientX || e.touches[0].clientX),
                _clientY = (e.clientY || e.touches[0].clientY);

            $ripple.classList.add("wv--ripple", "anm");
            $ripple.style.setProperty("--wv-diameter",
                Math.sqrt(
                    Math.pow(
                        Math.max(
                            _clientX - _areaRect.left, _areaRect.width - (_clientX - _areaRect.left)
                        ), 2
                    ) +
                    Math.pow(
                        Math.max(
                            _clientY - _areaRect.top, _areaRect.height - (_clientY - _areaRect.top)
                        ), 2
                    )
                ) * 2
            );

            $ripple.style.setProperty("--wv-x", _clientX - _areaRect.x);
            $ripple.style.setProperty("--wv-y", _clientY - _areaRect.y);

            $ripples.appendChild($ripple);

            C.animate($ripple, ["wv--ripple-in"], () => {
                if (this.status === "end") {
                    C.animate($ripple, ["wv--ripple-out"], () => {
                        $ripple.remove();
                    }, 0);
                } else {
                    this.on("end", () => {
                        C.animate($ripple, ["wv--ripple-out"], () => {
                            $ripple.remove();
                        }, 0);
                    }, { once: true });
                }
            },0);
        }, "start");
    }
    _endEvent(e) {
        this.update("end");
    }

}

Wv.new({ el: ".unt,.wv" });



class Fld extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el                  : ".fld",
            scope               : document,
            type                : "auto",
            overlay             : 0,
            q                   : {
                n       : ".fld:not(.fld-n)",
                box     : ".fld-box",
                temp    : ".fld-temp",
                keep    : ".fld-keep",
                focus   : ".fld-focus",
                blur    : ".fld-blur",
                change  : ".fld-change",
                reset   : ".fld-reset",
                area    : ".fld-area",
                overlay : ".fld-overlay"
            },
            clean               : true,
            mode                : "normal", // dev
            content             : false, // dev
        };
        super(defaults);


    }
    /** Setup target */
    _build() {
        this._events["transitionend"] = { fn: this._endBind, el: this.$area };
        this._addEvents();
        if (this.S.overlay) {
            this.setupOverlay(this.$el);
        }
    }
    /**
     * setup Events
     */
    _setupEvents() {
        this._focusBind                     = this._focus.bind(this);
        this._blurBind                      = this._blur.bind(this);
        this._changeBind                    = this._change.bind(this);
        this._endBind                       = this._end.bind(this);

        this._events                        = {};
        this._events["focus"]               = { fn: this._focusBind,  el: this.S.scope};
        this._events["blur"]                = { fn: this._blurBind ,  el: this.S.scope };
        this._events["change"]              = { fn: this._changeBind,el: this.S.scope };
        
        this._addEvents();

    } 
    /**
     * all Events
     */

    focus() {
        this.update("focus");
        //setTimeout(() => {
        //    this.$area.focus();
        //}, 0);
    }
    blur() {
        this.update("blur");
        //setTimeout(() => {
        //    this.$area.blur();
        //}, 0);
    }
    change() {
        this.update("change");
    }
    end() {
        this.update("end");
    }

    _focus(e) {
        if (this.status !== "focus" && this.init(e)) {
            this.focus();
        }
    }
    _blur(e) {
        if (this.init(e)) {
            if (this.status !== "blur" && (e.explicitOriginalTarget.closest && e.explicitOriginalTarget.closest(this.S.q.blur) || !this.$el.contains(e.explicitOriginalTarget))) {
                this.blur();
            } else {
                this.focus();
            }
        }

    }
    _change(e) {
        if (this.status !== "change" && this.init(e)) {
            this.change();
        }
    }
    _end(e) {
        if (this.status === "blur" && e.propertyName === "color") {
            this.end();
        }
    }
}
const fld = new Fld();
fld.$.el = ".fld";
//fld.$.el = document.querySelector('[fld-q="#fld"]');
fld.setup();

//const Fld0 = new Fld();
//Fld0.$.el = document.querySelector("#fld");
//Fld0.setup();



class Tbs extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".tbs",
            scope               : document,
            q                   : {
                n               : ".tbs:not(.tbs-n)",
                temp            : ".tbs-temp",
                area            : ".tbs-area",
            },
            mode                : "x",
            scrollable          : false,
            sdl: {
                resizing: false,
            },
            builder: {
                indctrs: {
                    pos: "beforeend",
                    class: ["r", "-rm"],
                    tag: "div",
                },
                indctr: {
                    pos: "beforeend",
                    tag: "div",
                    class:[">"],
                }
            }
        };
        super(defaults);


    }
    /** Setup target */
    _build() {
        this.D.$indctrs = this.builder("indctrs");
        this.D.$indctr  = this.builder("indctr");
        this.D.$indctrs.append(this.D.$indctr);
    }
    initEvent(e) {
        if (e.animationName === "anm-init" && !e.target[this._data_] && e.target.matches(this.S.el)) {
            let trgr = e.target.querySelector("[tb-q].tbs-active") || e.target.querySelector("[tb-q]");
            this.select(trgr);
        }
    }

    /**
     * setup Events
     */
    _setupEvents() {
        this._selectBind            = this._select.bind(this);
        this._resizeBind            = this._resize.bind(this);
        this.initEventBind         = this.initEvent.bind(this);

        this._events["click"]       = { fn: this._selectBind, el: this.S.scope };
        this._events["resize"]      = { fn: this._resizeBind, el: window };
        if (this.EL_TYPE === "global") {
            this._events["animationstart"] = { fn: this.initEventBind, el: this.S.scope };
        }

        this._addEvents();

    } 



    /**
     * all Events
     */
    _select(e) {
        this.select(e.target.closest("[tb-q]"));
    }
    _resize() {
        this.D.$activeTbTrgr.click();
    }
    calc($tb_trgr, $el, $indctr, $activeTbTrgr = null, $tb) {
        if ($activeTbTrgr && $tb_trgr.offsetLeft < $activeTbTrgr.offsetLeft) {
            $el.classList.remove("tbs--ltr");
            $el.classList.add("tbs--rtl");
        } else {
            $el.classList.add("tbs--ltr");
            $el.classList.remove("tbs--rtl");
        }
        if ($activeTbTrgr && $tb_trgr.offsetTop < $activeTbTrgr.offsetTop) {
            $el.classList.remove("tbs--ttb");
            $el.classList.add("tbs--btt");
        } else {
            $el.classList.add("tbs--ttb");
            $el.classList.remove("tbs--btt");
        }


        if (this.S.mode == "x" || this.S.mode == "xy") {
            $indctr.style.setProperty("--tbs-indc-right", $tb_trgr.offsetParent.offsetWidth - $tb_trgr.offsetLeft - $tb_trgr.clientWidth);
            $indctr.style.setProperty("--tbs-indc-left", $tb_trgr.offsetLeft);
        }
        if (this.S.mode == "y" || this.S.mode == "xy") {
            $indctr.style.setProperty("--tbs-indc-bottom", $tb_trgr.offsetParent.offsetHeight - $tb_trgr.offsetTop - $tb_trgr.clientHeight);
            $indctr.style.setProperty("--tbs-indc-top", $tb_trgr.offsetTop);
        }

        let $indctrs = $indctr.parentElement;
        $indctrs.style.width = $tb_trgr.offsetParent.offsetWidth + "px";
        $indctrs.style.height = $tb_trgr.offsetParent.offsetHeight + "px";

        $indctr.style.backgroundColor = window.getComputedStyle($tb_trgr, null).getPropertyValue("color");
        setTimeout(() => {
            $indctr.style.backgroundColor = window.getComputedStyle($tb_trgr, null).getPropertyValue("color");
        }, 200);

    }
    select(q) {
        let $tb_trgr = q instanceof Element ? q : this.S.scope.querySelector("[tb-q='" + q + "']");
        if ($tb_trgr && this.init($tb_trgr)) {
            let $tb,
                $activeTb = this.D.$activeTb || 0,
                $activeTbTrgr = this.D.$activeTbTrgr || 0,
                $indctr = this.D.$indctr,
                $el = this.$el,
                hasTrgt = $tb_trgr.getAttribute("tb-q") && $tb_trgr.getAttribute("tb-q") != "" && document.querySelector($tb_trgr.getAttribute("tb-q"));


            if (this.D.$activeTbTrgr) {
                this.D.$activeTbTrgr.classList.remove("tbs-trgr-active");
            }
            this.D.$activeTbTrgr = $tb_trgr;
            this.D.$activeTbTrgr.classList.add("tbs-trgr-active");

            if (this.D.$activeTb) {
                this.D.$activeTb.classList.remove("tbs-active");
            }

            if (hasTrgt) {
                $tb = document.querySelector($tb_trgr.getAttribute("tb-q"));
                this.D.$activeTb = $tb;
                $tb.classList.add("tbs-active");
            }

            this.calc($tb_trgr, $el, $indctr, $activeTbTrgr);
            
            if (this.D.$activeTb) {
                //this.D.$activeTb.scrollIntoView({ behavior: "smooth", block: "nearest" });
                this.D.$activeTb.parentElement.scroll({
                    top: (this.S.mode === "y" || this.S.mode === "auto") ? this.D.$activeTb.offsetTop : this.D.$activeTb.parentElement.scrollTop,
                    left: (this.S.mode === "x" || this.S.mode === "auto") ? this.D.$activeTb.offsetLeft : this.D.$activeTb.parentElement.scrollLeft,
                    behavior: 'smooth'
                });
            }

            //if (this.D.$activeTb.closest(".sld")) {
            //    window.sld.init(this.D.$activeTb);
            //    window.sld.select(this.D.$activeTb);
            //    window.sld.$el.Sld.Widget.S.onlyControle = true;
//
            //}
            this.update("select");
        }
    }
}

window.tbs = Tbs.new({ el: ".tbs"});




class Frms extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".frms",
            scope               : document,
            q                   : {
                n               : ".frms:not(.frms-n)",
                temp            : ".frms-temp",
                area            : ".frms-area",
            },
            updates: {
                select: { $frm: "frms--active", $prev: "frms--prev",},
            },
        };
        super(defaults);
    }
    /** Setup target */
    _build() {
        let _frm = this.D.$el.querySelector(".frm");
        this.D.$frm = _frm;
        this.D.$prev = _frm;
    }

    /**
     * setup Events
     */
    _setupEvents() {
        this._selectEventBind = this._select.bind(this);

        this._events                = this._events || {};
        if (this.EL_TYPE === "global") {
            this._events["animationstart"] = { fn: this._selectEventBind, el: this.S.scope };
        }

        P.MO.unshift({
            w: this,
            q: ".frms",
            d: ".frm",
            a: "resize"
        });
        window.addEventListener('DOMContentLoaded', (event) => {
            new MutationObserver(this._detectChanges.bind(this)).observe(document.body, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        });

        this._addEvents();

    } 



    /**
     * all Events
     */
    _detectChanges(mutations, observer) {
        let mutation = mutations[0];
        if (mutation.target.matches(".frm")) {
            this.init(mutation.target.closest(".frms"));
            this.$frm = mutation.target;
            this.resize();
        }
    }
    resize(e) {
        this.update("resize");
        let _el = this.$el,
            _area = this.$area,
            _frm = this.$frm;

        _el.style.setProperty("--bxd-width", _area.offsetWidth + "px");
        _el.style.setProperty("--bxd-height", _area.offsetHeight + "px");
        _el.style.setProperty("--bxd-width", _frm.offsetWidth + "px");
        _el.style.setProperty("--bxd-height", _frm.offsetHeight + "px");

        setTimeout(() => {
        //    this.release(_el);
        }, (window.getComputedStyle(this.$el).transitionDuration.replace("s", "")) * 1000);

    }
    release(_el) {
        _el.style.removeProperty("--bxd-width");
        _el.style.removeProperty("--bxd-height");
        _el.style.removeProperty("--bxd-width");
        _el.style.removeProperty("--bxd-height");
        this.update("release");
    }

    _select(e) {
        if (e.animationName === "an-frms-select") {
            if (e.target.closest(".frms") == this.$el) {
                //this.select(e.target);
            }
            this.select(e.target);

        }
    }

    select(q) {
        let $frm = q instanceof Element ? q : this.S.scope.querySelector(q),
            $frms = q.closest(".frms") || undefined;
        if ($frm && this.init($frms,true)) {
            if ($frm != this.$frm) {
                this.D.$prev = this.$frm;
            }
            this.D.$frm = $frm;
            this.update("select");
        }
    }


}

const frms = Frms.new({ el: ".frms"});




class Hlp extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** settings */
        let defaults = {
            el: ".hlp",
            scope: document,
            q: {
                n: ".hlp:not(.hlp-n)",
                area: ".hlp-area",
            },
            all: true,
            use: "f h a",
            actions: {
                f: { // focus 
                    in: "focus",
                    out: "blur",
                    fn: "indicator"
                },
                h: { // hover 
                    in: "mousemove",
                    out: "mouseout",
                    fn: "indicator"
                },
                a: { // active
                    in: 'ontouchstart' in window ? "touchstart" : "mousedown",
                    out: 'ontouchstart' in window ? "touchend" : "mouseup",
                    fn: "indicator"
                },
                //toggle: true,
            }
        };
        super(defaults);
    }
    /** Build */
    _build() {

    }

    /**
     * add Events
     */
    // _dynamicSetupEvents() beta!!

    initEvent(e) {
        if (e.animationName === "anm-init" && this.init(e)) {
            this.updateActions();
        }
    }
    _setupEvents() {
        this.initEventBind = this.initEvent.bind(this);
        if (this.EL_TYPE === "global") {
            this._events["animationstart"] = { fn: this.initEventBind, el: this.S.scope };
        }
        this._addEvents();
    }

    /**
     * all Events
     */
    _handleEvent(action, isIn, e, elUp = null) {
        if (this.init(elUp || e)) {
            this.updateActions();
            this.updateClass(action, isIn, e);
            this.update("handle" + (isIn?"in":"out"));
            if (this.$el.parentElement.closest(this.S.el) && this.$el.parentElement.closest(this.S.el) != this.$el && this.S.all) {
                this._handleEvent(action, isIn, e, this.$el.parentElement.closest(this.S.el));
            }
        }
    }

    updateActions() {
        let actions = C.asList(this.S.use);

        actions.forEach(action => {
            if (this.S.actions[action]) {
                if (!this._events[this.S.actions[action].in]) {
                    this._events[this.S.actions[action].in] = { fn: this._handleEvent.bind(this, action, true), el: this.S.scope };
                    this._events[this.S.actions[action].out] = { fn: this._handleEvent.bind(this, action, false), el: this.S.scope };
                }
            } else {
                if (!this._events[action]) {
                    this._events[action] = { fn: this._handleEvent.bind(this, action, true), el: this.S.scope };
                }
            }
            this._addEvents();
        });
    }

    updateClass(action, isIn, e) {
        let classList = C.asList(this.$el.getAttribute(action + ":class"));
        if (classList.length) {
            this.D.cssUsedClasses = this.D.cssUsedClasses || {};
            classList.forEach(classItem => {
                this.D.cssUsedClasses[classItem] = this.D.cssUsedClasses[classItem] || {};
                if (isIn) {
                    this.$el.classList.add(classItem);
                    this.D.cssUsedClasses[classItem][action] = 1;
                } else {
                    this.D.cssUsedClasses[classItem][action] = 0;
                    if (Object.values(this.D.cssUsedClasses[classItem]).reduce((a, b) => a + b) == 0) {
                        this.$el.classList.remove(classItem);
                    }
                }
            });
        }

        if (C.asList(this.S.use).includes(action) && this.S.actions[action] && this.S.actions[action].fn) {
            if (this.$area != this.$el) {
                this[this.S.actions[action].fn](e, "area", action, isIn);
            }
            if (this.$areatop != this.$el) {
                this[this.S.actions[action].fn](e, "areatop", action, isIn);
            }
            this[this.S.actions[action].fn](e, "el", action, isIn);
        }

    }

    indicator(e, elName, action, isIn) {
        let _width = this["$" + elName].offsetWidth,
            __inOrOut = isIn?"in":"out",
            _height = this["$" + elName].offsetHeight,
            _top = this["$" + elName].offsetTop,
            _left = this["$" + elName].offsetLeft,
            _x = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX ? e.touches[0].clientX : 0)) + document.body.scrollLeft + document.documentElement.scrollLeft,
            _y = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY ? e.touches[0].clientY : 0)) + document.body.scrollTop + document.documentElement.scrollTop;
        let data = {
            width: _width,
            height: _height,
            top: _top,
            left: _left,
            x: _x,
            y: _y,
        };
        let key = "";
        if (this.S.key && this.S.key != "") {
            key = this.S.key + "-";
        }
        for (let item in data) {
            this["$" + elName].style.setProperty("--hlp-" + key + elName + "-" + action + "-" + __inOrOut + "-" + item, data[item]);
        }
        this["$" + elName].style.setProperty("--hlp-" + key + elName + "-" + action + "-is", isIn ? 1 : 0);

    }
}

const hlp = new Hlp();
hlp.setup();
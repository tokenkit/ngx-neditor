(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@notadd/ngx-neditor', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/forms', '@angular/common'], factory) :
    (factory((global.notadd = global.notadd || {}, global.notadd['ngx-neditor'] = {}),global.ng.core,global.rxjs,global.rxjs.operators,global.ng.forms,global.ng.common));
}(this, (function (exports,core,rxjs,operators,forms,common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var ScriptStore = [
        { name: 'config', src: './assets/node_modules/@notadd/neditor/neditor.config.js', loaded: false },
        { name: 'neditor', src: './assets/node_modules/@notadd/neditor/neditor.all.min.js', loaded: false },
        { name: 'jquery', src: './assets/node_modules/@notadd/neditor/third-party/jquery-1.10.2.min.js', loaded: false },
        { name: 'service', src: './assets/node_modules/@notadd/neditor/neditor.service.js', loaded: false },
    ];

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ScriptLoaderService = (function () {
        function ScriptLoaderService() {
            this.loaded = false;
            this.emitter = new rxjs.Subject();
            this.scripts = ScriptStore;
        }
        /**
         * @return {?}
         */
        ScriptLoaderService.prototype.getChangeEmitter = /**
         * @return {?}
         */
            function () {
                return this.emitter.asObservable();
            };
        /**
         * @return {?}
         */
        ScriptLoaderService.prototype.load = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.loaded) {
                    return this;
                }
                this.loaded = true;
                /** @type {?} */
                var observables = [];
                this.scripts.forEach(function (script) { return observables.push(_this.loadScript(script)); });
                rxjs.of.apply(void 0, __spread(observables)).pipe(operators.concatAll()).subscribe({
                    complete: function () {
                        _this.emitter.next(true);
                    }
                });
                return this;
            };
        /**
         * @param {?} script
         * @return {?}
         */
        ScriptLoaderService.prototype.loadScript = /**
         * @param {?} script
         * @return {?}
         */
            function (script) {
                var _this = this;
                return new rxjs.Observable(function (observer) {
                    /** @type {?} */
                    var existingScript = _this.scripts.find(function (s) { return s.name === script.name; });
                    // Complete if already loaded
                    if (existingScript && existingScript.loaded) {
                        observer.next(existingScript);
                        observer.complete();
                    }
                    else {
                        /** @type {?} */
                        var scriptElement = document.createElement('script');
                        scriptElement.type = 'text/javascript';
                        scriptElement.src = script.src;
                        scriptElement.onload = function () {
                            script.loaded = true;
                            observer.next(script);
                            observer.complete();
                        };
                        scriptElement.onerror = function (error) {
                            observer.error('Couldn\'t load script ' + script.src);
                        };
                        document.getElementsByTagName('body')[0].appendChild(scriptElement);
                    }
                });
            };
        ScriptLoaderService.decorators = [
            { type: core.Injectable },
        ];
        return ScriptLoaderService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NeditorConfig = (function () {
        function NeditorConfig() {
            /**
             * Ueditor [前端配置项](http://fex.baidu.com/ueditor/#start-config)
             */
            this.options = {
                UEDITOR_HOME_URL: './assets/node_modules/@notadd/neditor/'
            };
        }
        return NeditorConfig;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var _hook_finished = false;
    var NgxNeditorComponent = (function () {
        function NgxNeditorComponent(sl, el, neConfig, cd, zone) {
            this.sl = sl;
            this.el = el;
            this.neConfig = neConfig;
            this.cd = cd;
            this.zone = zone;
            this.inited = false;
            this.events = {};
            this._disabled = false;
            this.onTouched = function () {
            };
            this.onChange = function () {
            };
            this.ngUnsubscribe = new rxjs.Subject();
            this.loading = true;
            this.id = "_neditor-" + Math.random()
                .toString(36)
                .substring(2);
            this.loadingTip = '加载中...';
            /**
             * 延迟初始化
             */
            this.delay = 50;
            this.neOnPreReady = new core.EventEmitter();
            this.neOnReady = new core.EventEmitter();
            this.neOnDestroy = new core.EventEmitter();
        }
        Object.defineProperty(NgxNeditorComponent.prototype, "disabled", {
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._disabled = value;
                this.setDisabled();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        NgxNeditorComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.inited = true;
            };
        /**
         * @return {?}
         */
        NgxNeditorComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // 已经存在对象无须进入懒加载模式
                if (window.UE) {
                    this.initDelay();
                    return;
                }
                this.sl.load()
                    .getChangeEmitter()
                    .pipe(operators.takeUntil(this.ngUnsubscribe))
                    .subscribe(function (res) {
                    _this.initDelay();
                });
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        NgxNeditorComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (this.inited && changes["config"]) {
                    this.destroy();
                    this.initDelay();
                }
            };
        /**
         * @return {?}
         */
        NgxNeditorComponent.prototype.initDelay = /**
         * @return {?}
         */
            function () {
                var _this = this;
                setTimeout(function () { return _this.init(); }, this.delay);
            };
        /**
         * @return {?}
         */
        NgxNeditorComponent.prototype.init = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (!window.UE) {
                    throw new Error('neditor js文件加载失败');
                }
                if (this.instance) {
                    return;
                }
                // registrer hook
                if (this.neConfig.hook && !_hook_finished) {
                    _hook_finished = true;
                    this.neConfig.hook(UE);
                }
                this.neOnPreReady.emit(this);
                /** @type {?} */
                var opt = Object.assign({}, this.neConfig.options, this.config);
                this.zone.runOutsideAngular(function () {
                    /** @type {?} */
                    var ueditor = UE.getEditor(_this.id, opt);
                    ueditor.ready(function () {
                        _this.instance = ueditor;
                        if (_this.value) {
                            _this.instance.setContent(_this.value);
                        }
                        _this.neOnReady.emit(_this);
                    });
                    ueditor.addListener('contentChange', function () {
                        _this.value = ueditor.getContent();
                        _this.zone.run(function () { return _this.onChange(_this.value); });
                    });
                });
                this.loading = false;
                this.cd.detectChanges();
            };
        /**
         * @return {?}
         */
        NgxNeditorComponent.prototype.destroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.instance) {
                    this.zone.runOutsideAngular(function () {
                        if (Object.keys(_this.events).length > 0) {
                            try {
                                for (var _a = __values(_this.events), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    var ki = _b.value;
                                    _this.instance.removeListener(ki, _this.events[ki]);
                                }
                            }
                            catch (e_1_1) {
                                e_1 = { error: e_1_1 };
                            }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return))
                                        _c.call(_a);
                                }
                                finally {
                                    if (e_1)
                                        throw e_1.error;
                                }
                            }
                        }
                        _this.instance.removeListener('ready');
                        _this.instance.removeListener('contentChange');
                        _this.instance.destroy();
                        _this.instance = null;
                        var e_1, _c;
                    });
                }
                this.neOnDestroy.emit();
            };
        /**
         * @return {?}
         */
        NgxNeditorComponent.prototype.setDisabled = /**
         * @return {?}
         */
            function () {
                if (!this.instance) {
                    return;
                }
                if (this._disabled) {
                    this.instance.setDisabled();
                }
                else {
                    this.instance.setEnabled();
                }
            };
        Object.defineProperty(NgxNeditorComponent.prototype, "Instance", {
            /**
             * 获取UE实例
             *
             * @readonly
             */
            get: /**
             * 获取UE实例
             *
             * \@readonly
             * @return {?}
             */ function () {
                return this.instance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加编辑器事件
         */
        /**
         * 添加编辑器事件
         * @param {?} eventName
         * @param {?} fn
         * @return {?}
         */
        NgxNeditorComponent.prototype.addListener = /**
         * 添加编辑器事件
         * @param {?} eventName
         * @param {?} fn
         * @return {?}
         */
            function (eventName, fn) {
                if (this.events[eventName]) {
                    return;
                }
                this.events[eventName] = fn;
                this.instance.addListener(eventName, fn);
            };
        /**
         * 移除编辑器事件
         */
        /**
         * 移除编辑器事件
         * @param {?} eventName
         * @return {?}
         */
        NgxNeditorComponent.prototype.removeListener = /**
         * 移除编辑器事件
         * @param {?} eventName
         * @return {?}
         */
            function (eventName) {
                if (!this.events[eventName]) {
                    return;
                }
                this.instance.removeListener(eventName, this.events[eventName]);
                delete this.events[eventName];
            };
        /**
         * @return {?}
         */
        NgxNeditorComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.destroy();
                this.ngUnsubscribe.next();
                this.ngUnsubscribe.complete();
            };
        /**
         * @param {?} value
         * @return {?}
         */
        NgxNeditorComponent.prototype.writeValue = /**
         * @param {?} value
         * @return {?}
         */
            function (value) {
                this.value = value;
                if (this.instance) {
                    this.instance.setContent(this.value);
                }
            };
        /**
         * @param {?} fn
         * @return {?}
         */
        NgxNeditorComponent.prototype.registerOnChange = /**
         * @param {?} fn
         * @return {?}
         */
            function (fn) {
                this.onChange = fn;
            };
        /**
         * @param {?} fn
         * @return {?}
         */
        NgxNeditorComponent.prototype.registerOnTouched = /**
         * @param {?} fn
         * @return {?}
         */
            function (fn) {
                this.onTouched = fn;
            };
        /**
         * @param {?} isDisabled
         * @return {?}
         */
        NgxNeditorComponent.prototype.setDisabledState = /**
         * @param {?} isDisabled
         * @return {?}
         */
            function (isDisabled) {
                this.disabled = isDisabled;
                this.setDisabled();
            };
        NgxNeditorComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'ngx-neditor',
                        template: "\n  <textarea id=\"{{id}}\" class=\"ueditor-textarea\"></textarea>\n  <div *ngIf=\"loading\" class=\"loading\" [innerHTML]=\"loadingTip\"></div>\n  ",
                        preserveWhitespaces: false,
                        styles: [
                            ":host {line-height: initial;} :host .ueditor-textarea{display:none;}",
                        ],
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: core.forwardRef(function () { return NgxNeditorComponent; }),
                                multi: true,
                            },
                        ],
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                    },] },
        ];
        /** @nocollapse */
        NgxNeditorComponent.ctorParameters = function () {
            return [
                { type: ScriptLoaderService },
                { type: core.ElementRef },
                { type: NeditorConfig },
                { type: core.ChangeDetectorRef },
                { type: core.NgZone }
            ];
        };
        NgxNeditorComponent.propDecorators = {
            loadingTip: [{ type: core.Input }],
            config: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            delay: [{ type: core.Input }],
            neOnPreReady: [{ type: core.Output }],
            neOnReady: [{ type: core.Output }],
            neOnDestroy: [{ type: core.Output }]
        };
        return NgxNeditorComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxNeditorModule = (function () {
        function NgxNeditorModule() {
        }
        NgxNeditorModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule
                        ],
                        providers: [ScriptLoaderService, NeditorConfig],
                        declarations: [NgxNeditorComponent],
                        exports: [NgxNeditorComponent]
                    },] },
        ];
        return NgxNeditorModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.NgxNeditorComponent = NgxNeditorComponent;
    exports.NgxNeditorModule = NgxNeditorModule;
    exports.ɵb = NeditorConfig;
    exports.ɵa = ScriptLoaderService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90YWRkLW5neC1uZWRpdG9yLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9Abm90YWRkL25neC1uZWRpdG9yL2xpYi9zY3JpcHQuc3RvcmUudHMiLCJuZzovL0Bub3RhZGQvbmd4LW5lZGl0b3IvbGliL3NjcmlwdC1sb2FkZXIuc2VydmljZS50cyIsIm5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci9saWIvbmVkaXRvci5jb25maWcudHMiLCJuZzovL0Bub3RhZGQvbmd4LW5lZGl0b3IvbGliL25neC1uZWRpdG9yLmNvbXBvbmVudC50cyIsIm5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci9saWIvbmd4LW5lZGl0b3IubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiZXhwb3J0IGludGVyZmFjZSBTY3JpcHRNb2RlbCB7XG4gIG5hbWU6IHN0cmluZztcbiAgc3JjOiBzdHJpbmc7XG4gIGxvYWRlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IFNjcmlwdFN0b3JlOiBBcnJheTxTY3JpcHRNb2RlbD4gPSBbXG4gIHsgbmFtZTogJ2NvbmZpZycsIHNyYzogJy4vYXNzZXRzL25vZGVfbW9kdWxlcy9Abm90YWRkL25lZGl0b3IvbmVkaXRvci5jb25maWcuanMnLCBsb2FkZWQ6IGZhbHNlIH0sXG4gIHsgbmFtZTogJ25lZGl0b3InLCBzcmM6ICcuL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG5vdGFkZC9uZWRpdG9yL25lZGl0b3IuYWxsLm1pbi5qcycsIGxvYWRlZDogZmFsc2UgfSxcbiAgeyBuYW1lOiAnanF1ZXJ5Jywgc3JjOiAnLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Bub3RhZGQvbmVkaXRvci90aGlyZC1wYXJ0eS9qcXVlcnktMS4xMC4yLm1pbi5qcycsIGxvYWRlZDogZmFsc2UgfSxcbiAgeyBuYW1lOiAnc2VydmljZScsIHNyYzogJy4vYXNzZXRzL25vZGVfbW9kdWxlcy9Abm90YWRkL25lZGl0b3IvbmVkaXRvci5zZXJ2aWNlLmpzJywgbG9hZGVkOiBmYWxzZSB9LFxuXTtcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0LCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBjb25jYXRBbGwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFNjcmlwdFN0b3JlLCBTY3JpcHRNb2RlbCB9IGZyb20gJy4vc2NyaXB0LnN0b3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNjcmlwdExvYWRlclNlcnZpY2Uge1xuICBwcml2YXRlIGxvYWRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGVtaXR0ZXI6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICBwcml2YXRlIHNjcmlwdHM6IEFycmF5PFNjcmlwdE1vZGVsPiA9IFNjcmlwdFN0b3JlO1xuXG4gIGdldENoYW5nZUVtaXR0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkKCkge1xuICAgIGlmICh0aGlzLmxvYWRlZCkgeyByZXR1cm4gdGhpczsgfVxuXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8U2NyaXB0TW9kZWw+W10gPSBbXTtcblxuICAgIHRoaXMuc2NyaXB0cy5mb3JFYWNoKHNjcmlwdCA9PiBvYnNlcnZhYmxlcy5wdXNoKHRoaXMubG9hZFNjcmlwdChzY3JpcHQpKSk7XG5cbiAgICBvZiguLi5vYnNlcnZhYmxlcykucGlwZShjb25jYXRBbGwoKSkuc3Vic2NyaWJlKHtcbiAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5uZXh0KHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgbG9hZFNjcmlwdChzY3JpcHQ6IFNjcmlwdE1vZGVsKTogT2JzZXJ2YWJsZTxTY3JpcHRNb2RlbD4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxTY3JpcHRNb2RlbD4oKG9ic2VydmVyOiBPYnNlcnZlcjxTY3JpcHRNb2RlbD4pID0+IHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nU2NyaXB0ID0gdGhpcy5zY3JpcHRzLmZpbmQocyA9PiBzLm5hbWUgPT09IHNjcmlwdC5uYW1lKTtcblxuICAgICAgLy8gQ29tcGxldGUgaWYgYWxyZWFkeSBsb2FkZWRcbiAgICAgIGlmIChleGlzdGluZ1NjcmlwdCAmJiBleGlzdGluZ1NjcmlwdC5sb2FkZWQpIHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChleGlzdGluZ1NjcmlwdCk7XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBMb2FkIHRoZSBzY3JpcHRcbiAgICAgICAgY29uc3Qgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgc2NyaXB0RWxlbWVudC5zcmMgPSBzY3JpcHQuc3JjO1xuXG4gICAgICAgIHNjcmlwdEVsZW1lbnQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgIHNjcmlwdC5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgIG9ic2VydmVyLm5leHQoc2NyaXB0KTtcbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNjcmlwdEVsZW1lbnQub25lcnJvciA9IChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoJ0NvdWxkblxcJ3QgbG9hZCBzY3JpcHQgJyArIHNjcmlwdC5zcmMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgTmVkaXRvck9wdGlvbnMge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIC8qKiDDpcK9wpPDpMK9wqDDpMK9wr/Dp8KUwqggYGNkbmAgw6bCl8K2w6/CvMKMw6XCscKew6bCgMKnw6XCv8KFw6XCocKrw6/CvMKMw6fCm8K4w6XCvcKTw6TCusKOw6bClcK0w6TCuMKqIFVlZGl0b3Igw6bCicKAw6nCnMKAw6jCpsKBw6jCr8Ktw6jCqMKAw6PCgMKBw6TCuMK7w6nCosKYw6PCgMKBw6XCr8K5w6jCr8Kdw6bCocKGw6fCrcKJw6bCoMK5w6jCt8Kvw6XCvsKEICovXG4gIFVFRElUT1JfSE9NRV9VUkw6IHN0cmluZztcbiAgLyoqIMOmwpzCjcOlworCocOlwpnCqMOnwrvCn8OkwrjCgMOowq/Ct8OmwrHCgsOmwo7CpcOlwo/Co8OowrfCr8Olwr7ChCAqL1xuICBzZXJ2ZXJVcmw/OiBzdHJpbmc7XG4gIC8qKiDDpcK3wqXDpcKFwrfDpsKgwo/DpMK4worDp8KawoTDpsKJwoDDpsKcwonDp8KawoTDpcKKwp/DqMKDwr3DpsKMwonDqcKSwq7DpcKSwozDpMK4wovDpsKLwonDpsKhwobDr8K8wozDpcKPwq/DpMK7wqXDpcKcwqhuZXfDp8K8wpbDqMK+wpHDpcKZwqjDp8KawoTDpcKuwp7DpMK+wovDpsKXwrbDqcKAwonDpsKLwqnDqMKHwqrDpcK3wrHDqcKcwoDDqMKmwoHDp8KawoTDpMK7wo7DpsKWwrDDpcKuwprDpMK5wokgKi9cbiAgdG9vbGJhcnM/OiBzdHJpbmdbXVtdO1xuICAvKiogw6fCvMKWw6jCvsKRw6XCmcKow6XCscKCw6fCusKnw6fCmsKEw6XCn8K6w6bClcKwLMOpwrvCmMOowq7CpCBgOTAwYCAqL1xuICB6SW5kZXg/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBOZWRpdG9yQ29uZmlnIHtcbiAgLyoqXG4gICAqIFVlZGl0b3IgW8OlwonCjcOnwqvCr8OpwoXCjcOnwr3CrsOpwqHCuV0oaHR0cDovL2ZleC5iYWlkdS5jb20vdWVkaXRvci8jc3RhcnQtY29uZmlnKVxuICAgKi9cbiAgb3B0aW9uczogTmVkaXRvck9wdGlvbnMgPSB7XG4gICAgVUVESVRPUl9IT01FX1VSTDogJy4vYXNzZXRzL25vZGVfbW9kdWxlcy9Abm90YWRkL25lZGl0b3IvJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBIb29rXG4gICAqIC0gw6XCnMKoIFVlZGl0b3Igw6XCr8K5w6jCscKhw6XCisKgw6jCvcK9w6XCrsKMw6bCiMKQw6XCkMKOw6bCicKnw6jCocKMXG4gICAqIC0gw6XCj8Kqw6bCicKnw6jCocKMw6TCuMKAw6bCrMKhXG4gICAqL1xuICBob29rPzogKHVlOiBhbnkpID0+IHZvaWQ7XG59XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBmb3J3YXJkUmVmLFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1NjcmlwdExvYWRlclNlcnZpY2V9IGZyb20gJy4vc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcbmltcG9ydCB7TmVkaXRvckNvbmZpZ30gZnJvbSAnLi9uZWRpdG9yLmNvbmZpZyc7XG5pbXBvcnQge0V2ZW50VHlwZXN9IGZyb20gJy4vdHlwZXMnO1xuXG5kZWNsYXJlIGNvbnN0IHdpbmRvdzogYW55O1xuZGVjbGFyZSBjb25zdCBVRTogYW55O1xubGV0IF9ob29rX2ZpbmlzaGVkID0gZmFsc2U7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1uZWRpdG9yJyxcbiAgdGVtcGxhdGU6IGBcbiAgPHRleHRhcmVhIGlkPVwie3tpZH19XCIgY2xhc3M9XCJ1ZWRpdG9yLXRleHRhcmVhXCI+PC90ZXh0YXJlYT5cbiAgPGRpdiAqbmdJZj1cImxvYWRpbmdcIiBjbGFzcz1cImxvYWRpbmdcIiBbaW5uZXJIVE1MXT1cImxvYWRpbmdUaXBcIj48L2Rpdj5cbiAgYCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIHN0eWxlczogW1xuICAgIGA6aG9zdCB7bGluZS1oZWlnaHQ6IGluaXRpYWw7fSA6aG9zdCAudWVkaXRvci10ZXh0YXJlYXtkaXNwbGF5Om5vbmU7fWAsXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4TmVkaXRvckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTmd4TmVkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgcHJpdmF0ZSBpbnN0YW5jZTogYW55O1xuICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG4gIHByaXZhdGUgaW5pdGVkID0gZmFsc2U7XG4gIHByaXZhdGUgZXZlbnRzOiBhbnkgPSB7fTtcblxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgb25Ub3VjaGVkOiAoKSA9PiB2b2lkID0gKCkgPT4ge1xuICB9XG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkID0gKCkgPT4ge1xuICB9XG5cbiAgLyogw6XCj8KWw6bCtsKIw6jCrsKiw6nCmMKFw6TCuMK7w6nCosKYICovXG4gIHByaXZhdGUgbmdVbnN1YnNjcmliZTogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgbG9hZGluZyA9IHRydWU7XG4gIGlkID0gYF9uZWRpdG9yLSR7TWF0aC5yYW5kb20oKVxuICAgIC50b1N0cmluZygzNilcbiAgICAuc3Vic3RyaW5nKDIpfWA7XG5cbiAgQElucHV0KCkgbG9hZGluZ1RpcCA9ICfDpcKKwqDDqMK9wr3DpMK4wq0uLi4nO1xuICBASW5wdXQoKSBjb25maWc6IGFueTtcblxuICBASW5wdXQoKVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMuc2V0RGlzYWJsZWQoKTtcbiAgfVxuXG4gIC8qKiDDpcK7wrbDqMK/wp/DpcKIwp3DpcKnwovDpcKMwpYgKi9cbiAgQElucHV0KCkgZGVsYXkgPSA1MDtcblxuICBAT3V0cHV0KCkgcmVhZG9ubHkgbmVPblByZVJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ3hOZWRpdG9yQ29tcG9uZW50PigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbmVPblJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ3hOZWRpdG9yQ29tcG9uZW50PigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbmVPbkRlc3Ryb3kgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzbDogU2NyaXB0TG9hZGVyU2VydmljZSxcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgbmVDb25maWc6IE5lZGl0b3JDb25maWcsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIC8vIMOlwrfCssOnwrvCj8Olwq3CmMOlwpzCqMOlwq/CucOowrHCocOmwpfCoMOpwqHCu8Oowr/Cm8OlwoXCpcOmwofCksOlworCoMOowr3CvcOmwqjCocOlwrzCj1xuICAgIGlmICh3aW5kb3cuVUUpIHtcbiAgICAgIHRoaXMuaW5pdERlbGF5KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zbC5sb2FkKClcbiAgICAgIC5nZXRDaGFuZ2VFbWl0dGVyKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLm5nVW5zdWJzY3JpYmUpKVxuICAgICAgLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5pdGVkICYmIGNoYW5nZXMuY29uZmlnKSB7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuaW5pdERlbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0RGVsYXkoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmluaXQoKSwgdGhpcy5kZWxheSk7XG4gIH1cblxuICBwcml2YXRlIGluaXQoKSB7XG4gICAgaWYgKCF3aW5kb3cuVUUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbmVkaXRvciBqc8OmwpbCh8OkwrvCtsOlworCoMOowr3CvcOlwqTCscOowrTCpScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcmVnaXN0cmVyIGhvb2tcbiAgICBpZiAodGhpcy5uZUNvbmZpZy5ob29rICYmICFfaG9va19maW5pc2hlZCkge1xuICAgICAgX2hvb2tfZmluaXNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5uZUNvbmZpZy5ob29rKFVFKTtcbiAgICB9XG5cbiAgICB0aGlzLm5lT25QcmVSZWFkeS5lbWl0KHRoaXMpO1xuXG4gICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5uZUNvbmZpZy5vcHRpb25zLCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgY29uc3QgdWVkaXRvciA9IFVFLmdldEVkaXRvcih0aGlzLmlkLCBvcHQpO1xuICAgICAgdWVkaXRvci5yZWFkeSgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB1ZWRpdG9yO1xuICAgICAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0Q29udGVudCh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5lT25SZWFkeS5lbWl0KHRoaXMpO1xuICAgICAgfSk7XG5cbiAgICAgIHVlZGl0b3IuYWRkTGlzdGVuZXIoJ2NvbnRlbnRDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB1ZWRpdG9yLmdldENvbnRlbnQoKTtcblxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMub25DaGFuZ2UodGhpcy52YWx1ZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZXZlbnRzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBraSBvZiB0aGlzLmV2ZW50cykge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcihraSwgdGhpcy5ldmVudHNba2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluc3RhbmNlLnJlbW92ZUxpc3RlbmVyKCdyZWFkeScpO1xuICAgICAgICB0aGlzLmluc3RhbmNlLnJlbW92ZUxpc3RlbmVyKCdjb250ZW50Q2hhbmdlJyk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLm5lT25EZXN0cm95LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RGlzYWJsZWQoKSB7XG4gICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5zZXREaXNhYmxlZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluc3RhbmNlLnNldEVuYWJsZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogw6jCjsK3w6XCj8KWVUXDpcKuwp7DpMK+wotcbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgSW5zdGFuY2UoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDDpsK3wrvDpcKKwqDDp8K8wpbDqMK+wpHDpcKZwqjDpMK6wovDpMK7wrZcbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50TmFtZTogRXZlbnRUeXBlcywgZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IGZuO1xuICAgIHRoaXMuaW5zdGFuY2UuYWRkTGlzdGVuZXIoZXZlbnROYW1lLCBmbik7XG4gIH1cblxuICAvKipcbiAgICogw6fCp8K7w6nCmcKkw6fCvMKWw6jCvsKRw6XCmcKow6TCusKLw6TCu8K2XG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihldmVudE5hbWU6IEV2ZW50VHlwZXMpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pO1xuICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudE5hbWVdO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlLm5leHQoKTtcbiAgICB0aGlzLm5nVW5zdWJzY3JpYmUuY29tcGxldGUoKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5zZXRDb250ZW50KHRoaXMudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuc2V0RGlzYWJsZWQoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ3hOZWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtbmVkaXRvci5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBTY3JpcHRMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9zY3JpcHQtbG9hZGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmVkaXRvckNvbmZpZyB9IGZyb20gJy4vbmVkaXRvci5jb25maWcnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIHByb3ZpZGVyczogWyBTY3JpcHRMb2FkZXJTZXJ2aWNlLCBOZWRpdG9yQ29uZmlnIF0sXG4gIGRlY2xhcmF0aW9uczogW05neE5lZGl0b3JDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmd4TmVkaXRvckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4TmVkaXRvck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJTdWJqZWN0Iiwib2YiLCJjb25jYXRBbGwiLCJPYnNlcnZhYmxlIiwiSW5qZWN0YWJsZSIsIkV2ZW50RW1pdHRlciIsInRha2VVbnRpbCIsInRzbGliXzEuX192YWx1ZXMiLCJDb21wb25lbnQiLCJOR19WQUxVRV9BQ0NFU1NPUiIsImZvcndhcmRSZWYiLCJDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSIsIkVsZW1lbnRSZWYiLCJDaGFuZ2VEZXRlY3RvclJlZiIsIk5nWm9uZSIsIklucHV0IiwiT3V0cHV0IiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFBOzs7Ozs7Ozs7Ozs7OztBQWNBLHNCQTRGeUIsQ0FBQztRQUN0QixJQUFJLENBQUMsR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPO1lBQ0gsSUFBSSxFQUFFO2dCQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTTtvQkFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQzNDO1NBQ0osQ0FBQztJQUNOLENBQUM7QUFFRCxvQkFBdUIsQ0FBQyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJO1lBQ0EsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSTtnQkFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5RTtRQUNELE9BQU8sS0FBSyxFQUFFO1lBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQUU7Z0JBQy9CO1lBQ0osSUFBSTtnQkFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BEO29CQUNPO2dCQUFFLElBQUksQ0FBQztvQkFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFBRTtTQUNwQztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztBQUVEO1FBQ0ksS0FBSyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFDOUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDOzs7Ozs7O0FDcElELFFBQWEsV0FBVyxHQUF1QjtRQUM3QyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLHlEQUF5RCxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDakcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSwwREFBMEQsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1FBQ25HLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsd0VBQXdFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLDBEQUEwRCxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7S0FDcEcsQ0FBQzs7Ozs7Ozs7MEJDSGlCLEtBQUs7MkJBQ2MsSUFBSUEsWUFBTyxFQUFXOzJCQUNwQixXQUFXOzs7OztRQUVqRCw4Q0FBZ0I7OztZQUFoQjtnQkFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDcEM7Ozs7UUFFTSxrQ0FBSTs7Ozs7Z0JBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUFFLE9BQU8sSUFBSSxDQUFDO2lCQUFFO2dCQUVqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7Z0JBRW5CLElBQU0sV0FBVyxHQUE4QixFQUFFLENBQUM7Z0JBRWxELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUEsQ0FBQyxDQUFDO2dCQUUxRUMsT0FBRSx3QkFBSSxXQUFXLEdBQUUsSUFBSSxDQUFDQyxtQkFBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQzdDLFFBQVEsRUFBRTt3QkFDUixLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDekI7aUJBQ0YsQ0FBQyxDQUFDO2dCQUVILE9BQU8sSUFBSSxDQUFDOzs7Ozs7UUFHUCx3Q0FBVTs7OztzQkFBQyxNQUFtQjs7Z0JBQ25DLE9BQU8sSUFBSUMsZUFBVSxDQUFjLFVBQUMsUUFBK0I7O29CQUNqRSxJQUFNLGNBQWMsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksR0FBQSxDQUFDLENBQUM7O29CQUd0RSxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFO3dCQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUM5QixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ3JCO3lCQUFNOzt3QkFFTCxJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUN2RCxhQUFhLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO3dCQUN2QyxhQUFhLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7d0JBRS9CLGFBQWEsQ0FBQyxNQUFNLEdBQUc7NEJBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzRCQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN0QixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7eUJBQ3JCLENBQUM7d0JBRUYsYUFBYSxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQVU7NEJBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUN2RCxDQUFDO3dCQUVGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7cUJBQ3JFO2lCQUNGLENBQUMsQ0FBQzs7O29CQXRETkMsZUFBVTs7a0NBTlg7Ozs7Ozs7UUNZQTs7Ozs7MkJBSTRCO2dCQUN4QixnQkFBZ0IsRUFBRSx3Q0FBd0M7YUFDM0Q7OzRCQWxCSDtRQTBCQzs7Ozs7OztJQ0NELElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQzs7UUEwRHpCLDZCQUNVLElBQ0EsSUFDQSxVQUNBLElBQ0E7WUFKQSxPQUFFLEdBQUYsRUFBRTtZQUNGLE9BQUUsR0FBRixFQUFFO1lBQ0YsYUFBUSxHQUFSLFFBQVE7WUFDUixPQUFFLEdBQUYsRUFBRTtZQUNGLFNBQUksR0FBSixJQUFJOzBCQXZDRyxLQUFLOzBCQUNBLEVBQUU7NkJBRUosS0FBSzs2QkFFTzthQUMvQjs0QkFDMkM7YUFDM0M7aUNBR3lDLElBQUlKLFlBQU8sRUFBRTsyQkFFN0MsSUFBSTtzQkFDVCxjQUFZLElBQUksQ0FBQyxNQUFNLEVBQUU7aUJBQzNCLFFBQVEsQ0FBQyxFQUFFLENBQUM7aUJBQ1osU0FBUyxDQUFDLENBQUMsQ0FBRzs4QkFFSyxRQUFROzs7O3lCQVViLEVBQUU7Z0NBRWUsSUFBSUssaUJBQVksRUFBdUI7NkJBQzFDLElBQUlBLGlCQUFZLEVBQXVCOytCQUNyQyxJQUFJQSxpQkFBWSxFQUFFO1NBU2xEO1FBcEJELHNCQUNJLHlDQUFROzs7O2dCQURaLFVBQ2EsS0FBYztnQkFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNwQjs7O1dBQUE7Ozs7UUFrQkQsc0NBQVE7OztZQUFSO2dCQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ3BCOzs7O1FBRUQsNkNBQWU7OztZQUFmO2dCQUFBLGlCQWFDOztnQkFYQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQixPQUFPO2lCQUNSO2dCQUVELElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFO3FCQUNYLGdCQUFnQixFQUFFO3FCQUNsQixJQUFJLENBQUNDLG1CQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUNuQyxTQUFTLENBQUMsVUFBQSxHQUFHO29CQUNaLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDbEIsQ0FBQyxDQUFDO2FBQ047Ozs7O1FBRUQseUNBQVc7Ozs7WUFBWCxVQUFZLE9BQXNCO2dCQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxVQUFPLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDZixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQ2xCO2FBQ0Y7Ozs7UUFFTyx1Q0FBUzs7Ozs7Z0JBQ2YsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxFQUFFLEdBQUEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O1FBR3BDLGtDQUFJOzs7OztnQkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtvQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQ3JDO2dCQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDakIsT0FBTztpQkFDUjs7Z0JBR0QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDekMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ3hCO2dCQUVELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztnQkFFN0IsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUVsRSxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDOztvQkFDMUIsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLENBQUMsS0FBSyxDQUFDO3dCQUNaLEtBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO3dCQUN4QixJQUFJLEtBQUksQ0FBQyxLQUFLLEVBQUU7NEJBQ2QsS0FBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUN0Qzt3QkFDRCxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQztxQkFDM0IsQ0FBQyxDQUFDO29CQUVILE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFO3dCQUNuQyxLQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFFbEMsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFBLENBQUMsQ0FBQztxQkFDaEQsQ0FBQyxDQUFDO2lCQUNKLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDckIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7Ozs7UUFHbEIscUNBQU87Ozs7O2dCQUNiLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQzt3QkFFMUIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztnQ0FDdkMsS0FBaUIsSUFBQSxLQUFBQyxTQUFBLEtBQUksQ0FBQyxNQUFNLENBQUEsZ0JBQUE7b0NBQXZCLElBQU0sRUFBRSxXQUFBO29DQUNYLEtBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUNBQ25EOzs7Ozs7Ozs7Ozs7Ozs7eUJBQ0Y7d0JBRUQsS0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3RDLEtBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUM5QyxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN4QixLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7cUJBQ3RCLENBQUMsQ0FBQztpQkFDSjtnQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDOzs7OztRQUdsQix5Q0FBVzs7OztnQkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2xCLE9BQU87aUJBQ1I7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUM3QjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO2lCQUM1Qjs7UUFRSCxzQkFBSSx5Q0FBUTs7Ozs7Ozs7Ozs7Z0JBQVo7Z0JBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3RCOzs7V0FBQTs7Ozs7Ozs7OztRQUtELHlDQUFXOzs7Ozs7WUFBWCxVQUFZLFNBQXFCLEVBQUUsRUFBWTtnQkFDN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUMxQixPQUFPO2lCQUNSO2dCQUNELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDMUM7Ozs7Ozs7OztRQUtELDRDQUFjOzs7OztZQUFkLFVBQWUsU0FBcUI7Z0JBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUMzQixPQUFPO2lCQUNSO2dCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMvQjs7OztRQUVELHlDQUFXOzs7WUFBWDtnQkFDRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUMvQjs7Ozs7UUFFRCx3Q0FBVTs7OztZQUFWLFVBQVcsS0FBYTtnQkFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ25CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN0QzthQUNGOzs7OztRQUVELDhDQUFnQjs7OztZQUFoQixVQUFpQixFQUFrQjtnQkFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7YUFDcEI7Ozs7O1FBRUQsK0NBQWlCOzs7O1lBQWpCLFVBQWtCLEVBQVk7Z0JBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2FBQ3JCOzs7OztRQUVELDhDQUFnQjs7OztZQUFoQixVQUFpQixVQUFtQjtnQkFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNwQjs7b0JBM05GQyxjQUFTLFNBQUM7d0JBQ1QsUUFBUSxFQUFFLGFBQWE7d0JBQ3ZCLFFBQVEsRUFBRSxzSkFHVDt3QkFDRCxtQkFBbUIsRUFBRSxLQUFLO3dCQUMxQixNQUFNLEVBQUU7NEJBQ04sc0VBQXNFO3lCQUN2RTt3QkFDRCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsT0FBTyxFQUFFQyx1QkFBaUI7Z0NBQzFCLFdBQVcsRUFBRUMsZUFBVSxDQUFDLGNBQU0sT0FBQSxtQkFBbUIsR0FBQSxDQUFDO2dDQUNsRCxLQUFLLEVBQUUsSUFBSTs2QkFDWjt5QkFDRjt3QkFDRCxlQUFlLEVBQUVDLDRCQUF1QixDQUFDLE1BQU07cUJBQ2hEOzs7Ozt3QkExQk8sbUJBQW1CO3dCQWpCekJDLGVBQVU7d0JBa0JKLGFBQWE7d0JBWG5CQyxzQkFBaUI7d0JBSWpCQyxXQUFNOzs7O2lDQXNETEMsVUFBSzs2QkFDTEEsVUFBSzsrQkFFTEEsVUFBSzs0QkFPTEEsVUFBSzttQ0FFTEMsV0FBTTtnQ0FDTkEsV0FBTTtrQ0FDTkEsV0FBTTs7a0NBbkZUOzs7Ozs7O0FDQUE7Ozs7b0JBT0NDLGFBQVEsU0FBQzt3QkFDUixPQUFPLEVBQUU7NEJBQ1BDLG1CQUFZO3lCQUNiO3dCQUNELFNBQVMsRUFBRSxDQUFFLG1CQUFtQixFQUFFLGFBQWEsQ0FBRTt3QkFDakQsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7d0JBQ25DLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO3FCQUMvQjs7K0JBZEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
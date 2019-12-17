import { __spread, __values } from 'tslib';
import { Injectable, Component, Input, forwardRef, ElementRef, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, NgModule } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { concatAll, takeUntil } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
var ScriptLoaderService = /** @class */ (function () {
    function ScriptLoaderService() {
        this.loaded = false;
        this.emitter = new Subject();
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
        console.log()
        of.apply(void 0, __spread(observables)).pipe(concatAll()).subscribe({
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
        return new Observable(function (observer) {
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
        { type: Injectable },
    ];
    return ScriptLoaderService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NeditorConfig = /** @class */ (function () {
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
var NgxNeditorComponent = /** @class */ (function () {
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
        this.ngUnsubscribe = new Subject();
        this.loading = true;
        this.id = "_neditor-" + Math.random()
            .toString(36)
            .substring(2);
        this.loadingTip = '加载中...';
        /**
         * 延迟初始化
         */
        this.delay = 50;
        this.neOnPreReady = new EventEmitter();
        this.neOnReady = new EventEmitter();
        this.neOnDestroy = new EventEmitter();
    }
    Object.defineProperty(NgxNeditorComponent.prototype, "disabled", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
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
            .pipe(takeUntil(this.ngUnsubscribe))
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
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
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
         */
        function () {
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
        { type: Component, args: [{
                    selector: 'ngx-neditor',
                    template: "\n  <textarea id=\"{{id}}\" class=\"ueditor-textarea\"></textarea>\n  <div *ngIf=\"loading\" class=\"loading\" [innerHTML]=\"loadingTip\"></div>\n  ",
                    preserveWhitespaces: false,
                    styles: [
                        ":host {line-height: initial;} :host .ueditor-textarea{display:none;}",
                    ],
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return NgxNeditorComponent; }),
                            multi: true,
                        },
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /** @nocollapse */
    NgxNeditorComponent.ctorParameters = function () { return [
        { type: ScriptLoaderService },
        { type: ElementRef },
        { type: NeditorConfig },
        { type: ChangeDetectorRef },
        { type: NgZone }
    ]; };
    NgxNeditorComponent.propDecorators = {
        loadingTip: [{ type: Input }],
        config: [{ type: Input }],
        disabled: [{ type: Input }],
        delay: [{ type: Input }],
        neOnPreReady: [{ type: Output }],
        neOnReady: [{ type: Output }],
        neOnDestroy: [{ type: Output }]
    };
    return NgxNeditorComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgxNeditorModule = /** @class */ (function () {
    function NgxNeditorModule() {
    }
    NgxNeditorModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
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

export { NgxNeditorComponent, NgxNeditorModule, NeditorConfig as ɵb, ScriptLoaderService as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90YWRkLW5neC1uZWRpdG9yLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Abm90YWRkL25neC1uZWRpdG9yL2xpYi9zY3JpcHQuc3RvcmUudHMiLCJuZzovL0Bub3RhZGQvbmd4LW5lZGl0b3IvbGliL3NjcmlwdC1sb2FkZXIuc2VydmljZS50cyIsIm5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci9saWIvbmVkaXRvci5jb25maWcudHMiLCJuZzovL0Bub3RhZGQvbmd4LW5lZGl0b3IvbGliL25neC1uZWRpdG9yLmNvbXBvbmVudC50cyIsIm5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci9saWIvbmd4LW5lZGl0b3IubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgU2NyaXB0TW9kZWwge1xuICBuYW1lOiBzdHJpbmc7XG4gIHNyYzogc3RyaW5nO1xuICBsb2FkZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBTY3JpcHRTdG9yZTogQXJyYXk8U2NyaXB0TW9kZWw+ID0gW1xuICB7IG5hbWU6ICdjb25maWcnLCBzcmM6ICcuL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG5vdGFkZC9uZWRpdG9yL25lZGl0b3IuY29uZmlnLmpzJywgbG9hZGVkOiBmYWxzZSB9LFxuICB7IG5hbWU6ICduZWRpdG9yJywgc3JjOiAnLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Bub3RhZGQvbmVkaXRvci9uZWRpdG9yLmFsbC5taW4uanMnLCBsb2FkZWQ6IGZhbHNlIH0sXG4gIHsgbmFtZTogJ2pxdWVyeScsIHNyYzogJy4vYXNzZXRzL25vZGVfbW9kdWxlcy9Abm90YWRkL25lZGl0b3IvdGhpcmQtcGFydHkvanF1ZXJ5LTEuMTAuMi5taW4uanMnLCBsb2FkZWQ6IGZhbHNlIH0sXG4gIHsgbmFtZTogJ3NlcnZpY2UnLCBzcmM6ICcuL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG5vdGFkZC9uZWRpdG9yL25lZGl0b3Iuc2VydmljZS5qcycsIGxvYWRlZDogZmFsc2UgfSxcbl07XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciwgU3ViamVjdCwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgY29uY2F0QWxsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBTY3JpcHRTdG9yZSwgU2NyaXB0TW9kZWwgfSBmcm9tICcuL3NjcmlwdC5zdG9yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY3JpcHRMb2FkZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBsb2FkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBlbWl0dGVyOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgcHJpdmF0ZSBzY3JpcHRzOiBBcnJheTxTY3JpcHRNb2RlbD4gPSBTY3JpcHRTdG9yZTtcblxuICBnZXRDaGFuZ2VFbWl0dGVyKCkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBwdWJsaWMgbG9hZCgpIHtcbiAgICBpZiAodGhpcy5sb2FkZWQpIHsgcmV0dXJuIHRoaXM7IH1cblxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IG9ic2VydmFibGVzOiBPYnNlcnZhYmxlPFNjcmlwdE1vZGVsPltdID0gW107XG5cbiAgICB0aGlzLnNjcmlwdHMuZm9yRWFjaChzY3JpcHQgPT4gb2JzZXJ2YWJsZXMucHVzaCh0aGlzLmxvYWRTY3JpcHQoc2NyaXB0KSkpO1xuXG4gICAgb2YoLi4ub2JzZXJ2YWJsZXMpLnBpcGUoY29uY2F0QWxsKCkpLnN1YnNjcmliZSh7XG4gICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXR0ZXIubmV4dCh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGxvYWRTY3JpcHQoc2NyaXB0OiBTY3JpcHRNb2RlbCk6IE9ic2VydmFibGU8U2NyaXB0TW9kZWw+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8U2NyaXB0TW9kZWw+KChvYnNlcnZlcjogT2JzZXJ2ZXI8U2NyaXB0TW9kZWw+KSA9PiB7XG4gICAgICBjb25zdCBleGlzdGluZ1NjcmlwdCA9IHRoaXMuc2NyaXB0cy5maW5kKHMgPT4gcy5uYW1lID09PSBzY3JpcHQubmFtZSk7XG5cbiAgICAgIC8vIENvbXBsZXRlIGlmIGFscmVhZHkgbG9hZGVkXG4gICAgICBpZiAoZXhpc3RpbmdTY3JpcHQgJiYgZXhpc3RpbmdTY3JpcHQubG9hZGVkKSB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZXhpc3RpbmdTY3JpcHQpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgc2NyaXB0XG4gICAgICAgIGNvbnN0IHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0RWxlbWVudC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgIHNjcmlwdEVsZW1lbnQuc3JjID0gc2NyaXB0LnNyYztcblxuICAgICAgICBzY3JpcHRFbGVtZW50Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICBzY3JpcHQubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHNjcmlwdCk7XG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzY3JpcHRFbGVtZW50Lm9uZXJyb3IgPSAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKCdDb3VsZG5cXCd0IGxvYWQgc2NyaXB0ICcgKyBzY3JpcHQuc3JjKTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIE5lZGl0b3JPcHRpb25zIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICAvKiogw6XCvcKTw6TCvcKgw6TCvcK/w6fClMKoIGBjZG5gIMOmwpfCtsOvwrzCjMOlwrHCnsOmwoDCp8Olwr/ChcOlwqHCq8OvwrzCjMOnwpvCuMOlwr3Ck8OkwrrCjsOmwpXCtMOkwrjCqiBVZWRpdG9yIMOmwonCgMOpwpzCgMOowqbCgcOowq/CrcOowqjCgMOjwoDCgcOkwrjCu8OpwqLCmMOjwoDCgcOlwq/CucOowq/CncOmwqHChsOnwq3CicOmwqDCucOowrfCr8Olwr7ChCAqL1xuICBVRURJVE9SX0hPTUVfVVJMOiBzdHJpbmc7XG4gIC8qKiDDpsKcwo3DpcKKwqHDpcKZwqjDp8K7wp/DpMK4woDDqMKvwrfDpsKxwoLDpsKOwqXDpcKPwqPDqMK3wq/DpcK+woQgKi9cbiAgc2VydmVyVXJsPzogc3RyaW5nO1xuICAvKiogw6XCt8Klw6XChcK3w6bCoMKPw6TCuMKKw6fCmsKEw6bCicKAw6bCnMKJw6fCmsKEw6XCisKfw6jCg8K9w6bCjMKJw6nCksKuw6XCksKMw6TCuMKLw6bCi8KJw6bCocKGw6/CvMKMw6XCj8Kvw6TCu8Klw6XCnMKobmV3w6fCvMKWw6jCvsKRw6XCmcKow6fCmsKEw6XCrsKew6TCvsKLw6bCl8K2w6nCgMKJw6bCi8Kpw6jCh8Kqw6XCt8Kxw6nCnMKAw6jCpsKBw6fCmsKEw6TCu8KOw6bClsKww6XCrsKaw6TCucKJICovXG4gIHRvb2xiYXJzPzogc3RyaW5nW11bXTtcbiAgLyoqIMOnwrzClsOowr7CkcOlwpnCqMOlwrHCgsOnwrrCp8OnwprChMOlwp/CusOmwpXCsCzDqcK7wpjDqMKuwqQgYDkwMGAgKi9cbiAgekluZGV4PzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgTmVkaXRvckNvbmZpZyB7XG4gIC8qKlxuICAgKiBVZWRpdG9yIFvDpcKJwo3Dp8Krwq/DqcKFwo3Dp8K9wq7DqcKhwrldKGh0dHA6Ly9mZXguYmFpZHUuY29tL3VlZGl0b3IvI3N0YXJ0LWNvbmZpZylcbiAgICovXG4gIG9wdGlvbnM6IE5lZGl0b3JPcHRpb25zID0ge1xuICAgIFVFRElUT1JfSE9NRV9VUkw6ICcuL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG5vdGFkZC9uZWRpdG9yLydcbiAgfTtcblxuICAvKipcbiAgICogSG9va1xuICAgKiAtIMOlwpzCqCBVZWRpdG9yIMOlwq/CucOowrHCocOlworCoMOowr3CvcOlwq7CjMOmwojCkMOlwpDCjsOmwonCp8OowqHCjFxuICAgKiAtIMOlwo/CqsOmwonCp8OowqHCjMOkwrjCgMOmwqzCoVxuICAgKi9cbiAgaG9vaz86ICh1ZTogYW55KSA9PiB2b2lkO1xufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgZm9yd2FyZFJlZixcbiAgRWxlbWVudFJlZixcbiAgT25EZXN0cm95LFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtTY3JpcHRMb2FkZXJTZXJ2aWNlfSBmcm9tICcuL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XG5pbXBvcnQge05lZGl0b3JDb25maWd9IGZyb20gJy4vbmVkaXRvci5jb25maWcnO1xuaW1wb3J0IHtFdmVudFR5cGVzfSBmcm9tICcuL3R5cGVzJztcblxuZGVjbGFyZSBjb25zdCB3aW5kb3c6IGFueTtcbmRlY2xhcmUgY29uc3QgVUU6IGFueTtcbmxldCBfaG9va19maW5pc2hlZCA9IGZhbHNlO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtbmVkaXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gIDx0ZXh0YXJlYSBpZD1cInt7aWR9fVwiIGNsYXNzPVwidWVkaXRvci10ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG4gIDxkaXYgKm5nSWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJsb2FkaW5nXCIgW2lubmVySFRNTF09XCJsb2FkaW5nVGlwXCI+PC9kaXY+XG4gIGAsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdHlsZXM6IFtcbiAgICBgOmhvc3Qge2xpbmUtaGVpZ2h0OiBpbml0aWFsO30gOmhvc3QgLnVlZGl0b3ItdGV4dGFyZWF7ZGlzcGxheTpub25lO31gLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neE5lZGl0b3JDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE5neE5lZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHByaXZhdGUgaW5zdGFuY2U6IGFueTtcbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuICBwcml2YXRlIGluaXRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGV2ZW50czogYW55ID0ge307XG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuXG4gIC8qIMOlwo/ClsOmwrbCiMOowq7CosOpwpjChcOkwrjCu8OpwqLCmCAqL1xuICBwcml2YXRlIG5nVW5zdWJzY3JpYmU6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGxvYWRpbmcgPSB0cnVlO1xuICBpZCA9IGBfbmVkaXRvci0ke01hdGgucmFuZG9tKClcbiAgICAudG9TdHJpbmcoMzYpXG4gICAgLnN1YnN0cmluZygyKX1gO1xuXG4gIEBJbnB1dCgpIGxvYWRpbmdUaXAgPSAnw6XCisKgw6jCvcK9w6TCuMKtLi4uJztcbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XG5cbiAgQElucHV0KClcbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cblxuICAvKiogw6XCu8K2w6jCv8Kfw6XCiMKdw6XCp8KLw6XCjMKWICovXG4gIEBJbnB1dCgpIGRlbGF5ID0gNTA7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25QcmVSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25SZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25EZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2w6IFNjcmlwdExvYWRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIG5lQ29uZmlnOiBOZWRpdG9yQ29uZmlnLFxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICApIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyDDpcK3wrLDp8K7wo/DpcKtwpjDpcKcwqjDpcKvwrnDqMKxwqHDpsKXwqDDqcKhwrvDqMK/wpvDpcKFwqXDpsKHwpLDpcKKwqDDqMK9wr3DpsKowqHDpcK8wo9cbiAgICBpZiAod2luZG93LlVFKSB7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2wubG9hZCgpXG4gICAgICAuZ2V0Q2hhbmdlRW1pdHRlcigpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5uZ1Vuc3Vic2NyaWJlKSlcbiAgICAgIC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgdGhpcy5pbml0RGVsYXkoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmluaXRlZCAmJiBjaGFuZ2VzLmNvbmZpZykge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdERlbGF5KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbml0KCksIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0KCkge1xuICAgIGlmICghd2luZG93LlVFKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25lZGl0b3IganPDpsKWwofDpMK7wrbDpcKKwqDDqMK9wr3DpcKkwrHDqMK0wqUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJlZ2lzdHJlciBob29rXG4gICAgaWYgKHRoaXMubmVDb25maWcuaG9vayAmJiAhX2hvb2tfZmluaXNoZWQpIHtcbiAgICAgIF9ob29rX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMubmVDb25maWcuaG9vayhVRSk7XG4gICAgfVxuXG4gICAgdGhpcy5uZU9uUHJlUmVhZHkuZW1pdCh0aGlzKTtcblxuICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubmVDb25maWcub3B0aW9ucywgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IHVlZGl0b3IgPSBVRS5nZXRFZGl0b3IodGhpcy5pZCwgb3B0KTtcbiAgICAgIHVlZGl0b3IucmVhZHkoKCkgPT4ge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gdWVkaXRvcjtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLnNldENvbnRlbnQodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZU9uUmVhZHkuZW1pdCh0aGlzKTtcbiAgICAgIH0pO1xuXG4gICAgICB1ZWRpdG9yLmFkZExpc3RlbmVyKCdjb250ZW50Q2hhbmdlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnZhbHVlID0gdWVkaXRvci5nZXRDb250ZW50KCk7XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLm9uQ2hhbmdlKHRoaXMudmFsdWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmV2ZW50cykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3Qga2kgb2YgdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoa2ksIHRoaXMuZXZlbnRzW2tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcigncmVhZHknKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcignY29udGVudENoYW5nZScpO1xuICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5uZU9uRGVzdHJveS5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIHNldERpc2FibGVkKCkge1xuICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0RGlzYWJsZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnN0YW5jZS5zZXRFbmFibGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIMOowo7Ct8Olwo/CllVFw6XCrsKew6TCvsKLXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IEluc3RhbmNlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogw6bCt8K7w6XCisKgw6fCvMKWw6jCvsKRw6XCmcKow6TCusKLw6TCu8K2XG4gICAqL1xuICBhZGRMaXN0ZW5lcihldmVudE5hbWU6IEV2ZW50VHlwZXMsIGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSBmbjtcbiAgICB0aGlzLmluc3RhbmNlLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIMOnwqfCu8OpwpnCpMOnwrzClsOowr7CkcOlwpnCqMOkwrrCi8OkwrvCtlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lOiBFdmVudFR5cGVzKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICBkZWxldGUgdGhpcy5ldmVudHNbZXZlbnROYW1lXTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMubmdVbnN1YnNjcmliZS5uZXh0KCk7XG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlLmNvbXBsZXRlKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0Q29udGVudCh0aGlzLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmd4TmVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LW5lZGl0b3IuY29tcG9uZW50JztcblxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4vc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE5lZGl0b3JDb25maWcgfSBmcm9tICcuL25lZGl0b3IuY29uZmlnJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBwcm92aWRlcnM6IFsgU2NyaXB0TG9hZGVyU2VydmljZSwgTmVkaXRvckNvbmZpZyBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hOZWRpdG9yQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neE5lZGl0b3JDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5lZGl0b3JNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX3ZhbHVlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBTUEsSUFBYSxXQUFXLEdBQXVCO0lBQzdDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUseURBQXlELEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtJQUNqRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLDBEQUEwRCxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7SUFDbkcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSx3RUFBd0UsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0lBQ2hILEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsMERBQTBELEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtDQUNwRyxDQUFDOzs7Ozs7OztzQkNIaUIsS0FBSzt1QkFDYyxJ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
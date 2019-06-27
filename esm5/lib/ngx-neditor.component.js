/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, forwardRef, ElementRef, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScriptLoaderService } from './script-loader.service';
import { NeditorConfig } from './neditor.config';
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
                        for (var _a = tslib_1.__values(_this.events), _b = _a.next(); !_b.done; _b = _a.next()) {
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
export { NgxNeditorComponent };
if (false) {
    /** @type {?} */
    NgxNeditorComponent.prototype.instance;
    /** @type {?} */
    NgxNeditorComponent.prototype.value;
    /** @type {?} */
    NgxNeditorComponent.prototype.inited;
    /** @type {?} */
    NgxNeditorComponent.prototype.events;
    /** @type {?} */
    NgxNeditorComponent.prototype._disabled;
    /** @type {?} */
    NgxNeditorComponent.prototype.onTouched;
    /** @type {?} */
    NgxNeditorComponent.prototype.onChange;
    /** @type {?} */
    NgxNeditorComponent.prototype.ngUnsubscribe;
    /** @type {?} */
    NgxNeditorComponent.prototype.loading;
    /** @type {?} */
    NgxNeditorComponent.prototype.id;
    /** @type {?} */
    NgxNeditorComponent.prototype.loadingTip;
    /** @type {?} */
    NgxNeditorComponent.prototype.config;
    /**
     * 延迟初始化
     * @type {?}
     */
    NgxNeditorComponent.prototype.delay;
    /** @type {?} */
    NgxNeditorComponent.prototype.neOnPreReady;
    /** @type {?} */
    NgxNeditorComponent.prototype.neOnReady;
    /** @type {?} */
    NgxNeditorComponent.prototype.neOnDestroy;
    /** @type {?} */
    NgxNeditorComponent.prototype.sl;
    /** @type {?} */
    NgxNeditorComponent.prototype.el;
    /** @type {?} */
    NgxNeditorComponent.prototype.neConfig;
    /** @type {?} */
    NgxNeditorComponent.prototype.cd;
    /** @type {?} */
    NgxNeditorComponent.prototype.zone;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtbmVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxVQUFVLEVBQ1YsVUFBVSxFQUVWLFlBQVksRUFDWixNQUFNLEVBR04sdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUlqQixNQUFNLEVBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFLL0MsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDOztJQTBEekIsNkJBQ1UsSUFDQSxJQUNBLFVBQ0EsSUFDQTtRQUpBLE9BQUUsR0FBRixFQUFFO1FBQ0YsT0FBRSxHQUFGLEVBQUU7UUFDRixhQUFRLEdBQVIsUUFBUTtRQUNSLE9BQUUsR0FBRixFQUFFO1FBQ0YsU0FBSSxHQUFKLElBQUk7c0JBdkNHLEtBQUs7c0JBQ0EsRUFBRTt5QkFFSixLQUFLO3lCQUVPO1NBQy9CO3dCQUMyQztTQUMzQzs2QkFHeUMsSUFBSSxPQUFPLEVBQUU7dUJBRTdDLElBQUk7a0JBQ1QsY0FBWSxJQUFJLENBQUMsTUFBTSxFQUFFO2FBQzNCLFFBQVEsQ0FBQyxFQUFFLENBQUM7YUFDWixTQUFTLENBQUMsQ0FBQyxDQUFHOzBCQUVLLFFBQVE7Ozs7cUJBVWIsRUFBRTs0QkFFZSxJQUFJLFlBQVksRUFBdUI7eUJBQzFDLElB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eUJBQ0wsS0FBSzsyQkFFTCxLQUFLO3dCQU9MLEtBQUs7K0JBRUwsTUFBTTs0QkFDTixNQUFNOzhCQUNOLE1BQU07OzhCQW5GVDs7U0FnRGEsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgZm9yd2FyZFJlZixcbiAgRWxlbWVudFJlZixcbiAgT25EZXN0cm95LFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtTY3JpcHRMb2FkZXJTZXJ2aWNlfSBmcm9tICcuL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XG5pbXBvcnQge05lZGl0b3JDb25maWd9IGZyb20gJy4vbmVkaXRvci5jb25maWcnO1xuaW1wb3J0IHtFdmVudFR5cGVzfSBmcm9tICcuL3R5cGVzJztcblxuZGVjbGFyZSBjb25zdCB3aW5kb3c6IGFueTtcbmRlY2xhcmUgY29uc3QgVUU6IGFueTtcbmxldCBfaG9va19maW5pc2hlZCA9IGZhbHNlO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtbmVkaXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gIDx0ZXh0YXJlYSBpZD1cInt7aWR9fVwiIGNsYXNzPVwidWVkaXRvci10ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG4gIDxkaXYgKm5nSWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJsb2FkaW5nXCIgW2lubmVySFRNTF09XCJsb2FkaW5nVGlwXCI+PC9kaXY+XG4gIGAsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdHlsZXM6IFtcbiAgICBgOmhvc3Qge2xpbmUtaGVpZ2h0OiBpbml0aWFsO30gOmhvc3QgLnVlZGl0b3ItdGV4dGFyZWF7ZGlzcGxheTpub25lO31gLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neE5lZGl0b3JDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE5neE5lZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHByaXZhdGUgaW5zdGFuY2U6IGFueTtcbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuICBwcml2YXRlIGluaXRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGV2ZW50czogYW55ID0ge307XG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuXG4gIC8qIOWPlua2iOiuoumYheS4u+mimCAqL1xuICBwcml2YXRlIG5nVW5zdWJzY3JpYmU6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGxvYWRpbmcgPSB0cnVlO1xuICBpZCA9IGBfbmVkaXRvci0ke01hdGgucmFuZG9tKClcbiAgICAudG9TdHJpbmcoMzYpXG4gICAgLnN1YnN0cmluZygyKX1gO1xuXG4gIEBJbnB1dCgpIGxvYWRpbmdUaXAgPSAn5Yqg6L295LitLi4uJztcbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XG5cbiAgQElucHV0KClcbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cblxuICAvKiog5bu26L+f5Yid5aeL5YyWICovXG4gIEBJbnB1dCgpIGRlbGF5ID0gNTA7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25QcmVSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25SZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25EZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2w6IFNjcmlwdExvYWRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIG5lQ29uZmlnOiBOZWRpdG9yQ29uZmlnLFxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICApIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyDlt7Lnu4/lrZjlnKjlr7nosaHml6Dpobvov5vlhaXmh5LliqDovb3mqKHlvI9cbiAgICBpZiAod2luZG93LlVFKSB7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2wubG9hZCgpXG4gICAgICAuZ2V0Q2hhbmdlRW1pdHRlcigpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5uZ1Vuc3Vic2NyaWJlKSlcbiAgICAgIC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgdGhpcy5pbml0RGVsYXkoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmluaXRlZCAmJiBjaGFuZ2VzLmNvbmZpZykge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdERlbGF5KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbml0KCksIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0KCkge1xuICAgIGlmICghd2luZG93LlVFKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25lZGl0b3IganPmlofku7bliqDovb3lpLHotKUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJlZ2lzdHJlciBob29rXG4gICAgaWYgKHRoaXMubmVDb25maWcuaG9vayAmJiAhX2hvb2tfZmluaXNoZWQpIHtcbiAgICAgIF9ob29rX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMubmVDb25maWcuaG9vayhVRSk7XG4gICAgfVxuXG4gICAgdGhpcy5uZU9uUHJlUmVhZHkuZW1pdCh0aGlzKTtcblxuICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubmVDb25maWcub3B0aW9ucywgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IHVlZGl0b3IgPSBVRS5nZXRFZGl0b3IodGhpcy5pZCwgb3B0KTtcbiAgICAgIHVlZGl0b3IucmVhZHkoKCkgPT4ge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gdWVkaXRvcjtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLnNldENvbnRlbnQodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZU9uUmVhZHkuZW1pdCh0aGlzKTtcbiAgICAgIH0pO1xuXG4gICAgICB1ZWRpdG9yLmFkZExpc3RlbmVyKCdjb250ZW50Q2hhbmdlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnZhbHVlID0gdWVkaXRvci5nZXRDb250ZW50KCk7XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLm9uQ2hhbmdlKHRoaXMudmFsdWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmV2ZW50cykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3Qga2kgb2YgdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoa2ksIHRoaXMuZXZlbnRzW2tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcigncmVhZHknKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcignY29udGVudENoYW5nZScpO1xuICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5uZU9uRGVzdHJveS5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIHNldERpc2FibGVkKCkge1xuICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0RGlzYWJsZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnN0YW5jZS5zZXRFbmFibGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPllVF5a6e5L6LXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IEluc3RhbmNlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICog5re75Yqg57yW6L6R5Zmo5LqL5Lu2XG4gICAqL1xuICBhZGRMaXN0ZW5lcihldmVudE5hbWU6IEV2ZW50VHlwZXMsIGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSBmbjtcbiAgICB0aGlzLmluc3RhbmNlLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIOenu+mZpOe8lui+keWZqOS6i+S7tlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lOiBFdmVudFR5cGVzKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICBkZWxldGUgdGhpcy5ldmVudHNbZXZlbnROYW1lXTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMubmdVbnN1YnNjcmliZS5uZXh0KCk7XG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlLmNvbXBsZXRlKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0Q29udGVudCh0aGlzLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cbn1cbiJdfQ==
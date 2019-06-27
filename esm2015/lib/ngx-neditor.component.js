/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, forwardRef, ElementRef, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScriptLoaderService } from './script-loader.service';
import { NeditorConfig } from './neditor.config';
/** @type {?} */
let _hook_finished = false;
export class NgxNeditorComponent {
    /**
     * @param {?} sl
     * @param {?} el
     * @param {?} neConfig
     * @param {?} cd
     * @param {?} zone
     */
    constructor(sl, el, neConfig, cd, zone) {
        this.sl = sl;
        this.el = el;
        this.neConfig = neConfig;
        this.cd = cd;
        this.zone = zone;
        this.inited = false;
        this.events = {};
        this._disabled = false;
        this.onTouched = () => {
        };
        this.onChange = () => {
        };
        this.ngUnsubscribe = new Subject();
        this.loading = true;
        this.id = `_neditor-${Math.random()
            .toString(36)
            .substring(2)}`;
        this.loadingTip = '加载中...';
        /**
         * 延迟初始化
         */
        this.delay = 50;
        this.neOnPreReady = new EventEmitter();
        this.neOnReady = new EventEmitter();
        this.neOnDestroy = new EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = value;
        this.setDisabled();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.inited = true;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // 已经存在对象无须进入懒加载模式
        if (window.UE) {
            this.initDelay();
            return;
        }
        this.sl.load()
            .getChangeEmitter()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
            this.initDelay();
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.inited && changes["config"]) {
            this.destroy();
            this.initDelay();
        }
    }
    /**
     * @return {?}
     */
    initDelay() {
        setTimeout(() => this.init(), this.delay);
    }
    /**
     * @return {?}
     */
    init() {
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
        const opt = Object.assign({}, this.neConfig.options, this.config);
        this.zone.runOutsideAngular(() => {
            /** @type {?} */
            const ueditor = UE.getEditor(this.id, opt);
            ueditor.ready(() => {
                this.instance = ueditor;
                if (this.value) {
                    this.instance.setContent(this.value);
                }
                this.neOnReady.emit(this);
            });
            ueditor.addListener('contentChange', () => {
                this.value = ueditor.getContent();
                this.zone.run(() => this.onChange(this.value));
            });
        });
        this.loading = false;
        this.cd.detectChanges();
    }
    /**
     * @return {?}
     */
    destroy() {
        if (this.instance) {
            this.zone.runOutsideAngular(() => {
                if (Object.keys(this.events).length > 0) {
                    for (const ki of this.events) {
                        this.instance.removeListener(ki, this.events[ki]);
                    }
                }
                this.instance.removeListener('ready');
                this.instance.removeListener('contentChange');
                this.instance.destroy();
                this.instance = null;
            });
        }
        this.neOnDestroy.emit();
    }
    /**
     * @return {?}
     */
    setDisabled() {
        if (!this.instance) {
            return;
        }
        if (this._disabled) {
            this.instance.setDisabled();
        }
        else {
            this.instance.setEnabled();
        }
    }
    /**
     * 获取UE实例
     *
     * \@readonly
     * @return {?}
     */
    get Instance() {
        return this.instance;
    }
    /**
     * 添加编辑器事件
     * @param {?} eventName
     * @param {?} fn
     * @return {?}
     */
    addListener(eventName, fn) {
        if (this.events[eventName]) {
            return;
        }
        this.events[eventName] = fn;
        this.instance.addListener(eventName, fn);
    }
    /**
     * 移除编辑器事件
     * @param {?} eventName
     * @return {?}
     */
    removeListener(eventName) {
        if (!this.events[eventName]) {
            return;
        }
        this.instance.removeListener(eventName, this.events[eventName]);
        delete this.events[eventName];
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.destroy();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        if (this.instance) {
            this.instance.setContent(this.value);
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.setDisabled();
    }
}
NgxNeditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-neditor',
                template: `
  <textarea id="{{id}}" class="ueditor-textarea"></textarea>
  <div *ngIf="loading" class="loading" [innerHTML]="loadingTip"></div>
  `,
                preserveWhitespaces: false,
                styles: [
                    `:host {line-height: initial;} :host .ueditor-textarea{display:none;}`,
                ],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgxNeditorComponent),
                        multi: true,
                    },
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
NgxNeditorComponent.ctorParameters = () => [
    { type: ScriptLoaderService },
    { type: ElementRef },
    { type: NeditorConfig },
    { type: ChangeDetectorRef },
    { type: NgZone }
];
NgxNeditorComponent.propDecorators = {
    loadingTip: [{ type: Input }],
    config: [{ type: Input }],
    disabled: [{ type: Input }],
    delay: [{ type: Input }],
    neOnPreReady: [{ type: Output }],
    neOnReady: [{ type: Output }],
    neOnDestroy: [{ type: Output }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtbmVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLFVBQVUsRUFDVixVQUFVLEVBRVYsWUFBWSxFQUNaLE1BQU0sRUFHTix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBSWpCLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQXVCLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDOztBQUsvQyxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFxQjNCLE1BQU07Ozs7Ozs7O0lBcUNKLFlBQ1UsSUFDQSxJQUNBLFVBQ0EsSUFDQTtRQUpBLE9BQUUsR0FBRixFQUFFO1FBQ0YsT0FBRSxHQUFGLEVBQUU7UUFDRixhQUFRLEdBQVIsUUFBUTtRQUNSLE9BQUUsR0FBRixFQUFFO1FBQ0YsU0FBSSxHQUFKLElBQUk7c0JBdkNHLEtBQUs7c0JBQ0EsRUFBRTt5QkFFSixLQUFLO3lCQUVPLEdBQUcsRUFBRTtTQUNwQzt3QkFDMkMsR0FBRyxFQUFFO1NBQ2hEOzZCQUd5QyxJQUFJLE9BQU8sRUFBRTt1QkFFN0MsSUFBSTtrQkFDVCxZQUFZLElBQUksQ0FBQyxNQUFNLEVBQUU7YUFDM0IsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUNaLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTswQkFFSyxRQUFROzs7O3FC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LEdBQUcsS0FBSyxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QztLQUNGOzs7OztJQUVELGdCQUFnQixDQUFDLEVBQWtCO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ3BCOzs7OztJQUVELGlCQUFpQixDQUFDLEVBQVk7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7S0FDckI7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3BCOzs7WUEzTkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixRQUFRLEVBQUU7OztHQUdUO2dCQUNELG1CQUFtQixFQUFFLEtBQUs7Z0JBQzFCLE1BQU0sRUFBRTtvQkFDTixzRUFBc0U7aUJBQ3ZFO2dCQUNELFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDO3dCQUNsRCxLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7OztZQTFCTyxtQkFBbUI7WUFqQnpCLFVBQVU7WUFrQkosYUFBYTtZQVhuQixpQkFBaUI7WUFJakIsTUFBTTs7O3lCQXNETCxLQUFLO3FCQUNMLEtBQUs7dUJBRUwsS0FBSztvQkFPTCxLQUFLOzJCQUVMLE1BQU07d0JBQ04sTUFBTTswQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgZm9yd2FyZFJlZixcbiAgRWxlbWVudFJlZixcbiAgT25EZXN0cm95LFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtTY3JpcHRMb2FkZXJTZXJ2aWNlfSBmcm9tICcuL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XG5pbXBvcnQge05lZGl0b3JDb25maWd9IGZyb20gJy4vbmVkaXRvci5jb25maWcnO1xuaW1wb3J0IHtFdmVudFR5cGVzfSBmcm9tICcuL3R5cGVzJztcblxuZGVjbGFyZSBjb25zdCB3aW5kb3c6IGFueTtcbmRlY2xhcmUgY29uc3QgVUU6IGFueTtcbmxldCBfaG9va19maW5pc2hlZCA9IGZhbHNlO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtbmVkaXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gIDx0ZXh0YXJlYSBpZD1cInt7aWR9fVwiIGNsYXNzPVwidWVkaXRvci10ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG4gIDxkaXYgKm5nSWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJsb2FkaW5nXCIgW2lubmVySFRNTF09XCJsb2FkaW5nVGlwXCI+PC9kaXY+XG4gIGAsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdHlsZXM6IFtcbiAgICBgOmhvc3Qge2xpbmUtaGVpZ2h0OiBpbml0aWFsO30gOmhvc3QgLnVlZGl0b3ItdGV4dGFyZWF7ZGlzcGxheTpub25lO31gLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neE5lZGl0b3JDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE5neE5lZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHByaXZhdGUgaW5zdGFuY2U6IGFueTtcbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuICBwcml2YXRlIGluaXRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGV2ZW50czogYW55ID0ge307XG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuXG4gIC8qIOWPlua2iOiuoumYheS4u+mimCAqL1xuICBwcml2YXRlIG5nVW5zdWJzY3JpYmU6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGxvYWRpbmcgPSB0cnVlO1xuICBpZCA9IGBfbmVkaXRvci0ke01hdGgucmFuZG9tKClcbiAgICAudG9TdHJpbmcoMzYpXG4gICAgLnN1YnN0cmluZygyKX1gO1xuXG4gIEBJbnB1dCgpIGxvYWRpbmdUaXAgPSAn5Yqg6L295LitLi4uJztcbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XG5cbiAgQElucHV0KClcbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cblxuICAvKiog5bu26L+f5Yid5aeL5YyWICovXG4gIEBJbnB1dCgpIGRlbGF5ID0gNTA7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25QcmVSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25SZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25EZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2w6IFNjcmlwdExvYWRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIG5lQ29uZmlnOiBOZWRpdG9yQ29uZmlnLFxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICApIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyDlt7Lnu4/lrZjlnKjlr7nosaHml6Dpobvov5vlhaXmh5LliqDovb3mqKHlvI9cbiAgICBpZiAod2luZG93LlVFKSB7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2wubG9hZCgpXG4gICAgICAuZ2V0Q2hhbmdlRW1pdHRlcigpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5uZ1Vuc3Vic2NyaWJlKSlcbiAgICAgIC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgdGhpcy5pbml0RGVsYXkoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmluaXRlZCAmJiBjaGFuZ2VzLmNvbmZpZykge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdERlbGF5KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbml0KCksIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0KCkge1xuICAgIGlmICghd2luZG93LlVFKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25lZGl0b3IganPmlofku7bliqDovb3lpLHotKUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJlZ2lzdHJlciBob29rXG4gICAgaWYgKHRoaXMubmVDb25maWcuaG9vayAmJiAhX2hvb2tfZmluaXNoZWQpIHtcbiAgICAgIF9ob29rX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMubmVDb25maWcuaG9vayhVRSk7XG4gICAgfVxuXG4gICAgdGhpcy5uZU9uUHJlUmVhZHkuZW1pdCh0aGlzKTtcblxuICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubmVDb25maWcub3B0aW9ucywgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IHVlZGl0b3IgPSBVRS5nZXRFZGl0b3IodGhpcy5pZCwgb3B0KTtcbiAgICAgIHVlZGl0b3IucmVhZHkoKCkgPT4ge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gdWVkaXRvcjtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLnNldENvbnRlbnQodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZU9uUmVhZHkuZW1pdCh0aGlzKTtcbiAgICAgIH0pO1xuXG4gICAgICB1ZWRpdG9yLmFkZExpc3RlbmVyKCdjb250ZW50Q2hhbmdlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnZhbHVlID0gdWVkaXRvci5nZXRDb250ZW50KCk7XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLm9uQ2hhbmdlKHRoaXMudmFsdWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmV2ZW50cykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3Qga2kgb2YgdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoa2ksIHRoaXMuZXZlbnRzW2tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcigncmVhZHknKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcignY29udGVudENoYW5nZScpO1xuICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5uZU9uRGVzdHJveS5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIHNldERpc2FibGVkKCkge1xuICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0RGlzYWJsZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnN0YW5jZS5zZXRFbmFibGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPllVF5a6e5L6LXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IEluc3RhbmNlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICog5re75Yqg57yW6L6R5Zmo5LqL5Lu2XG4gICAqL1xuICBhZGRMaXN0ZW5lcihldmVudE5hbWU6IEV2ZW50VHlwZXMsIGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSBmbjtcbiAgICB0aGlzLmluc3RhbmNlLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIOenu+mZpOe8lui+keWZqOS6i+S7tlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lOiBFdmVudFR5cGVzKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICBkZWxldGUgdGhpcy5ldmVudHNbZXZlbnROYW1lXTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMubmdVbnN1YnNjcmliZS5uZXh0KCk7XG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlLmNvbXBsZXRlKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0Q29udGVudCh0aGlzLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cbn1cbiJdfQ==
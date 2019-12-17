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
const ScriptStore = [
    { name: 'config', src: './assets/node_modules/@notadd/neditor/neditor.config.js', loaded: false },
    { name: 'neditor', src: './assets/node_modules/@notadd/neditor/neditor.all.min.js', loaded: false },
    { name: 'jquery', src: './assets/node_modules/@notadd/neditor/third-party/jquery-1.10.2.min.js', loaded: false },
    { name: 'service', src: './assets/node_modules/@notadd/neditor/neditor.service.js', loaded: false },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ScriptLoaderService {
    constructor() {
        this.loaded = false;
        this.emitter = new Subject();
        this.scripts = ScriptStore;
    }
    /**
     * @return {?}
     */
    getChangeEmitter() {
        return this.emitter.asObservable();
    }
    /**
     * @return {?}
     */
    load() {
        if (this.loaded) {
            return this;
        }
        this.loaded = true;
        /** @type {?} */
        const observables = [];
        this.scripts.forEach(script => observables.push(this.loadScript(script)));
        of(...observables).pipe(concatAll()).subscribe({
            complete: () => {
                this.emitter.next(true);
            }
        });
        return this;
    }
    /**
     * @param {?} script
     * @return {?}
     */
    loadScript(script) {
        return new Observable((observer) => {
            /** @type {?} */
            const existingScript = this.scripts.find(s => s.name === script.name);
            // Complete if already loaded
            if (existingScript && existingScript.loaded) {
                observer.next(existingScript);
                observer.complete();
            }
            else {
                /** @type {?} */
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                scriptElement.src = script.src;
                scriptElement.onload = () => {
                    script.loaded = true;
                    observer.next(script);
                    observer.complete();
                };
                scriptElement.onerror = (error) => {
                    observer.error('Couldn\'t load script ' + script.src);
                };
                document.getElementsByTagName('body')[0].appendChild(scriptElement);
            }
        });
    }
}
ScriptLoaderService.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NeditorConfig {
    constructor() {
        /**
         * Ueditor [前端配置项](http://fex.baidu.com/ueditor/#start-config)
         */
        this.options = {
            UEDITOR_HOME_URL: './assets/node_modules/@notadd/neditor/'
        };
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let _hook_finished = false;
class NgxNeditorComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxNeditorModule {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgxNeditorComponent, NgxNeditorModule, NeditorConfig as ɵb, ScriptLoaderService as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90YWRkLW5neC1uZWRpdG9yLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Abm90YWRkL25neC1uZWRpdG9yL2xpYi9zY3JpcHQuc3RvcmUudHMiLCJuZzovL0Bub3RhZGQvbmd4LW5lZGl0b3IvbGliL3NjcmlwdC1sb2FkZXIuc2VydmljZS50cyIsIm5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci9saWIvbmVkaXRvci5jb25maWcudHMiLCJuZzovL0Bub3RhZGQvbmd4LW5lZGl0b3IvbGliL25neC1uZWRpdG9yLmNvbXBvbmVudC50cyIsIm5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci9saWIvbmd4LW5lZGl0b3IubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgU2NyaXB0TW9kZWwge1xuICBuYW1lOiBzdHJpbmc7XG4gIHNyYzogc3RyaW5nO1xuICBsb2FkZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBTY3JpcHRTdG9yZTogQXJyYXk8U2NyaXB0TW9kZWw+ID0gW1xuICB7IG5hbWU6ICdjb25maWcnLCBzcmM6ICcuL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG5vdGFkZC9uZWRpdG9yL25lZGl0b3IuY29uZmlnLmpzJywgbG9hZGVkOiBmYWxzZSB9LFxuICB7IG5hbWU6ICduZWRpdG9yJywgc3JjOiAnLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Bub3RhZGQvbmVkaXRvci9uZWRpdG9yLmFsbC5taW4uanMnLCBsb2FkZWQ6IGZhbHNlIH0sXG4gIHsgbmFtZTogJ2pxdWVyeScsIHNyYzogJy4vYXNzZXRzL25vZGVfbW9kdWxlcy9Abm90YWRkL25lZGl0b3IvdGhpcmQtcGFydHkvanF1ZXJ5LTEuMTAuMi5taW4uanMnLCBsb2FkZWQ6IGZhbHNlIH0sXG4gIHsgbmFtZTogJ3NlcnZpY2UnLCBzcmM6ICcuL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG5vdGFkZC9uZWRpdG9yL25lZGl0b3Iuc2VydmljZS5qcycsIGxvYWRlZDogZmFsc2UgfSxcbl07XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciwgU3ViamVjdCwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgY29uY2F0QWxsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBTY3JpcHRTdG9yZSwgU2NyaXB0TW9kZWwgfSBmcm9tICcuL3NjcmlwdC5zdG9yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY3JpcHRMb2FkZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBsb2FkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBlbWl0dGVyOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgcHJpdmF0ZSBzY3JpcHRzOiBBcnJheTxTY3JpcHRNb2RlbD4gPSBTY3JpcHRTdG9yZTtcblxuICBnZXRDaGFuZ2VFbWl0dGVyKCkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBwdWJsaWMgbG9hZCgpIHtcbiAgICBpZiAodGhpcy5sb2FkZWQpIHsgcmV0dXJuIHRoaXM7IH1cblxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IG9ic2VydmFibGVzOiBPYnNlcnZhYmxlPFNjcmlwdE1vZGVsPltdID0gW107XG5cbiAgICB0aGlzLnNjcmlwdHMuZm9yRWFjaChzY3JpcHQgPT4gb2JzZXJ2YWJsZXMucHVzaCh0aGlzLmxvYWRTY3JpcHQoc2NyaXB0KSkpO1xuXG4gICAgb2YoLi4ub2JzZXJ2YWJsZXMpLnBpcGUoY29uY2F0QWxsKCkpLnN1YnNjcmliZSh7XG4gICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXR0ZXIubmV4dCh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGxvYWRTY3JpcHQoc2NyaXB0OiBTY3JpcHRNb2RlbCk6IE9ic2VydmFibGU8U2NyaXB0TW9kZWw+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8U2NyaXB0TW9kZWw+KChvYnNlcnZlcjogT2JzZXJ2ZXI8U2NyaXB0TW9kZWw+KSA9PiB7XG4gICAgICBjb25zdCBleGlzdGluZ1NjcmlwdCA9IHRoaXMuc2NyaXB0cy5maW5kKHMgPT4gcy5uYW1lID09PSBzY3JpcHQubmFtZSk7XG5cbiAgICAgIC8vIENvbXBsZXRlIGlmIGFscmVhZHkgbG9hZGVkXG4gICAgICBpZiAoZXhpc3RpbmdTY3JpcHQgJiYgZXhpc3RpbmdTY3JpcHQubG9hZGVkKSB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZXhpc3RpbmdTY3JpcHQpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgc2NyaXB0XG4gICAgICAgIGNvbnN0IHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0RWxlbWVudC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgIHNjcmlwdEVsZW1lbnQuc3JjID0gc2NyaXB0LnNyYztcblxuICAgICAgICBzY3JpcHRFbGVtZW50Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICBzY3JpcHQubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHNjcmlwdCk7XG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzY3JpcHRFbGVtZW50Lm9uZXJyb3IgPSAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKCdDb3VsZG5cXCd0IGxvYWQgc2NyaXB0ICcgKyBzY3JpcHQuc3JjKTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIE5lZGl0b3JPcHRpb25zIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICAvKiogw6XCvcKTw6TCvcKgw6TCvcK/w6fClMKoIGBjZG5gIMOmwpfCtsOvwrzCjMOlwrHCnsOmwoDCp8Olwr/ChcOlwqHCq8OvwrzCjMOnwpvCuMOlwr3Ck8OkwrrCjsOmwpXCtMOkwrjCqiBVZWRpdG9yIMOmwonCgMOpwpzCgMOowqbCgcOowq/CrcOowqjCgMOjwoDCgcOkwrjCu8OpwqLCmMOjwoDCgcOlwq/CucOowq/CncOmwqHChsOnwq3CicOmwqDCucOowrfCr8Olwr7ChCAqL1xuICBVRURJVE9SX0hPTUVfVVJMOiBzdHJpbmc7XG4gIC8qKiDDpsKcwo3DpcKKwqHDpcKZwqjDp8K7wp/DpMK4woDDqMKvwrfDpsKxwoLDpsKOwqXDpcKPwqPDqMK3wq/DpcK+woQgKi9cbiAgc2VydmVyVXJsPzogc3RyaW5nO1xuICAvKiogw6XCt8Klw6XChcK3w6bCoMKPw6TCuMKKw6fCmsKEw6bCicKAw6bCnMKJw6fCmsKEw6XCisKfw6jCg8K9w6bCjMKJw6nCksKuw6XCksKMw6TCuMKLw6bCi8KJw6bCocKGw6/CvMKMw6XCj8Kvw6TCu8Klw6XCnMKobmV3w6fCvMKWw6jCvsKRw6XCmcKow6fCmsKEw6XCrsKew6TCvsKLw6bCl8K2w6nCgMKJw6bCi8Kpw6jCh8Kqw6XCt8Kxw6nCnMKAw6jCpsKBw6fCmsKEw6TCu8KOw6bClsKww6XCrsKaw6TCucKJICovXG4gIHRvb2xiYXJzPzogc3RyaW5nW11bXTtcbiAgLyoqIMOnwrzClsOowr7CkcOlwpnCqMOlwrHCgsOnwrrCp8OnwprChMOlwp/CusOmwpXCsCzDqcK7wpjDqMKuwqQgYDkwMGAgKi9cbiAgekluZGV4PzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgTmVkaXRvckNvbmZpZyB7XG4gIC8qKlxuICAgKiBVZWRpdG9yIFvDpcKJwo3Dp8Krwq/DqcKFwo3Dp8K9wq7DqcKhwrldKGh0dHA6Ly9mZXguYmFpZHUuY29tL3VlZGl0b3IvI3N0YXJ0LWNvbmZpZylcbiAgICovXG4gIG9wdGlvbnM6IE5lZGl0b3JPcHRpb25zID0ge1xuICAgIFVFRElUT1JfSE9NRV9VUkw6ICcuL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG5vdGFkZC9uZWRpdG9yLydcbiAgfTtcblxuICAvKipcbiAgICogSG9va1xuICAgKiAtIMOlwpzCqCBVZWRpdG9yIMOlwq/CucOowrHCocOlworCoMOowr3CvcOlwq7CjMOmwojCkMOlwpDCjsOmwonCp8OowqHCjFxuICAgKiAtIMOlwo/CqsOmwonCp8OowqHCjMOkwrjCgMOmwqzCoVxuICAgKi9cbiAgaG9vaz86ICh1ZTogYW55KSA9PiB2b2lkO1xufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgZm9yd2FyZFJlZixcbiAgRWxlbWVudFJlZixcbiAgT25EZXN0cm95LFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtTY3JpcHRMb2FkZXJTZXJ2aWNlfSBmcm9tICcuL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XG5pbXBvcnQge05lZGl0b3JDb25maWd9IGZyb20gJy4vbmVkaXRvci5jb25maWcnO1xuaW1wb3J0IHtFdmVudFR5cGVzfSBmcm9tICcuL3R5cGVzJztcblxuZGVjbGFyZSBjb25zdCB3aW5kb3c6IGFueTtcbmRlY2xhcmUgY29uc3QgVUU6IGFueTtcbmxldCBfaG9va19maW5pc2hlZCA9IGZhbHNlO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtbmVkaXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gIDx0ZXh0YXJlYSBpZD1cInt7aWR9fVwiIGNsYXNzPVwidWVkaXRvci10ZXh0YXJlYVwiPjwvdGV4dGFyZWE+XG4gIDxkaXYgKm5nSWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJsb2FkaW5nXCIgW2lubmVySFRNTF09XCJsb2FkaW5nVGlwXCI+PC9kaXY+XG4gIGAsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdHlsZXM6IFtcbiAgICBgOmhvc3Qge2xpbmUtaGVpZ2h0OiBpbml0aWFsO30gOmhvc3QgLnVlZGl0b3ItdGV4dGFyZWF7ZGlzcGxheTpub25lO31gLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neE5lZGl0b3JDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE5neE5lZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHByaXZhdGUgaW5zdGFuY2U6IGFueTtcbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuICBwcml2YXRlIGluaXRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGV2ZW50czogYW55ID0ge307XG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCA9ICgpID0+IHtcbiAgfVxuXG4gIC8qIMOlwo/ClsOmwrbCiMOowq7CosOpwpjChcOkwrjCu8OpwqLCmCAqL1xuICBwcml2YXRlIG5nVW5zdWJzY3JpYmU6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGxvYWRpbmcgPSB0cnVlO1xuICBpZCA9IGBfbmVkaXRvci0ke01hdGgucmFuZG9tKClcbiAgICAudG9TdHJpbmcoMzYpXG4gICAgLnN1YnN0cmluZygyKX1gO1xuXG4gIEBJbnB1dCgpIGxvYWRpbmdUaXAgPSAnw6XCisKgw6jCvcK9w6TCuMKtLi4uJztcbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XG5cbiAgQElucHV0KClcbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cblxuICAvKiogw6XCu8K2w6jCv8Kfw6XCiMKdw6XCp8KLw6XCjMKWICovXG4gIEBJbnB1dCgpIGRlbGF5ID0gNTA7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25QcmVSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25SZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4TmVkaXRvckNvbXBvbmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG5lT25EZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2w6IFNjcmlwdExvYWRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIG5lQ29uZmlnOiBOZWRpdG9yQ29uZmlnLFxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICApIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyDDpcK3wrLDp8K7wo/DpcKtwpjDpcKcwqjDpcKvwrnDqMKxwqHDpsKXwqDDqcKhwrvDqMK/wpvDpcKFwqXDpsKHwpLDpcKKwqDDqMK9wr3DpsKowqHDpcK8wo9cbiAgICBpZiAod2luZG93LlVFKSB7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2wubG9hZCgpXG4gICAgICAuZ2V0Q2hhbmdlRW1pdHRlcigpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5uZ1Vuc3Vic2NyaWJlKSlcbiAgICAgIC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgdGhpcy5pbml0RGVsYXkoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmluaXRlZCAmJiBjaGFuZ2VzLmNvbmZpZykge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICB0aGlzLmluaXREZWxheSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdERlbGF5KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbml0KCksIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0KCkge1xuICAgIGlmICghd2luZG93LlVFKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25lZGl0b3IganPDpsKWwofDpMK7wrbDpcKKwqDDqMK9wr3DpcKkwrHDqMK0wqUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJlZ2lzdHJlciBob29rXG4gICAgaWYgKHRoaXMubmVDb25maWcuaG9vayAmJiAhX2hvb2tfZmluaXNoZWQpIHtcbiAgICAgIF9ob29rX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMubmVDb25maWcuaG9vayhVRSk7XG4gICAgfVxuXG4gICAgdGhpcy5uZU9uUHJlUmVhZHkuZW1pdCh0aGlzKTtcblxuICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubmVDb25maWcub3B0aW9ucywgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IHVlZGl0b3IgPSBVRS5nZXRFZGl0b3IodGhpcy5pZCwgb3B0KTtcbiAgICAgIHVlZGl0b3IucmVhZHkoKCkgPT4ge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gdWVkaXRvcjtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLnNldENvbnRlbnQodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZU9uUmVhZHkuZW1pdCh0aGlzKTtcbiAgICAgIH0pO1xuXG4gICAgICB1ZWRpdG9yLmFkZExpc3RlbmVyKCdjb250ZW50Q2hhbmdlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnZhbHVlID0gdWVkaXRvci5nZXRDb250ZW50KCk7XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLm9uQ2hhbmdlKHRoaXMudmFsdWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmV2ZW50cykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3Qga2kgb2YgdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoa2ksIHRoaXMuZXZlbnRzW2tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcigncmVhZHknKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcignY29udGVudENoYW5nZScpO1xuICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5uZU9uRGVzdHJveS5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIHNldERpc2FibGVkKCkge1xuICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0RGlzYWJsZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnN0YW5jZS5zZXRFbmFibGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIMOowo7Ct8Olwo/CllVFw6XCrsKew6TCvsKLXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IEluc3RhbmNlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogw6bCt8K7w6XCisKgw6fCvMKWw6jCvsKRw6XCmcKow6TCusKLw6TCu8K2XG4gICAqL1xuICBhZGRMaXN0ZW5lcihldmVudE5hbWU6IEV2ZW50VHlwZXMsIGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSBmbjtcbiAgICB0aGlzLmluc3RhbmNlLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIMOnwqfCu8OpwpnCpMOnwrzClsOowr7CkcOlwpnCqMOkwrrCi8OkwrvCtlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lOiBFdmVudFR5cGVzKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICBkZWxldGUgdGhpcy5ldmVudHNbZXZlbnROYW1lXTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMubmdVbnN1YnNjcmliZS5uZXh0KCk7XG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlLmNvbXBsZXRlKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2Uuc2V0Q29udGVudCh0aGlzLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLnNldERpc2FibGVkKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmd4TmVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LW5lZGl0b3IuY29tcG9uZW50JztcblxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4vc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE5lZGl0b3JDb25maWcgfSBmcm9tICcuL25lZGl0b3IuY29uZmlnJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBwcm92aWRlcnM6IFsgU2NyaXB0TG9hZGVyU2VydmljZSwgTmVkaXRvckNvbmZpZyBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hOZWRpdG9yQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neE5lZGl0b3JDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5lZGl0b3JNb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFNQSxNQUFhLFdBQVcsR0FBdUI7SUFDN0MsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSx5REFBeUQsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0lBQ2pHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsMERBQTBELEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtJQUNuRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLHdFQUF3RSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7SUFDaEgsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSwwREFBMEQsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0NBQ3BHLENBQUM7Ozs7OztBQ1hGOztzQkFRbUIsS0FBSzt1QkFDYyxJQUFJLE9BQU8sRUFBVzt1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
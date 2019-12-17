/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { concatAll } from 'rxjs/operators';
import { ScriptStore } from './script.store';
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
        of.apply(void 0, tslib_1.__spread(observables)).pipe(concatAll()).subscribe({
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
export { ScriptLoaderService };
if (false) {
    /** @type {?} */
    ScriptLoaderService.prototype.loaded;
    /** @type {?} */
    ScriptLoaderService.prototype.emitter;
    /** @type {?} */
    ScriptLoaderService.prototype.scripts;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci8iLCJzb3VyY2VzIjpbImxpYi9zY3JpcHQtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQVksT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQVUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLFdBQVcsRUFBZSxNQUFNLGdCQUFnQixDQUFDOzs7c0JBSXZDLEtBQUs7dUJBQ2MsSUFBSSxPQUFPLEVBQVc7dUJBQ3BCLFdBQVc7Ozs7O0lBRWpELDhDQUFnQjs7O0lBQWhCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDcEM7Ozs7SUFFTSxrQ0FBSTs7Ozs7UUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FBRTtRQUVqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7UUFFbkIsSUFBTSxXQUFXLEdBQThCLEVBQUUsQ0FBQztRQUVsRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDLENBQUM7UUFFMUUsRUFBRSxnQ0FBSSxXQUFXLEdBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQzdDLFFBQVEsRUFBRTtnQkFDUixLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6QjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUM7Ozs7OztJQUdQLHdDQUFVOzs7O2NBQUMsTUFBbUI7O1FBQ25DLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBYyxVQUFDLFFBQStCOztZQUNqRSxJQUFNLGNBQWMsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDOztZQUd0RSxFQUFFLENBQUMsQ0FBQyxjQUFjLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzlCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNyQjtZQUFDLElBQUksQ0FBQyxDQUFDOztnQkFFTixJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RCxhQUFhLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO2dCQUN2QyxhQUFhLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBRS9CLGFBQWEsQ0FBQyxNQUFNLEdBQUc7b0JBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN0QixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQ3JCLENBQUM7Z0JBRUYsYUFBYSxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQVU7b0JBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN2RCxDQUFDO2dCQUVGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDckU7U0FDRixDQUFDLENBQUM7OztnQkF0RE4sVUFBVTs7OEJBTlg7O1NBT2EsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIFN1YmplY3QsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIGNvbmNhdEFsbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgU2NyaXB0U3RvcmUsIFNjcmlwdE1vZGVsIH0gZnJvbSAnLi9zY3JpcHQuc3RvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2NyaXB0TG9hZGVyU2VydmljZSB7XG4gIHByaXZhdGUgbG9hZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgZW1pdHRlcjogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgc2NyaXB0czogQXJyYXk8U2NyaXB0TW9kZWw+ID0gU2NyaXB0U3RvcmU7XG5cbiAgZ2V0Q2hhbmdlRW1pdHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcHVibGljIGxvYWQoKSB7XG4gICAgaWYgKHRoaXMubG9hZGVkKSB7IHJldHVybiB0aGlzOyB9XG5cbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxTY3JpcHRNb2RlbD5bXSA9IFtdO1xuXG4gICAgdGhpcy5zY3JpcHRzLmZvckVhY2goc2NyaXB0ID0+IG9ic2VydmFibGVzLnB1c2godGhpcy5sb2FkU2NyaXB0KHNjcmlwdCkpKTtcblxuICAgIG9mKC4uLm9ic2VydmFibGVzKS5waXBlKGNvbmNhdEFsbCgpKS5zdWJzY3JpYmUoe1xuICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLm5leHQodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBsb2FkU2NyaXB0KHNjcmlwdDogU2NyaXB0TW9kZWwpOiBPYnNlcnZhYmxlPFNjcmlwdE1vZGVsPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFNjcmlwdE1vZGVsPigob2JzZXJ2ZXI6IE9ic2VydmVyPFNjcmlwdE1vZGVsPikgPT4ge1xuICAgICAgY29uc3QgZXhpc3RpbmdTY3JpcHQgPSB0aGlzLnNjcmlwdHMuZmluZChzID0+IHMubmFtZSA9PT0gc2NyaXB0Lm5hbWUpO1xuXG4gICAgICAvLyBDb21wbGV0ZSBpZiBhbHJlYWR5IGxvYWRlZFxuICAgICAgaWYgKGV4aXN0aW5nU2NyaXB0ICYmIGV4aXN0aW5nU2NyaXB0LmxvYWRlZCkge1xuICAgICAgICBvYnNlcnZlci5uZXh0KGV4aXN0aW5nU2NyaXB0KTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIExvYWQgdGhlIHNjcmlwdFxuICAgICAgICBjb25zdCBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIHNjcmlwdEVsZW1lbnQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICBzY3JpcHRFbGVtZW50LnNyYyA9IHNjcmlwdC5zcmM7XG5cbiAgICAgICAgc2NyaXB0RWxlbWVudC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgc2NyaXB0LmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChzY3JpcHQpO1xuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2NyaXB0RWxlbWVudC5vbmVycm9yID0gKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcignQ291bGRuXFwndCBsb2FkIHNjcmlwdCAnICsgc2NyaXB0LnNyYyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19
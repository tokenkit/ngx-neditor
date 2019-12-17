/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { concatAll } from 'rxjs/operators';
import { ScriptStore } from './script.store';
export class ScriptLoaderService {
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
if (false) {
    /** @type {?} */
    ScriptLoaderService.prototype.loaded;
    /** @type {?} */
    ScriptLoaderService.prototype.emitter;
    /** @type {?} */
    ScriptLoaderService.prototype.scripts;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5vdGFkZC9uZ3gtbmVkaXRvci8iLCJzb3VyY2VzIjpbImxpYi9zY3JpcHQtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBWSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBVSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsV0FBVyxFQUFlLE1BQU0sZ0JBQWdCLENBQUM7QUFHMUQsTUFBTTs7c0JBQ2EsS0FBSzt1QkFDYyxJQUFJLE9BQU8sRUFBVzt1QkFDcEIsV0FBVzs7Ozs7SUFFakQsZ0JBQWdCO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDcEM7Ozs7SUFFTSxJQUFJO1FBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQUU7UUFFakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O1FBRW5CLE1BQU0sV0FBVyxHQUE4QixFQUFFLENBQUM7UUFFbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFFLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUM3QyxRQUFRLEVBQUUsR0FBRyxFQUFFO2dCQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQzs7Ozs7O0lBR1AsVUFBVSxDQUFDLE1BQW1CO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBYyxDQUFDLFFBQStCLEVBQUUsRUFBRTs7WUFDckUsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7WUFHdEUsRUFBRSxDQUFDLENBQUMsY0FBYyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM5QixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDckI7WUFBQyxJQUFJLENBQUMsQ0FBQzs7Z0JBRU4sTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkQsYUFBYSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztnQkFDdkMsYUFBYSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUUvQixhQUFhLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtvQkFDMUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3RCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDckIsQ0FBQztnQkFFRixhQUFhLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7b0JBQ3JDLFFBQVEsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN2RCxDQUFDO2dCQUVGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDckU7U0FDRixDQUFDLENBQUM7Ozs7WUF0RE4sVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0LCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBjb25jYXRBbGwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFNjcmlwdFN0b3JlLCBTY3JpcHRNb2RlbCB9IGZyb20gJy4vc2NyaXB0LnN0b3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNjcmlwdExvYWRlclNlcnZpY2Uge1xuICBwcml2YXRlIGxvYWRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGVtaXR0ZXI6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICBwcml2YXRlIHNjcmlwdHM6IEFycmF5PFNjcmlwdE1vZGVsPiA9IFNjcmlwdFN0b3JlO1xuXG4gIGdldENoYW5nZUVtaXR0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkKCkge1xuICAgIGlmICh0aGlzLmxvYWRlZCkgeyByZXR1cm4gdGhpczsgfVxuXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8U2NyaXB0TW9kZWw+W10gPSBbXTtcblxuICAgIHRoaXMuc2NyaXB0cy5mb3JFYWNoKHNjcmlwdCA9PiBvYnNlcnZhYmxlcy5wdXNoKHRoaXMubG9hZFNjcmlwdChzY3JpcHQpKSk7XG5cbiAgICBvZiguLi5vYnNlcnZhYmxlcykucGlwZShjb25jYXRBbGwoKSkuc3Vic2NyaWJlKHtcbiAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5uZXh0KHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgbG9hZFNjcmlwdChzY3JpcHQ6IFNjcmlwdE1vZGVsKTogT2JzZXJ2YWJsZTxTY3JpcHRNb2RlbD4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxTY3JpcHRNb2RlbD4oKG9ic2VydmVyOiBPYnNlcnZlcjxTY3JpcHRNb2RlbD4pID0+IHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nU2NyaXB0ID0gdGhpcy5zY3JpcHRzLmZpbmQocyA9PiBzLm5hbWUgPT09IHNjcmlwdC5uYW1lKTtcblxuICAgICAgLy8gQ29tcGxldGUgaWYgYWxyZWFkeSBsb2FkZWRcbiAgICAgIGlmIChleGlzdGluZ1NjcmlwdCAmJiBleGlzdGluZ1NjcmlwdC5sb2FkZWQpIHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChleGlzdGluZ1NjcmlwdCk7XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBMb2FkIHRoZSBzY3JpcHRcbiAgICAgICAgY29uc3Qgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgc2NyaXB0RWxlbWVudC5zcmMgPSBzY3JpcHQuc3JjO1xuXG4gICAgICAgIHNjcmlwdEVsZW1lbnQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgIHNjcmlwdC5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgIG9ic2VydmVyLm5leHQoc2NyaXB0KTtcbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNjcmlwdEVsZW1lbnQub25lcnJvciA9IChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoJ0NvdWxkblxcJ3QgbG9hZCBzY3JpcHQgJyArIHNjcmlwdC5zcmMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
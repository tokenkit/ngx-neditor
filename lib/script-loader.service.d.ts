import { Observable } from 'rxjs';
import { ScriptModel } from './script.store';
export declare class ScriptLoaderService {
    private loaded;
    private emitter;
    private scripts;
    getChangeEmitter(): Observable<boolean>;
    load(): this;
    loadScript(script: ScriptModel): Observable<ScriptModel>;
}

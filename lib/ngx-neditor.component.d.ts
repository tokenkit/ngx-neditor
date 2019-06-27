import { ElementRef, OnDestroy, EventEmitter, OnInit, ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ScriptLoaderService } from './script-loader.service';
import { NeditorConfig } from './neditor.config';
import { EventTypes } from './types';
export declare class NgxNeditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
    private sl;
    private el;
    private neConfig;
    private cd;
    private zone;
    private instance;
    private value;
    private inited;
    private events;
    private _disabled;
    private onTouched;
    private onChange;
    private ngUnsubscribe;
    loading: boolean;
    id: string;
    loadingTip: string;
    config: any;
    disabled: boolean;
    /** 延迟初始化 */
    delay: number;
    readonly neOnPreReady: EventEmitter<NgxNeditorComponent>;
    readonly neOnReady: EventEmitter<NgxNeditorComponent>;
    readonly neOnDestroy: EventEmitter<{}>;
    constructor(sl: ScriptLoaderService, el: ElementRef, neConfig: NeditorConfig, cd: ChangeDetectorRef, zone: NgZone);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private initDelay();
    private init();
    private destroy();
    private setDisabled();
    /**
     * 获取UE实例
     *
     * @readonly
     */
    readonly Instance: any;
    /**
     * 添加编辑器事件
     */
    addListener(eventName: EventTypes, fn: Function): void;
    /**
     * 移除编辑器事件
     */
    removeListener(eventName: EventTypes): void;
    ngOnDestroy(): void;
    writeValue(value: string): void;
    registerOnChange(fn: (_: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
    setDisabledState(isDisabled: boolean): void;
}

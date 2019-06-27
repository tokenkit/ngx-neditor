export interface NeditorOptions {
    [key: string]: any;
    /** 当你使用 `cdn` 时，属性必填，相当于整个 Ueditor 所需要语言、主题、对话框等根路径 */
    UEDITOR_HOME_URL: string;
    /** 服务器统一请求接口路径 */
    serverUrl?: string;
    /** 工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义 */
    toolbars?: string[][];
    /** 编辑器层级的基数,默认 `900` */
    zIndex?: number;
}
export declare class NeditorConfig {
    /**
     * Ueditor [前端配置项](http://fex.baidu.com/ueditor/#start-config)
     */
    options: NeditorOptions;
    /**
     * Hook
     * - 在 Ueditor 对象加载完成后执行
     * - 只执行一次
     */
    hook?: (ue: any) => void;
}

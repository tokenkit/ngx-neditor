/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function NeditorOptions() { }
/* TODO: handle strange member:
[key: string]: any;
*/
/**
 * 当你使用 `cdn` 时，属性必填，相当于整个 Ueditor 所需要语言、主题、对话框等根路径
 * @type {?}
 */
NeditorOptions.prototype.UEDITOR_HOME_URL;
/**
 * 服务器统一请求接口路径
 * @type {?|undefined}
 */
NeditorOptions.prototype.serverUrl;
/**
 * 工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
 * @type {?|undefined}
 */
NeditorOptions.prototype.toolbars;
/**
 * 编辑器层级的基数,默认 `900`
 * @type {?|undefined}
 */
NeditorOptions.prototype.zIndex;
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
export { NeditorConfig };
if (false) {
    /**
     * Ueditor [前端配置项](http://fex.baidu.com/ueditor/#start-config)
     * @type {?}
     */
    NeditorConfig.prototype.options;
    /**
     * Hook
     * - 在 Ueditor 对象加载完成后执行
     * - 只执行一次
     * @type {?}
     */
    NeditorConfig.prototype.hook;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVkaXRvci5jb25maWcuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abm90YWRkL25neC1uZWRpdG9yLyIsInNvdXJjZXMiOlsibGliL25lZGl0b3IuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQSxJQUFBOzs7Ozt1QkFJNEI7WUFDeEIsZ0JBQWdCLEVBQUUsd0NBQXdDO1NBQzNEOzt3QkFsQkg7SUEwQkMsQ0FBQTtBQWRELHlCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBOZWRpdG9yT3B0aW9ucyB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbiAgLyoqIOW9k+S9oOS9v+eUqCBgY2RuYCDml7bvvIzlsZ7mgKflv4XloavvvIznm7jlvZPkuo7mlbTkuKogVWVkaXRvciDmiYDpnIDopoHor63oqIDjgIHkuLvpopjjgIHlr7nor53moYbnrYnmoLnot6/lvoQgKi9cbiAgVUVESVRPUl9IT01FX1VSTDogc3RyaW5nO1xuICAvKiog5pyN5Yqh5Zmo57uf5LiA6K+35rGC5o6l5Y+j6Lev5b6EICovXG4gIHNlcnZlclVybD86IHN0cmluZztcbiAgLyoqIOW3peWFt+agj+S4iueahOaJgOacieeahOWKn+iDveaMiemSruWSjOS4i+aLieahhu+8jOWPr+S7peWcqG5ld+e8lui+keWZqOeahOWunuS+i+aXtumAieaLqeiHquW3semcgOimgeeahOS7juaWsOWumuS5iSAqL1xuICB0b29sYmFycz86IHN0cmluZ1tdW107XG4gIC8qKiDnvJbovpHlmajlsYLnuqfnmoTln7rmlbAs6buY6K6kIGA5MDBgICovXG4gIHpJbmRleD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIE5lZGl0b3JDb25maWcge1xuICAvKipcbiAgICogVWVkaXRvciBb5YmN56uv6YWN572u6aG5XShodHRwOi8vZmV4LmJhaWR1LmNvbS91ZWRpdG9yLyNzdGFydC1jb25maWcpXG4gICAqL1xuICBvcHRpb25zOiBOZWRpdG9yT3B0aW9ucyA9IHtcbiAgICBVRURJVE9SX0hPTUVfVVJMOiAnLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Bub3RhZGQvbmVkaXRvci8nXG4gIH07XG5cbiAgLyoqXG4gICAqIEhvb2tcbiAgICogLSDlnKggVWVkaXRvciDlr7nosaHliqDovb3lrozmiJDlkI7miafooYxcbiAgICogLSDlj6rmiafooYzkuIDmrKFcbiAgICovXG4gIGhvb2s/OiAodWU6IGFueSkgPT4gdm9pZDtcbn1cbiJdfQ==
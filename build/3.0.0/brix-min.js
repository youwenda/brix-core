KISSY.add("brix/app",function(a,b,c){function d(){d.superclass.constructor.call(this)}a.extend(d,a.Base),d.ATTRS={prepared:!1},a.augment(d,b,{boot:function(){return this.prepare(),c.boot.apply(this,arguments)},bootStyle:function(b){this.prepare(),a.use(this.bxComboStyle().join(","),b)},prepare:function(){this.get("prepared")||(this.bxMapImports(),this.bxMapComponents(),this.bxPackageImports(),this.bxPackageComponents(),this.set("prepared",!0))}});var e=new d;return e},{requires:["brix/app/config","brix/base","base"]}),KISSY.add("brix/app/config",function(a){function b(a){var b=a.split("/");this.version=b[0],this.assets=b[1]||"all"}a.augment(b,{naked:function(a){return!this.requires(a)},requires:function(a){return"all"===this.assets||this.assets===a},toString:function(){return this.version}});var c={configData:{debug:!0,base:".",imports:{},importsBase:"http://g.tbcdn.cn/thx/m",components:null,namespace:null,timestamp:null},config:function(b,c){var d=this.configData;if(a.isPlainObject(b))c=b,b=null;else if(a.isString(b)){if("undefined"==typeof c)return d[b];var e={};e[b]=c,c=e}return c&&(a.mix(d,c),"components"in c&&this.bxResolveComponents(),"imports"in c&&this.bxResolveImports()),this},bxResolveComponents:function(){var c,d=this.config("components");if(a.isString(d))c=d;else{for(c in d);var e=d[c];if(a.isPlainObject(e))for(var f in e)e[f]=new b(e[f])}this.config("namespace",c)},bxResolveImports:function(){var a=this.config("imports");for(var c in a){var d=a[c];for(var e in d)d[e]=new b(d[e])}},bxMapImports:function(){this.bxMapModules(this.config("imports"))},bxMapComponents:function(){var b=this.config("timestamp"),c=this.config("namespace"),d=this.config("components");if(b&&c){var e=function(a,d,e){return[c,b,d,e].join("/")};a.config("map",[[new RegExp(c+"\\/([^\\/]+)\\/([^\\/]+)$"),e]])}else a.isPlainObject(d)&&this.bxMapModules(d)},bxMapModules:function(b){function c(a){return function(c,d,e){return[a,d,b[a][d],e].join("/")}}var d=[];for(var e in b)d.push([new RegExp(e+"\\/([^\\/]+)\\/([^\\/]+)$"),c(e)]);a.config("map",d)},bxPackageImports:function(){var b=this.config("imports"),c=this.config("importsBase"),d=a.config("ignorePackageNameInUri"),e={};for(var f in b)e[f]={base:c+(d?"/"+f:"")};a.config("packages",e)},bxPackageComponents:function(){var b=this.config("namespace");if(!a.config("packages")[b]){var c=this.config("base"),d=a.config("ignorePackageNameInUri"),e={};e[b]={base:c+(d?"/"+b:"")},a.config("packages",e)}},bxComboStyle:function(){var b,c=this.config("imports")||{},d=[],e=function(a,b){for(var c in b)b[c].requires("css")&&d.push([a,c,"index.css"].join("/"))};for(b in c)e(b,c[b]);var f=this.config("components");if(b=this.config("namespace"),f=f[b],a.isPlainObject(f))e(b,f);else if(a.isArray(f))for(var g=0;g<f.length;g++)d.push([b,f[g],"index.css"].join("/"));return d}};return c}),KISSY.add("brix/base",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var o=a.noop,p=a.DOM,q=["remove","empty"],r=m.extend({initializer:function(){var b=this,c=b.get("el");b.set("id",c.attr("id"),{silent:!0}),b.get("name")||b.set("name",c.attr("bx-name"),{silent:!0});var d=new l.Defer,e=d.promise;e=e.then(function(){return b.bxGetData()}).then(function(){return b.bxAfterGetData()}).then(function(){return b.bxBuildData()}).then(function(){return b.bxGetTpl()}).then(function(){return b.bxAfterGetTpl()}).then(function(){return b.bxBuildTpl()}).then(function(){return b.bxRender()}),b.get("passive")||e.then(function(){return b.bxActivate()}),a.later(function(){d.resolve(!0)},0)},bind:o,sync:o,bxGetTpl:function(){var a=new l.Defer,b=this;return b.bxHandleTpl(function(b){a.resolve(b)}),a.promise.then(function(a){b.set("tpl",a)}),a.promise},bxAfterGetTpl:function(){var a=this,b=new l.Defer,c=a.fire("getTpl",{next:function(a){b.resolve(a)}});return b.promise.then(function(b){a.set("tpl",b)}),c?b.promise:void 0},bxBuildTpl:function(){return this.bxIBuildTpl?this.bxIBuildTpl():void 0},bxGetData:function(){var a=new l.Defer,b=this;return b.bxHandleRemote(function(b){a.resolve(b)}),a.promise.then(function(a){b.set("data",a)}),a.promise},bxAfterGetData:function(){var a=new l.Defer,b=this,c=b.fire("getData",{next:function(b){a.resolve(b)}});return a.promise.then(function(a){b.set("data",a)}),c?a.promise:void 0},bxBuildData:function(){var a=this,b=a.get("data");return b?!0:void 0},bxRender:function(){var b=this;if(b.get("autoRender")&&!b.get("rendered")){var c=new l.Defer;b.fire("beforeRender");var d=b.get("tpl"),e=b.get("el");if(d){var f=a.trim(b.bxRenderTpl(d,b.get("data")));e.html(f)}return b.bxDelegate(),b.once("rendered",function(){b.fire("afterRender"),c.resolve()}),b.bxHandleName(e,function(){b.setInternal("rendered",!0),b.fire("rendered")}),c.promise}},bxRenderTpl:function(a,b){var c=this,d=c.get("TplEngine");if("function"==typeof d){var e=c.get("commands");return new d(a,{commands:e||{}}).render(b)}return d.render(a,b)},bxActivate:function(){function b(){d.setInternal("ready",!0),d.fire("ready")}function c(){++g===f&&b()}var d=this;if(d.get("autoActivate")&&!d.get("activated")&&d.get("rendered")){d.bxBind(),d.bxSync(),d.bxIActivate&&d.bxIActivate(),d.setInternal("activated",!0);for(var e=d.get("children"),f=e.length,g=0,h=0;h<e.length;h++){var i=e[h];i.once("ready",c),i.bxActivate()}e&&0!==e.length||a.later(b,0)}},bxBind:function(){var a=this;a.fire("beforeBind"),a.constructor.superclass.bindInternal.call(a),a.callMethodByHierarchy("bind","__bind"),a.fire("afterBind")},bxSync:function(){var a=this;a.fire("beforeSync"),r.superclass.syncInternal.call(a),a.callMethodByHierarchy("sync","__sync"),a.fire("afterSync")},destructor:function(){var b,c=this,d=c.get("children");for(b=d.length-1;b>=0;b--)d[b].destroy();c.set("children",[]);var e=c.get("parent");if(e){var f=e.get("children"),g=c.get("id");for(b=f.length-1;b>=0;b--)if(f[b].get("id")===g){f.splice(b,1);break}}if(c.get("rendered")){var h=c.get("el");if(c.bxUndelegate(),h&&p.contains(document,h[0])){var i=c.get("destroyAction");a.inArray(i,q)&&h[i]()}}c.set("destroyed",!0)},boot:function(){return this.constructor.boot.apply(this,arguments)},fire:function(a,b,c){var d=r.superclass.fire.apply(this,arguments),e=this.get("parent");if(e)if(c=c||this,c===this){var f="#"+c.get("id")+"_"+a,g=c.get("name")+"_"+a;e.fire(f,b,c),e.fire(g,b,c)}else e.fire(a,b,c);return d},once:function(a,b,c){var d=this,e=function(){d.detach(a,e),b.apply(this,arguments)};d.on(a,e,c)},dirtyCheck:function(a){var b=this,c=b.get("watcher");if("function"!=typeof a&&(a=b[a]),!a)throw new Error("没有找到对应的函数");a.apply(b,Array.prototype.slice.call(arguments,1)),c.digest()}},{ATTRS:a.mix({tpl:{value:null},data:{value:{}},rendered:{value:!1},activated:{value:!1},el:{getter:function(b){return a.isString(b)&&(b=a.one(b)),b},setter:function(b){if(a.isString(b)&&(b=a.one(b)),!b.attr("id")){for(var c;(c=a.guid("brix-brick-"))&&a.one("#"+c););b.attr("id",c)}return"#"+b.attr("id")}},id:{value:null},name:{value:null},autoRender:{value:!0},autoActivate:{value:!0},passive:{value:!1},config:{value:{}},TplEngine:{value:n},destroyed:{value:!1},destroyAction:{value:"none"},events:{},children:{value:[]},parent:{value:!1},watcher:{value:new k}},c.ATTRS)},"Brick");return a.augment(r,d,e,f,g,h,i,j,c.METHODS),a.mix(r,{boot:function(b,c){var d;if(a.isPlainObject(b)?b.el?(c=null,d=b):d={data:b,el:"[bx-app]"}:d=a.isString(b)?{el:b,data:c}:{},b=d.el,(!b||a.isString(b))&&(b=a.one(b||"[bx-app]")),!b)throw new Error("Cannot find el!");d.el=b,d.parent=this;var e=this.get("children");e||(e=[],this.set("children",e));var f=new r(d);return e.push(f),f}}),r},{requires:["brix/app/config","brix/interface/index","brix/core/bx-util","brix/core/bx-tpl","brix/core/bx-name","brix/core/bx-event","brix/core/bx-delegate","brix/core/bx-config","brix/core/bx-remote","brix/core/bx-watcher","promise","rich-base","xtemplate","node","event","sizzle"]}),KISSY.add("brix/core/bx-config",function(a){var b={bxHandleConfig:function(a,b){var c=a.attr("bx-config");return c?new Function("return "+c)():{}},bxCastString:function(b){return b=a.trim(b),/^(?:true|false)$/.test(b)?"true"===b:/^\d+$/.test(b)?parseInt(b,10):b}};return b}),KISSY.add("brix/core/bx-delegate",function(){var a={delegate:function(a,b,c,d){this.on(a+"_"+b,c,d)},undelegate:function(a,b,c,d){this.detach(a+"_"+b,c,d)}};return a},{requires:["event"]}),KISSY.add("brix/core/bx-event",function(a){var b={bxDelegate:function(){for(var a=this.constructor;a;)this.bxDelegateMap(a.EVENTS),a=a.superclass?a.superclass.constructor:null;var b=this.get("events");b&&this.bxDelegateMap(b)},bxDelegateMap:function(b){function c(a){return function(){arguments[0].brixData=f.get("data"),a.apply(this,arguments),h.digest()}}var d,e,f=this,g=this.get("el"),h=this.get("watcher"),i=a.Event;for(var j in b){var k=b[j];for(var l in k)d=k[l],d.handle=c(d),e=d.handle,"self"===j?g.on(l,e,this):"window"===j?i.on(window,l,e,this):"body"===j?i.on("body",l,e,this):"document"===j?i.on(document,l,e,this):g.delegate(l,j,e,this)}},bxUndelegate:function(){for(var a=this.constructor;a;)this.bxUndelegateMap(a.EVENTS),a=a.superclass?a.superclass.constructor:null;var b=this.get("events");b&&this.bxUndelegateMap(b)},bxUndelegateMap:function(b){var c,d=this.get("el"),e=a.Event;for(var f in b){var g=b[f];for(var h in g)c=g[h].handle,"self"===f?d.detach(h,c,this):"window"===f?e.detach(window,h,c,this):"body"===f?e.detach("body",h,c,this):"document"===f?e.detach(document,h,c,this):d.undelegate(h,f,c,this),c=null,delete g[h].handle}}};return b},{requires:["event"]}),KISSY.add("brix/core/bx-name",function(a,b){var c={bxHandleName:function(c,d,e){c=b(c);var f,g,h,i=this.bxDirectChildren(c),j=this.get("children")||[];for(f=i.length-1;f>=0;f--)for(h=i[f],g=0;g<j.length;g++)j[g].get("id")===h.attr("id")&&i.splice(f,1);var k=0,l=0,m=this,n=i.length;if(0===n)a.later(function(){d(),e&&e()},0);else{var o,p,q=[],r=function(){++k===n&&d()},s=e&&function(){++l===n&&e()};for(f=0;n>f;f++)h=b(i[f]),o=h.hasAttr("bx-naked")&&(h.attr("bx-naked")||"all"),p=h.attr("bx-name"),q[f]="js"===o||"all"===o?"brix/base":p.split("/").length>2?p:p+"/index";KISSY.use(q.join(","),function(a){var b=a.makeArray(arguments);b.shift();for(var c=0;c<b.length;c++)m.bxInstantiate(i[c],b[c],r,s)})}},bxInstantiate:function(b,c,d,e){var f=this,g=a.DOM,h=function(){d(),e&&e()};if(!a.isFunction(c))return h(),void 0;if(!b||!g.contains(document,b[0]))return h(),void 0;var i=f.bxHandleConfig(b,c),j=b.attr("bx-tag");a.mix(i,{el:b,name:b.attr("bx-name"),parent:f,passive:!e,tag:j,brickTpl:j?f.get("brickTpls")[j].middle:null});for(var k=f;k;){var l=k.get("config");l&&(a.mix(i,l[b.attr("id")]),a.mix(i,l[b.attr("name")])),k=k.get("parent")}var m=new c(i),n=f.get("children");n||(n=[],f.set("children",n)),n.push(m),m.bxRender?(m.once("rendered",d),e&&m.once("ready",e)):h(),b=n=null},bxDirectChildren:function(a,b){var c=[],d=this.get("name");return b=b||"[bx-name]",a.all(b).each(function(a){var b=a.parent("[bx-name]");b&&b.attr("bx-name")!==d||c.push(a)}),c},find:function(a){for(var b=this.get("children"),c=a.indexOf("/")>0,d="#"===a.charAt(0),e=0;e<b.length;e++){var f=b[e];if(c&&f.get("name")===a)return f;if(d&&"#"+f.get("id")===a)return f}}};return c},{requires:["node","sizzle","event"]}),KISSY.add("brix/core/bx-remote",function(a,b,c,d){var e={bxHandleRemote:function(c){var e=this,f=e.get("el"),g=e.get("data");if(g)return c(g);var h=f.attr("bx-remote");if(/^http/.test(h)){var i=new d(h);i.isSameOriginAs(new d(location.href))||e.bxJsonpRemote(i,c)}else{if(!/^\.\//.test(h))return c();var j=e.get("name"),k=j.replace(/\/?$/,"")+h.substr(1);b.config("debug")?e.bxXhrRemote(k,c):a.use(k,function(a,b){c(b)})}},bxJsonpRemote:function(a,b){for(var d,e=a.getQuery(),f=e.keys(),g=0;g<f.length;g++){var h=f[g];if("callback"===h||"callback"===e.get(h)){d=h,e.remove(h);break}}c({dataType:"jsonp",url:a.toString(),jsonp:d,success:b})},bxXhrRemote:function(a,b){if(!/^http/.test(location.href))throw Error("Cannot load data.json via xhr in current mode.");c.get(this.bxResolveModule(a,".json"),b)}};return e},{requires:["brix/app/config","ajax","uri"]}),KISSY.add("brix/core/bx-tpl",function(a,b,c){var d={bxHandleTpl:function(a){var b=this,c=b.get("el"),d=b.get("tpl")||c.attr("bx-tpl");if(d)if("#"===d.charAt(0))b.bxScriptTpl(d,a);else if("."===d)b.bxHereTpl(c,a);else if(/^\.\//.test(d))b.bxRemoteTpl(c.attr("bx-name").replace(/\/?$/,"")+d.substr(1),a);else if("cached"===d){for(var e=!1,f=c;(f=f.parent())&&f!==c;){if(f.attr("bx-each")){e=!0;break}if(f.attr("bx-name"))break}var g=b.get("parent").get("subTplsCache");a(e?g[0]:g.shift())}else a(d);else a()},bxScriptTpl:function(b,c){c(a.one(b).html())},bxHereTpl:function(a,b){b(a.html())},bxRemoteTpl:function(c,d){b.config("debug")?this.bxXhrTpl(c,d):a.use(c+".tpl",function(a,b){d(b)})},bxXhrTpl:function(a,b){if(!/^http/.test(location.href))throw Error("Cannot load tpl via xhr in current mode.");c.get(this.bxResolveModule(a,".html"),b)}};return d},{requires:["brix/app/config","ajax","node","sizzle"]}),KISSY.add("brix/core/bx-util",function(a,b){var c={bxResolveModule:function(c,d){var e=c.split("/"),f=e.shift(),g=e.shift(),h=e.shift(),i=a.config("packages")[f].base,j=b.config("components"),k=b.config("imports"),l=a.config("packages"),m=l[f]&&l[f].ignorePackageNameInUri;return m||e.push(f),e.push(g),k&&k[f]?e.push(k[f][g]):j&&a.isPlainObject(j[f])&&e.push(j[f][g]),e.push(h+d),i+e.join("/")}};return c},{requires:["brix/app/config"]}),KISSY.add("brix/core/bx-watcher",function(a,b){function c(a){var b=f[a];return b||(b=f[a]=new Function("context","locals","with(context){if(typeof "+a+' ==="undefined"){return}else{return '+a+"}}")),b}function d(a,b){return function(){var c=b.indexOf(a);c>-1&&b.splice(c,1)}}function e(){this.watchers=[],this.checking=!1}var f={};return e.prototype.watch=function(e,f,g){var h,i="function"==typeof f?function(){return f(e)}:c(f),j=i(e);return(a.isArray(j)||a.isObject(j))&&(j=b.stringify(j)),h={value:i,context:e,last:j,callback:g,expression:f},this.watchers.push(h),d(h,this.watchers)},e.prototype.digest=function(){var c,d,e,f,g,h=10;if(this.checking)throw new Error("Digest phase is already started");this.checking=!0;do for(c=!0,d=-1,e=this.watchers.length;++d<e;){f=this.watchers[d],g=f.value(f.context);var i=g;(a.isArray(i)||a.isObject(i))&&(i=b.stringify(i)),i!==f.last&&(f.callback(g,f.last),f.last=i,c=!1)}while(!c&&h--);if(!h)throw new Error("Too much iterations per digest");this.checking=!1},e.parse=c,e},{requires:["json"]}),KISSY.add("brix/interface/index",function(a){var b={};return b.METHODS={bxIBuildTpl:function(){var a=this,b=a.get("tpl");a.bxWatcherKeys={};var c;if(b)b=a.bxITag(b),b=a.bxISubTpl(b),a.bxIBuildStoreTpls(b),a.set("tpl",b),c=a.bxIBuildBrickTpls(b);else{var d=a.get("brickTpl");d&&(c=a.bxIBuildBrickTpls(d))}c&&(a.bxISelfCloseTag(c),a.bxIBuildSubTpls(c)),delete a.bxWatcherKeys},bxIActivate:function(){var a=this,b=0,c=0;a.on("beforeRefreshTpl",function(d){if(b++,c++,"html"===d.renderType)for(var e=a.bxDirectChildren(d.node),f=0;f<e.length;f++){var g=a.find("#"+e[f].attr("id"));g&&g.destroy()}}),a.on("afterRefreshTpl",function(d){a.bxHandleName(d.node,function(){0===--b&&(a.setInternal("rendered",!0),a.fire("rendered"))},function(){0===--c&&(a.setInternal("activated",!0),a.fire("ready"))})})},bxIBuildStoreTpls:function(a){var b=this,c=b.get("storeTpls"),d=/\{\{#bx\-store\-tpl\-([^\}]*)?\}\}([\s\S]*?)\{\{\/bx\-store\-tpl\}\}/gi;return a=a.replace(d,function(a,b,d){return c[b]=d,""})},bxITag:function(b){return b.replace(/(bx-tag=["'][^"']+["'])/gi,"").replace(/(bx-name=["'][^"']+["'])/gi,function(b){return b+' bx-tag="brix_tag_'+a.guid()+'"'})},bxISubTpl:function(b){return b.replace(/(bx-subtpl=["'][^"']+["'])/gi,"").replace(/(bx-datakey=["'][^"']+["'])/gi,function(b){return'bx-subtpl="brix_subtpl_'+a.guid()+'" '+b})},bxIBuildBrickTpls:function(a){for(var b=this,c="(<([\\w]+)\\s+[^>]*?bx-name=[\"']([^\"']+)[\"']\\s+bx-tag=[\"']([^\"']+)[\"']\\s*[^>]*?>)(@brix@)(</\\2>)",d=b.get("brickTpls"),e=b.get("level");e--;)c=c.replace("@brix@","(?:<\\2[^>]*>@brix@</\\2>|[\\s\\S])*?");c=c.replace("@brix@","(?:[\\s\\S]*?)");var f=new RegExp(c,"ig");return a=a.replace(f,function(a,b,c,e,f,g,h){return d[f]={start:b,middle:g,end:h},"@brix@"+f+"@brix@"})},bxIStoreAttrs:function(a){var b={},c=function(a,c,d){d.indexOf("{{")>-1&&d.indexOf("}}")>0&&(b[c]=d)};return a.replace(/([^\s]+)?=["']([^'"]+)["']/gi,c),b},bxIAddWatch:function(a){var b=this,c=b.get("watcher"),d=b.get("data"),e=function(a){c.watch(d,a,function(){b.bxIRefreshTpl([a],b.get("data"),"html")})};if(d)for(var f=a.split(","),g=0;g<f.length;g++){var h=f[g];b.bxWatcherKeys[h]||(b.bxWatcherKeys[h]=!0,e(h))}},bxIBuildSubTpls:function(a){for(var b=this,c=b.get("subTpls"),d=b.get("brickTpls"),e=b.get("level"),f="(<([\\w]+)\\s+[^>]*?bx-subtpl=[\"']([^\"']+)[\"']\\s+bx-datakey=[\"']([^\"']+)[\"']\\s*[^>]*?>)(@brix@)</\\2>";e--;)f=f.replace("@brix@","(?:<\\2[^>]*>@brix@</\\2>|[\\s\\S])*?");f=f.replace("@brix@","(?:[\\s\\S]*?)");for(var g,h=new RegExp(f,"ig"),i=function(a,b){var c=d[b];return c.start+c.middle+c.end};null!==(g=h.exec(a));){var j=g[4];c.push({name:g[3],datakey:j,tpl:g[5].replace(/@brix@(brix_tag_\d+)@brix@/gi,i),attrs:b.bxIStoreAttrs(g[1])}),b.bxIAddWatch(j),b.bxIBuildSubTpls(g[5])}},bxISelfCloseTag:function(a){for(var b,c=this,d=c.get("subTpls"),e="(<(input|img)\\s+[^>]*?bx-subtpl=[\"']([^\"']+)[\"']\\s+bx-datakey=[\"']([^\"']+)[\"']\\s*[^>]*?/?>)",f=new RegExp(e,"ig");null!==(b=f.exec(a));){var g=b[4];d.push({name:b[3],datakey:g,attrs:c.bxIStoreAttrs(b[1])}),c.bxIAddWatch(g)}},bxIRefreshTpl:function(b,c,d){var e=this;if(e.get("rendered")){var f=e.get("el"),g=e.get("subTpls");a.each(g,function(g){for(var h=a.map(g.datakey.split(","),function(b){return a.trim(b)}),i=!1,j=0;j<h.length;j++)for(var k=0;k<b.length;k++)if(h[j]==b[k]){i=!0;break}if(i){var l=f.all("[bx-subtpl="+g.name+"]");f.attr("bx-subtpl")==g.name&&(l=f.add(l)),l.each(function(b){g.tpl&&(e.fire("beforeRefreshTpl",{node:b,renderType:d}),"html"==d&&b.empty(),b[d](a.trim(e.bxRenderTpl(g.tpl,c))),e.fire("afterRefreshTpl",{node:b,renderType:d})),a.each(g.attrs,function(d,f){var g=a.trim(e.bxRenderTpl(d,c));"INPUT"==b[0].tagName.toUpperCase&&"value"==f?b.val(g):b.attr(f,g)})})}});for(var h=e.get("children"),i=0;i<h.length;i++){var j=h[i];j.get("refresh")||(j.set("refresh",!0),j.get("data")||(j.bxIRefreshTpl(b,c,d),i=0))}a.each(h,function(a){a.set("refresh",!1)})}},setChunkData:function(b,c,d){for(var e,f=this,g=f;g&&(!(e=g.get("data"))||!e);)g=g.get("parent");e||(e={},g=f);var h=[];if(a.isObject(b)){for(var i in b)e[i]=b[i],h.push(i);d=c}else h=[b],e[b]=c;var j="html";d&&d.renderType&&(j=d.renderType,delete d.renderType),g.set("data",e,d),d&&d.silent||f.bxIRefreshTpl(h,e,j)}},b.ATTRS={subTpls:{value:[]},storeTpls:{value:[]},level:{value:4},brickTpl:{value:!1},brickTpls:{value:{}}},b});
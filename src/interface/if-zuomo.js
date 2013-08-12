KISSY.add('brix/interface/if-zuomo', function(S, Util) {
    //var KEYS = ['name', 'tpl', 'subtpl', 'datakey', 'tag', 'remote', 'config', 'app']

    var exports = {}

    exports.METHODS = {
        bxIBuildTpl: function() {
            var self = this
            var tpl = self.get('tpl')
            //存储监听的数据key
            self.bxWatcherKeys = {}
            //延迟刷新存储的key
            self.bxRefreshKeys = []
            var tempTpl
            if (tpl) {
                var data = self.get('data');
                if (!data) {
                    //有模板必然有数据
                    self.set('data', {}, {
                        silent: true
                    });
                }
                tpl = self.bxITag(tpl)
                tpl = self.bxISubTpl(tpl)
                //存储模板
                self.bxIBuildStoreTpls(tpl)
                self.set('tpl', tpl)
                tempTpl = self.bxIBuildBrickTpls(tpl)


            } else {
                var brickTpl = self.get('brickTpl')
                if (brickTpl) {
                    tempTpl = self.bxIBuildBrickTpls(brickTpl)
                }
            }
            if (tempTpl) {
                self.bxISelfCloseTag(tempTpl)
                self.bxIBuildSubTpls(tempTpl)
            }
        },

        bxIActivate: function() {
            var self = this
            var needRenderCounter = 0
            var needActivateCounter = 0

            // 局部刷新事件监听
            self.on('beforeRefreshTpl', function(e) {

                needRenderCounter++
                needActivateCounter++
                
                if (e.renderType === 'html') {
                    var children = self.bxDirectChildren(e.node)

                    for (var i = 0; i < children.length; i++) {
                        var brick = self.find('#' + children[i].attr('id'))
                        //这个组件如果没有触发rendered和ready事件，移除会有问题
                        if (brick) brick.destroy()
                    }
                }
            })

            self.on('afterRefreshTpl', function(e) {
                //S.log('afterRefreshTpl_xx')
                self.bxHandleName(
                    e.node, function renderedCheck() {
                        //debugger
                        //S.log('afterRefreshTpl_'+needRenderCounter)
                        if (--needRenderCounter === 0) {
                            self.setInternal('rendered', true)
                            self.fire('rendered')
                        }
                    }, function activatedCheck() {
                        if (--needActivateCounter === 0) {
                            self.setInternal('activated', true)
                            self.fire('ready')
                        }
                    })
            })
        },

        /**
         * 构建{{#bx-store-tpl-id}}……{{/bx-store-tpl}}的存储
         * @param  {String} tpl 需要解析的模板
         * @return {String}      解析后的模板
         */
        bxIBuildStoreTpls: function(tpl) {
            var self = this
            var storeTpls = self.get('storeTpls')
            var storeTplRegexp = /\{\{#bx\-store\-tpl\-([^\}]*)?\}\}([\s\S]*?)\{\{\/bx\-store\-tpl\}\}/ig

            tpl = tpl.replace(storeTplRegexp, function(g, id, html) {
                storeTpls[id] = html
                return ''
            })
            return tpl
        },

        /**
         * 为模板中的组件打上tag标识
         * @param  {String} tpl 模板
         * @return {String}      替换后的模板
         */
        bxITag: function(tpl) {
            return tpl.replace(/(bx-tag=["'][^"']+["'])/ig, '')
                .replace(/(bx-name=["'][^"']+["'])/ig, function(match) {
                    return match + ' bx-tag="brix_tag_' + S.guid() + '"'
                })
        },

        /**
         * 为bx-datakey自动生成bx-subtpl
         * @param  {String} tpl 模板
         * @return {String}      替换后的模板
         */
        bxISubTpl: function(tpl) {
            return tpl.replace(/(bx-subtpl=["'][^"']+["'])/ig, '')
                .replace(/(bx-datakey=["'][^"']+["'])/ig, function(match) {
                    return 'bx-subtpl="brix_subtpl_' + S.guid() + '" ' + match
                })
        },

        bxIBuildBrickTpls: function(tpl) {
            var self = this
            var r = '(<([\\w]+)\\s+[^>]*?bx-name=["\']([^"\']+)["\']\\s+bx-tag=["\']([^"\']+)["\']\\s*[^>]*?>)(@brix@)(</\\2>)'
            var brickTpls = self.get('brickTpls')
            var level = self.get('level')
            while (level--) {
                r = r.replace('@brix@', '(?:<\\2[^>]*>@brix@</\\2>|[\\s\\S])*?')
            }
            r = r.replace('@brix@', '(?:[\\s\\S]*?)')
            var reg = new RegExp(r, "ig")
            tpl = tpl.replace(reg, function(all, start, tag, name, bx, middle, end) {
                brickTpls[bx] = {
                    start: start,
                    middle: middle,
                    end: end
                }
                //占位符
                return '@brix@' + bx + '@brix@'
            })
            return tpl
        },
        /**
         * 获取属性模板
         * @param  {String} str 模板
         * @return {Object}   存储对象
         * @private
         */
        bxIStoreAttrs: function(str) {
            var attrs = {}
            var storeAttr = function(all, attr, tpl) {
                if (tpl.indexOf('{{') > -1 && tpl.indexOf('}}') > 0) {
                    attrs[attr] = tpl
                }
            }
            str.replace(/([^\s]+)?=["']([^'"]+)["']/ig, storeAttr)
            return attrs;
        },
        /**
         * 添加数据监听
         * @param  {String} datakey 监听的key字符串"key1,key2"
         * @private
         */
        bxIAddWatch: function(datakey) {
            var self = this
            var obj = Util.bxGetAncestor(self)
            var data = obj.data
            var ancestor = obj.ancestor
            if (data) {
                var watch = function(key) {
                    ancestor.watch(data, key, function() {
                        if (!S.inArray(key, ancestor.bxRefreshKeys)) {
                            ancestor.bxRefreshKeys.push(key)
                        }
                        //这个再看，不知道为什么，这个会引起ready事件的触发出错
                        if (ancestor.bxLaterTimer) {
                            S.log('bxLaterTimer_' + S.guid())
                            ancestor.bxLaterTimer.cancel();
                            delete ancestor.bxLaterTimer
                        }
                        ancestor.bxLaterTimer = S.later(function() {
                            S.log('bxIRefreshTpl_' + S.guid())
                            ancestor.bxIRefreshTpl(ancestor.bxRefreshKeys, data, 'html')
                            ancestor.bxRefreshKeys = [];
                        }, 100)
                    })
                }
                var temparr = datakey.split(',')
                for (var i = 0; i < temparr.length; i++) {
                    var key = temparr[i]
                    if (!ancestor.bxWatcherKeys[key]) {
                        ancestor.bxWatcherKeys[key] = true;
                        watch(key);
                    }
                }
            }
        },

        /**
         * 对节点中的bx-tpl和bx-datakey解析，构建模板和数据配置
         * @param {String} tpl  需要解析的模板
         * @private
         */
        bxIBuildSubTpls: function(tpl) {
            var self = this
            var subTpls = self.get('subTpls')
            var brickTpls = self.get('brickTpls')
            var level = self.get('level')

            var r = '(<([\\w]+)\\s+[^>]*?bx-subtpl=["\']([^"\']+)["\']\\s+bx-datakey=["\']([^"\']+)["\']\\s*[^>]*?>)(@brix@)</\\2>'
            while (level--) {
                r = r.replace('@brix@', '(?:<\\2[^>]*>@brix@</\\2>|[\\s\\S])*?')
            }
            r = r.replace('@brix@', '(?:[\\s\\S]*?)')

            var reg = new RegExp(r, "ig")
            var m
            var replacer = function(all, bx) {
                var o = brickTpls[bx]
                return o.start + o.middle + o.end
            }

            while ((m = reg.exec(tpl)) !== null) {
                var datakey = m[4]
                subTpls.push({
                    name: m[3],
                    datakey: datakey,
                    tpl: m[5].replace(/@brix@(brix_tag_\d+)@brix@/ig, replacer),
                    attrs: self.bxIStoreAttrs(m[1])
                })
                self.bxIAddWatch(datakey)
                //递归编译子模板
                self.bxIBuildSubTpls(m[5])
            }
        },
        /**
         * 子闭合标间的处理
         * @param  {String} tpl 模板
         */
        bxISelfCloseTag: function(tpl) {
            var self = this
            var subTpls = self.get('subTpls')

            var r = '(<(input|img)\\s+[^>]*?bx-subtpl=["\']([^"\']+)["\']\\s+bx-datakey=["\']([^"\']+)["\']\\s*[^>]*?/?>)'
            var reg = new RegExp(r, "ig")
            var m
            while ((m = reg.exec(tpl)) !== null) {
                var datakey = m[4]
                subTpls.push({
                    name: m[3],
                    datakey: datakey,
                    attrs: self.bxIStoreAttrs(m[1])
                })
                self.bxIAddWatch(datakey)
            }
        },

        /**
         * 局部刷新
         * @param  {String} subTplName 子模板名称或id，这个待定
         * @param  {Object} data 数据
         * @param  {String} renderType 渲染方式，目前支持html，append，prepend
         * @private
         */
        bxIRefreshTpl: function(keys, data, renderType) {
            var self = this

            if (!self.get('rendered')) {
                return
            }
            var el = self.get('el')
            var subTpls = self.get('subTpls')

            S.each(subTpls, function(o) {
                var datakeys = S.map(o.datakey.split(','), function(str) {
                    return S.trim(str) //修复编辑器格式化造成的问题
                })
                //是否包含的表示符
                var flg = false

                for (var i = 0; i < datakeys.length; i++) {
                    for (var j = 0; j < keys.length; j++) {
                        if (datakeys[i] == keys[j]) {
                            flg = true
                            break
                        }
                    }
                }
                if (flg) {
                    var nodes = el.all('[bx-subtpl=' + o.name + ']')

                    //如果el本身也是tpl，则加上自己
                    if (el.attr('bx-subtpl') == o.name) {
                        nodes = el.add(nodes)
                    }

                    nodes.each(function(node) {
                        if (o.tpl) {
                            self.fire('beforeRefreshTpl', {
                                node: node,
                                renderType: renderType
                            })

                            //重新设置局部内容

                            if (renderType == 'html') {
                                node.empty();
                            }
                            node[renderType](S.trim(self.bxRenderTpl(o.tpl, data)))

                            /**
                             * @event afterRefreshTpl
                             * 局部刷新后触发
                             * @param {KISSY.Event.CustomEventObject} e
                             */
                            self.fire('afterRefreshTpl', {
                                node: node,
                                renderType: renderType
                            })
                        }

                        S.each(o.attrs, function(v, k) {
                            var val = S.trim(self.bxRenderTpl(v, data))
                            if (node[0].tagName.toUpperCase == 'INPUT' && k == "value") {
                                node.val(val)
                            } else {
                                node.attr(k, val)
                            }
                        })
                    })
                }
            })

            var children = self.bxChildren
            // 为什么要这样做？
            // 因为 bxIRefreshTpl 有可能会更改 children 数组的长度
            for (var i = 0; i < children.length; i++) {
                var child = children[i]

                if (!child.get('refresh')) {
                    child.set('refresh', true)
                    if (!child.get('data')) {
                        child.bxIRefreshTpl(keys, data, renderType)
                        i = 0
                    }
                }
            }
            // 更新 refresh 的状态为 false
            S.each(children, function(child) {
                child.set('refresh', false)
            })

        },

        /**
         * 设置数据，并刷新模板数据
         * @param {String} datakey 需要更新的数据对象key
         * @param {Object} data    数据对象
         * @param {Object} [opts]    控制对象，包括以下控制选项
         * @param {Boolean} [opts.silent] 是否触发change事件
         * @param {Function} [opts.error] 验证失败的回调，包括失败原因
         * @param {String} [opts.renderType] 渲染方式，目前支持html，append，prepend
         */
        setChunkData: function(datakey, data, opts) {
            var self = this
            var obj = Util.bxGetAncestor(self)
            var newData = obj.data || {}
            var ancestor = obj.ancestor
            var keys = []
            if (S.isObject(datakey)) {
                for (var key in datakey) {
                    newData[key] = datakey[key]
                    keys.push(key)
                }
                opts = data
            } else {
                keys = [datakey]
                newData[datakey] = data
            }

            //根据传入的opts,设置renderType
            var renderType = 'html'
            if (opts) {
                if (opts.renderType) {
                    renderType = opts.renderType;
                    delete opts.renderType
                }
            }
            ancestor.set('data', newData, opts)

            if (!opts || !opts.silent) {
                ancestor.bxIRefreshTpl(keys, newData, renderType)
            }
        }
    }

    exports.ATTRS = {
        /**
         * 子模板
         * @type {Array}
         */
        subTpls: {
            value: []
        },

        /**
         * 存储模板
         * @type {Array}
         */
        storeTpls: {
            value: []
        },

        /**
         * 子模板嵌套的级别
         * @cfg {Number}
         */
        level: {
            value: 4
        },

        /**
         * 组件的分析模板，不进入渲染逻辑
         * @type {String}
         */
        brickTpl: {
            value: false
        },
        /**
         * 存储组件模板集合
         * @type {Object}
         */
        brickTpls: {
            value: {}
        }
        // ,
        // /**
        //  * 存储dom中bx-type的事件对象
        //  */
        // 'bx-events': {
        //     value: {}
        // }
    }

    return exports
}, {
    requires: ['brix/tool/util']
})
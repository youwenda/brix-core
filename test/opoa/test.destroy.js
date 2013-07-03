var app
var Brick

var S = KISSY


describe('app and Brick', function() {

  before(function(done) {
    KISSY.use('brix/app,brix/base', function(S, _app, _Brick) {
      app = _app
      Brick = _Brick

      app.config({
        namespace: 'thx.opoa',
        base: '../'
      })

      done()
    })
  })

  describe('#boot', function() {

    it('should not fail if the el is gone when instantiating', function() {
      app
        .boot('#fixture1')
        .on('ready', function() {
          // 因为 [bx-name="thx.opoa/destroy-foo"] 节点已经被干掉了
          expect(this.find('thx.opoa/destroy-foo')).to.be(undefined)
          expect(this.get('children').to.be.empty())
        })

        // 5ms 后清空 #fixture1 中的内容，即不再有 thx.opoa/destroy-foo 组件
        // thx.opoa/destroy-foo/index 模块原本在 10ms 后返回
        S.later(function() {
          S.one('#fixture1').empty()
        }, 5)
    })
  })

  describe('#destroy', function() {

    it('should check if the el is gone before destroying itself', function() {
      app
        .boot('#fixture2')
        .on('ready', function() {
          expect(this.get('children').length).to.be(1)
          expect(this.find('thx.opoa/destroy-foo')).to.be.a(Brick)

          S.one('#fixture2').remove()

          this.destroy()

          expect(this.get('children')).to.be.empty()
          expect(this.get('el')).to.be(null)

          // http://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript
        })
    })
  })
})
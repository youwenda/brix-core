var app
var Brick
var Promise

var S = KISSY


describe('brix/base', function() {

  before(function(done) {
    KISSY.use('brix/app,brix/base,promise', function(S, _app, _Brick, _Promise) {
      app = _app
      Brick = _Brick
      Promise = _Promise

      app.config('components', 'thx.test')

      done()
    })
  })


  // Same as app.boot
  // only the booted bricks goes to the brick that called #boot method.
  describe('#prepare', function() {

    var rootBrick

    before(function(done) {
      app.prepare('#fixture0').then(function(brick) {
        rootBrick = brick
        done()
      })
    })

    it('same as app.prepare', function() {
      expect(rootBrick).to.be.a(Brick)
      expect(rootBrick.prepare('#fixture1')).to.be.a(Promise)
    })

    it('the parent of prepared bricks will be different', function(done) {
      rootBrick.prepare('#fixture2').then(function(brick) {
        expect(brick.bxParent).to.equal(rootBrick)
        expect(brick.bxParent.bxParent).to.equal(app)
        done()
      })
    })

    it('use brix/base if bx-naked', function(done) {
      rootBrick.prepare('#fixture3').then(function(brick) {
        expect(brick).to.be.a(Brick)
        done()
      })
    })

    it('receives arbitrary arguments too', function(done) {
      rootBrick
        .prepare({
          el: '#fixture4',
          tpl: '<p>Hello {{world}}!</p>',
          data: {
            world: 'earth'
          }
        })
        .then(function(brick) {
          expect(brick.get('tpl')).to.equal('<p>Hello {{world}}!</p>')
          expect(brick.get('data')).to.eql({
            world: 'earth'
          })
          expect(brick.get('el').html()).to.equal('<p>Hello earth!</p>')
          done()
        })
    })
  })


  describe('#boot', function() {
    var rootBrick

    before(function(done) {
      app.prepare('#fixture7').then(function(brick) {
        rootBrick = brick
        done()
      })
    })

    it('shall boot bricks that require async module loading', function(done) {
      expect(rootBrick.bxChildren).to.be.empty()
      rootBrick
        .boot({
          el: '#fixture8',
          bar: true
        })
        .then(function(brick) {
          expect(brick.bxName).to.equal('thx.test/base-boot-async')
          expect(brick.get('bar')).to.be(true)
          return brick
        })
        .then(function(brick) {
          expect(rootBrick.bxChildren[0]).to.equal(brick)
          done()
        })
    })
  })


  describe('promise', function() {
    it('supports async procedures in event listeners', function(done) {
      var code = 0

      app.boot('#fixture5').then(function(brick) {
        brick
          .on('getTpl', function(e) {
            return S.later(function() {
              code += 1
              e.next()
            }, 10)
          })
          .on('getData', function(e) {
            return S.later(function() {
              code += 10
              e.next()
            }, 10)
          })
          .on('ready', function() {
            expect(code).to.equal(11)
            done()
          })
      })
    })

    it('make sure the render and activate procedure is separated', function(done) {
      var code = 0

      app.boot('#fixture6').then(function(brick) {
        brick
          .on('rendered', function() {
            var foo = this.find('thx.test/promise-foo')

            // child bricks will be ready first
            foo.on('ready', function() {
              code +=1
              expect(code).to.be(1)
            })
          })
          .on('ready', function() {
            code += 10
            expect(code).to.be(11)

            done()
          })
      })
    })
  })
})
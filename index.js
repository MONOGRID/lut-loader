'use strict'

const jimp = require('jimp')
const loaderUtils = require('loader-utils')
const parseCubeLUT = require('parse-cube-lut')

module.exports = function (content) {
  let options = Object.assign({}, loaderUtils.getOptions(this))

  if (typeof options.plugins === 'function') {
    options.plugins = options.plugins(this)
  }

  const callback = this.async()

  const buf = content
  const lut = parseCubeLUT(buf)

  function convertToRgb(array) {
    let values = [array[0], array[1], array[2], 1].map((x) => x * 255)

    return jimp.rgbaToInt.apply(this, values)
  }

  let width = lut.size * lut.size
  let height = lut.size


  let image = new jimp(width, height, function (err, image) {
    for (let i = 0; i < lut.size; i++) {
      let slice = new jimp(lut.size, lut.size, function (err, slice) {
        for (let x = 0; x < lut.size; x++) {
          for (let y = 0; y < lut.size; y++) {
            let rgb = convertToRgb(lut.data.shift())
            slice.setPixelColor(rgb, x, y)
          }
        }
        slice.rotate(90)
        slice.flip(true, false)
        image.composite(slice, lut.size * i, 0)
        if (i === lut.size - 1) {
          image.getBuffer(jimp.MIME_PNG, (err, data) => {
            callback(err, data)
          })
        }
      })
    }
  })
}
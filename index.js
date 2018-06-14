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

  let [width, height] = [lut.size * lut.size, lut.size]

  let image = new jimp(width, height, function (err, image) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        image.setPixelColor(convertToRgb(lut.data.shift()), i, j)
      }
    }

    image.getBuffer(jimp.MIME_PNG, (err, data) => {
      callback(err, data)
    })
  })
}

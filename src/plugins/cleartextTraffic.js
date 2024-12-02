/** @type {import('@expo/config-plugins')} */
const { withAndroidManifest } = require('@expo/config-plugins')

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const cleartextTraffic = (expoConfig) =>
  withAndroidManifest(expoConfig, (config) => {
    config.modResults.manifest.application[0].$[
      'android:usesCleartextTraffic'
    ] = 'true'
    return config
  })

exports.default = cleartextTraffic

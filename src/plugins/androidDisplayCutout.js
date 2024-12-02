/** @type {import('@expo/config-plugins')} */
const { withAndroidStyles, AndroidConfig } = require('@expo/config-plugins')

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const androidDisplayCutout = (expoConfig) =>
  withAndroidStyles(expoConfig, (config) => {
    config.modResults = AndroidConfig.Styles.setStylesItem({
      parent: { name: 'AppTheme' },
      item: {
        _: 'shortEdges',
        $: {
          name: 'android:windowLayoutInDisplayCutoutMode',
        },
      },
      xml: config.modResults,
    })
    config.modResults = AndroidConfig.Styles.setStylesItem({
      parent: { name: 'AppTheme' },
      item: {
        _: 'true',
        $: {
          name: 'android:windowTranslucentNavigation',
        },
      },
      xml: config.modResults,
    })
    config.modResults = AndroidConfig.Styles.setStylesItem({
      parent: { name: 'AppTheme' },
      item: {
        _: '@android:color/transparent',
        $: {
          name: 'android:statusBarColor',
        },
      },
      xml: config.modResults,
    })
    config.modResults = AndroidConfig.Styles.setStylesItem({
      parent: { name: 'AppTheme' },
      item: {
        _: '@android:color/transparent',
        $: {
          name: 'android:navigationBarColor',
        },
      },
      xml: config.modResults,
    })
    config.modResults = AndroidConfig.Styles.setStylesItem({
      parent: { name: 'AppTheme' },
      item: {
        _: 'false',
        $: {
          name: 'android:enforceStatusBarContrast',
        },
      },
      xml: config.modResults,
    })
    config.modResults = AndroidConfig.Styles.setStylesItem({
      parent: { name: 'AppTheme' },
      item: {
        _: 'false',
        $: {
          name: 'android:enforceNavigationBarContrast',
        },
      },
      xml: config.modResults,
    })
    return config
  })

exports.default = androidDisplayCutout

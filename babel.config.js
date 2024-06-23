module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            assets: './src/assets',
            components: './src/components',
            hooks: './src/hooks',
            screens: './src/screens',
            services: './src/services',
            types: './src/types',
            lib: './src/lib',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.ios.jsx',
            '.android.jsx',
            '.jsx',
            '.ios.js',
            '.android.js',
            '.js',
            '.json',
            '.svg',
          ],
        },
      ],
    ],
  }
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          corejs: '3.22',
        },
      ],
      ['babel-preset-expo'],
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@assets': './assets'
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      }
    ],
  ],
};

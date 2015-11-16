Package.describe({
  name: 'colbycheeze:bluegrid',
  summary: 'A simple, responsive, and customizable grid based on the flex property',
  version: '0.2.0',
  git: 'https://github.com/colbycheeze/bluegrid'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');
  api.use('fourseven:scss@3.4.1');
  var assets = [
    "sass/_bluegrid.scss",
    "sass/grid/_classes.scss",
    "sass/grid/_mixins.scss",
    "sass/helpers/_private.scss",
    "sass/settings/_variables.scss",
  ];

  api.addFiles(assets, 'client', { isImport: true });
});

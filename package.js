Package.describe({
  name: 'colbycheeze:bluegrid',
  summary: 'A simple, responsive, and customizable grid based on the flex property',
  version: '0.3.1',
  git: 'https://github.com/colbycheeze/bluegrid'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');
  api.use('fourseven:scss@3.4.1');
  var assets = [
    "bluegrid/_bluegrid.scss",
    "bluegrid/grid/_classes.scss",
    "bluegrid/grid/_mixins.scss",
    "bluegrid/helpers/_private.scss",
    "bluegrid/settings/_variables.scss",
  ];

  api.addFiles(assets, 'client', { isImport: true });
});

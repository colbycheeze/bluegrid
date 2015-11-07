Package.describe({
  name: 'colbycheeze:bluegrid',
  summary: 'A simple, responsive, and customizable grid based on the flex property',
  version: '0.1.1',
  git: 'https://github.com/colbycheeze/bluegrid'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');
  api.use('fourseven:scss@3.4.1');
  var assets = [
    "sass/_bluegrid.scss",
  ];

  api.addFiles(assets, 'client', { isImport: true });
});

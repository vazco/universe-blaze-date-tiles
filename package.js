Package.describe({
    name: 'universe:blaze-date-tiles',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: 'Date tiles picker works as a standalone and as a autoform input',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.2.4');
    api.use([
        'ecmascript', 'cristo:state-in-templates@1.0.3', 'less',
        'templating', 'tracker', 'cristo:auto-install-npm@0.0.5']);

    api.addFiles('autoInstall.js', 'server');
    api.addFiles(['autoInstall.js', 'dateTiles.html', 'dateTiles.js', 'dateTiles.less'], 'client');
});

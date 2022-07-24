module.exports = shipit => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  const appName = 'gdeded';

  shipit.initConfig({
    default: {
      deployTo: '/home/deploy/gdeded',
      repositoryUrl: 'git@github.com:Traf333/gdeded.git',
      keepReleases: 5,
      branch: 'main',
      shared: {
        overwrite: true,
        dirs: ['node_modules'],
        files: ['.env']
      }
    },
    production: {
      servers: 'deploy@gidromash-service.ru'
    }
  });

  shipit.on('updated', () => {
    shipit.start('yarn-install', 'build');
  });

  shipit.on('published', () => {
    shipit.start('pm2-server');
  });

  shipit.blTask('yarn-install', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && yarn install`);
  });

  shipit.blTask('build', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && yarn build`);
  });

  shipit.blTask('pm2-server', async () => {
    await shipit.remote(`pm2 delete -s ${appName} || :`);
    await shipit.remote(
      `pm2 start ecosystem.config.js --env production --watch true`
    );
  });

};

## Persistent Ghost
Tiny wrapper aroud the [Ghost] blog enabling deployment to Nodejitsu. The goal
of this wrapper is to persist content. Both the `sqlite` database and `content`
directory are persisted to MongoDB GridFS.

### How to use
The most easy thing to do is `jitsu install ghost` which will do steps 1 and 2
for you. It default to the database name: 'ghost-blog'. For more fine-grained
control you can follow the three steps below.

1. Clone this module via github or download a release directly from the interface.
   ```
   git clone git@github.com:nodejitsu/persistent-ghost.git
   ```
2. Create a MongoDB database via webops interface or jitsu CLI
   `jitsu databases create mongo blog`, where blog is the database name. After
   add the connection string to [config.js]. Optionally, you can configure an
   e-mail service. See the Ghost [e-mail documentation][docs] for more details.
   ```js
   exports.mongo = 'mongodb://nodejitsu:7f81223821312fd3192545fd9@paulo.mongohq.com:10051/nodejitsudb12238192';

   // recommended for password recovery, but optional
   exports.mail = {
     transport: 'SMTP',
     options: {
       auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
       }
     }
   }
   ```
3. Run `jitsu deploy`, acknowledge the provided subdomain or provide a custom
   subdomain to [package.json].

For more details post setup, see the Ghost [usage documentation][usage].

### Features
- Sync all files of the `content` directory to MongoDB GridFS.
- Backup for each file the latest two versions are stored.
- Recovery option by setting `RECOVER=true` as environment variable.
- Uses the latest available ghost on npm.

Currently the wrapper has a custom ghost as dependency. It's the lastest available
ghost release with one tiny adjustment. Any adjustments we make and which are useful
in general will be discussed with the awesome [Ghost team][about].

### Themes
Ghost can be provided with themes in two ways, both via `config/index.js`

- provide a git url to a theme for cloning. This is the advised method,
  `casper: 'git://github.com/TryGhost/Casper.git'`
- provide the name of a submodule, if your theme is private you should add it to
  bundledDependencies. Alternatively you could also use our [private npm][npm] service.
  `private: 'mytheme'`

### Upgrading

Follow the instructions below to upgrade.

**Installed with jitsu install**

In development, redoing installation steps works for now.

**Installed with git**

```bash
git pull origin master
jitsu deploy
```

Only required if you forked, simply add the orginal repo as upstream remote.

```bash
git remote add upstream git@github.com:nodejitsu/persistent-ghost.git
git pull upstream master
jitsu deploy
```

### Disclaimer
The current solution is not perfect, it's a quick fix. Direct storage to mongoDB
and/or content storage to a dedicated storage service would be prefered. If you
would like to help out, check [pkgcloud] to get started. Although we expect the
module to work properly, this package is provided "AS IS", see the License for
more details.

### License

MIT

[usage]: http://docs.ghost.org/usage/
[package.json]: https://github.com/nodejitsu/persistent-ghost/blob/master/package.json
[pkgcloud]: https://github.com/nodejitsu/pkgcloud
[Ghost]: https://ghost.org/
[docs]: http://docs.ghost.org/mail/
[config.js]: https://github.com/nodejitsu/persistent-ghost/blob/master/config/index.js
[about]: https://ghost.org/about/
[npm]: https://www.nodejitsu.com/try/private-npm/
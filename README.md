## Persistent Ghost
Tiny wrapper aroud the [Ghost] blog enabling deployment to Nodejitsu. The goal
of this wrapper is to persist content. Both the `sqlite` database and `content`
directory are persisted to MongoDB GridFS.

### How to use
1. Clone this module via github or download a release directly from the interface.
   ```
   git clone git@github.com:nodejitsu/persistent-ghost.git
   ```
2. Create a MongoDB database via webops interface or jitsu CLI and add the
   connection string to [config.js]. Optionally, you can configure an e-mail
   service. See the Ghost [e-mail documentation][docs] for more details.
   ```js
   exports.mongo = 'mongodb://nodejitsu:7f812389821312fd3192545fd9@paulo.mongohq.com:10051/nodejitsudb12938192';

   // recommended for password recovery, but optional
   exports.mail = {
     ransport: 'SMTP',
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

Currently the wrapper has a custom ghost as dependency. It's the lastest available
ghost release with one tiny adjustment. Any adjustments we make and which are useful
in general will be discussed with the awesome [Ghost team][about].
Current modifications: [absolute upload][commit] path for `content/images`

[commit]: https://github.com/Swaagie/ghost/commit/e1a7b8b6472f63aabe6edcd0c63559c74b499b63

### Disclaimer
The current solution is not perfect, it's a quick fix. Direct storage to mongoDB
and/or cntent storage to a dedicated storage service would be prefered. If you
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
[config.js]: https://github.com/nodejitsu/persistent-ghost/blob/master/config.js
[about]: https://ghost.org/about/

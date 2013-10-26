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
   connection string to [config.js].
```
exports.mongo = 'mongodb://nodejitsu:7f812389821312fd3192545fd9@paulo.mongohq.com:10051/nodejitsudb12938192';
```
3. Create/add an e-mail service configuration (optional) to [config.js]. See the
   Ghost [e-mail documentation][docs] for more details.
```
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

Other required options are configured automatically post-deployment.

### Features
- Sync all files of the `content` directory to MongoDB GridFS.
- Backup for each file the latest two versions are stored.
- Recovery option by setting `RECOVER=true` as environment variable.

The wrapper has ghost as dependency. It's the lastest available ghost release
with some tiny adjustments. Any adjustments we made and which are useful in general
will be discussed with the awesome [Ghost team][about]. Current modifications:
- absolute upload path for `content/images`

### Disclaimer
The current solution is not perfect, it's a quick fix. Direct storage to mongoDB
and/or cntent storage to a dedicated storage service would be prefered. If you
would like to help out, check [pkgcloud] to get started. Although we expect the
module to work properly, this package is provided "AS IS", see the License for
more details.

### License

MIT

[pkgcloud]: https://github.com/nodejitsu/pkgcloud
[Ghost]: https://ghost.org/
[docs]: http://docs.ghost.org/mail/
[config.js]: #TODO
[about]: https://ghost.org/about/

## Ghost blog @ Nodejitsu

Tiny wrapper aroud the Ghost blog enabling deployment to Nodejitsu. The goal of
this wrapper is to persist the content of both the `sqlite` database and `content`
directory. Currently this persistance is done throught MongoDB.

### How to use

1. Clone this module via github or download a release directly from the interface.
```
git clone git@github.com:nodejitsu/nodejitsu-ghost.git
```
2. Create MongoDB database via webops interface or jitsu CLI and add the
   connection string to 'config.js'.
```
exports.mongo = 'mongodb://nodejitsu:7f812389821312fd3192545fd9@paulo.mongohq.com:10051/nodejitsudb12938192';
```
3. Create/add an e-mail service configuration (optional) to 'config.js'.
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

### Differences
This module has ghost as dependencies. It's the lastest available ghost release
with some tiny adjustments. Any adjustment that is useful in general will
be discussed with the ghost team. These modifications include:

- absolute upload path to filesystem for `content/images`

### Disclaimer
To overcome the file persistance problem, user content is persisted to mongoDB.
Hacky? Yes we know, however it is a quick fix for which we had the resources.

If we can find the resources we'd like to build plugins for ghost. Plugings that
will use mongoDB for database storage and/or storage providers for content. If
you would like to help us out, check out [pkgcloud] to get started.
Although We expect the module to work properly, this package is provided "AS IS",
see the License for more details.

[pkgcloud]: https://github.com/nodejitsu/pkgcloud

### License

MIT

# A grunt 0.4 boilerplate.

## dev

```
grunt dev 
```

This will start a server at port 3001 and a reload proxy at port 3000.
To check the site with reload enabled, browse to: http://localhost:3000

## build

```
grunt build
```

## dist site  

```
grunt dist
```

To check the dist site browse to: http://localhost:3003

## test

### unit 

```
grunt test:unit 
# or
grunt test
```

### auto test

```
grunt test:auto 
```

This will start a testacular server on port 4000, and will run the unit tests on js 
file changes.

Manually point a browser to http://localhost:4000 for the tests to run.

### e2e

```
grunt test:e2e 
# or
grunt test:e2e-dev
```

This will run e2e tests against the dev site.

To run the test against the dist site do the following:

```
grunt test:e2e-dist
```


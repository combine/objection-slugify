[![Build Status](https://travis-ci.org/combine/objection-slugify.svg?branch=master)](https://travis-ci.org/combine/objection-slugify)
[![Coverage Status](https://coveralls.io/repos/github/combine/objection-slugify/badge.svg?branch=master)](https://coveralls.io/github/combine/objection-slugify?branch=master)

# Slugged models for Objection.js

This plugin will automatically generate slugs for your model based on a source
field and a slug field. It will also generate unique slugs by checking to see
if the slug already exists in the model's table.

## Installation
```
npm install objection-slugify --save
```

## Usage
```js
// Import the plugin.
const slugifyPlugin = require('objection-slugify');
const { Model } = require('objection');

// Mixin the plugin.
const slugify = slugifyPlugin({
  sourceField: 'title',
  slugField: 'slug'
});

// Create your model.
class Post extends slugify(Model) {
  // ...code
}

const post = await Post.query().insert({
  title: 'How to Fry an Egg'
});

console.log(post.slug);
// how-to-fry-an-egg
```

## Options

#### `sourceField` (required)
The source of the slugged content.

#### `slugField` (defaults to `slug`)
The field to store the slug on.

#### `update` (defaults to `true`)
Specifies whether the slug is updated when the source field is updated.

#### `unique` (defaults to `false`)
Checks to see if the generated slug is unique in the table. If not, it will
append a UUID to the end of the slug.

#### `generateUniqueSuffix` (Function: String)
A custom function that returns a string. Can be used to generate a custom suffix
to the end of the slug. If `unique` is true and this is not specified, a random
UUID will be appended to the slug.

#### `slugifyOptions` (defaults to `{ lower: true } `)
A set of options for the internal slugify library, options available [here](https://www.npmjs.com/package/slugify#options).

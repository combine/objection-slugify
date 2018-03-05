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
const Slugify = require('objection-slugify');
const { Model } = require('objection');

// Mixin the plugin.
const SluggedModel = Slugify(Model, {
  sourceField: 'title',
  slugField: 'slug',
  unique: true
});

// Create your model.
class Post extends SluggedModel {
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

#### `unique` (defaults to `false`)
Ensure that the slug is unique to the table by appending `-${n}` to the slug,
where `n` is the number of times the same slug appears.

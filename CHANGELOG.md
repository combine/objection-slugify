# Changelog

## [v3.0.0](https://github.com/combine/objection-slugify/tree/v3.0.0)

- (Feature): Allow `opts.update` to be specified whether it updates the slug
when the source field is updated.
- (Feature): Use UUID as a default suffix, unless a custom generator
(opts.generateUniqueSuffix) is specified.

## [v2.0.1](https://github.com/combine/objection-slugify/tree/v2.0.1)

- Fixed a bug that caused a unique slug to generate when patching an instance
with the same source data.

## [v2.0.0](https://github.com/combine/objection-slugify/tree/v2.0.0)

- Update plugin with mixin implementation as suggested by Objection.js's best
practices. [#2] (Thanks @abelsoares!)

## [v1.0.1](https://github.com/combine/objection-slugify/tree/v1.0.1)

- Maintenance release with updates to README and build tools.

## [v1.0.0](https://github.com/combine/objection-slugify/tree/v1.0.0)

- Initial version.

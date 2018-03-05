'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const slugify = require('slug');

/**
 * Adds hooks to an Objection.Model to slugify from a source field.
 * @param {Objection.Model} The model class
 * @param {String} options.sourceField - Source field to slugify. Default: null
 * @param {String} options.slugField - Field to slugify. Default: 'slug'.
 * @param {Boolean} options.unique - Ensure slugs are unique. Default: false
 */
module.exports = {
  Slugify: (Model, options) => {
    // Provide some default options
    const opts = Object.assign({
      // The source field, or the source field to slugify
      sourceField: null,

      // The name of the field to save the slug to
      slugField: 'slug',

      // Ensure slugs are unique.
      unique: false
    }, options);

    if (!opts.sourceField || !opts.slugField) {
      throw new Error('You must specify `sourceField` and `slugField`.');
    }

    return class extends Model {
      constructor(...args) {
        var _temp, _this;

        return _temp = _this = super(...args), this.generateSlug = (() => {
          var _ref = _asyncToGenerator(function* (str) {
            const slug = slugify(str, { lower: true });

            if (opts.unique) {
              return yield _this.uniqueSlug(slug);
            } else {
              return Promise.resolve(slug);
            }
          });

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        })(), this.addSuffix = (original, suffix) => {
          return `${original}${suffix}`;
        }, this.checkSlug = (() => {
          var _ref2 = _asyncToGenerator(function* (slug) {
            try {
              const row = yield _this.constructor.query().where(opts.slugField, slug).first();

              return row ? false : true;
            } catch (err) {
              throw new Error(err.message);
            }
          });

          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        })(), this.uniqueSlug = (() => {
          var _ref3 = _asyncToGenerator(function* (original, current = null, count = 0) {
            const isUnique = yield _this.checkSlug(current || original);

            if (!isUnique) {
              count = count + 1;

              return _this.uniqueSlug(original, _this.addSuffix(original, `-${count}`), count);
            }

            return current || original;
          });

          return function (_x3) {
            return _ref3.apply(this, arguments);
          };
        })(), _temp;
      }

      $beforeInsert(context) {
        var _this2 = this;

        const maybePromise = super.$beforeInsert(context);

        return Promise.resolve(maybePromise).then(_asyncToGenerator(function* () {
          const source = _this2[opts.sourceField];

          if (source) {
            const slug = yield _this2.generateSlug(source);
            _this2[opts.slugField] = slug;
          }
        }));
      }

      $beforeUpdate(queryOptions, context) {
        var _this3 = this;

        const maybePromise = super.$beforeUpdate(queryOptions, context);

        return Promise.resolve(maybePromise).then(_asyncToGenerator(function* () {
          const source = _this3[opts.sourceField];

          if (source) {
            const slug = yield _this3.generateSlug(source);
            _this3[opts.slugField] = slug;
          }
        }));
      }

      /** addSuffix()
       * Adds a suffix to the end of a slug
       */


      /** checkSlug()
       * Checks for the existence of a data row using the specified slug
       * @param {String} The slug to check.
       */


      /** generateSlug()
       * Generates a slug based on the source and then checks to see if it's
       * unique, recursively doing so until a unique slug is found.
       * @param {String} original - The original (first) generated slug.
       * @param {String} current - The current iteration of the slug.
       * @param {Number} count - The number of times this slug appears.
       */
    };
  }
};
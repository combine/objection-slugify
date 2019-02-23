const slugify = require('slugify');
const uuid = require('uuid/v4');

const MAX = 10;

/**
 * Adds hooks to an Objection.Model to slugify from a source field.
 * @param {String} options.sourceField - Required. Source field for
    slugification.
 * @param {String} options.slugField - Required. Field to slugify.
    Default: 'slug'.
 * @param {Boolean} options.update - Whether or not to update the slug when the
    source field is updates. Default: true.
 * @param {Boolean} options.unique - Ensure slugs are unique. Default: false
 * @param {Function} options.generateUniqueSuffix - When unique is true, this
    function is called when generating a unique suffix for the slug. If it not
    specified, a random UUID generator will be used.
 * @param {Objection.Model} The Objection model class
 */
module.exports = options => {
  // Provide some default options
  const opts = Object.assign(
    {
      sourceField: null,
      slugField: 'slug',
      update: true,
      unique: false,
      generateUniqueSuffix: null,
      slugifyOptions: {},
    },
    options
  );

  if (!opts.sourceField || !opts.slugField) {
    throw new Error('You must specify `sourceField` and `slugField`.');
  }

  return Model => {
    return class extends Model {
      $beforeInsert(context) {
        const maybePromise = super.$beforeInsert(context);

        return Promise.resolve(maybePromise).then(async () => {
          const source = this[opts.sourceField];

          if (source) {
            const slug = await this.generateSlug(source);
            this[opts.slugField] = slug;
          }
        });
      }

      $beforeUpdate(queryOptions, context) {
        const maybePromise = super.$beforeUpdate(queryOptions, context);
        const { patch, old } = queryOptions;

        return Promise.resolve(maybePromise).then(async () => {

          if (opts.update) {
            const source = this[opts.sourceField];

            if (source && patch && old && source !== old[opts.sourceField]) {
              const slug = await this.generateSlug(source);
              this[opts.slugField] = slug;
            }
          }
        });
      }

      generateSlug = async str => {
        const slug = slugify(str, { lower: true, ...opts.slugifyOptions });

        if (opts.unique) {
          return await this.uniqueSlug(slug);
        } else {
          return Promise.resolve(slug);
        }
      };

      /** addSuffix()
       * Adds a suffix to the end of a slug
       */
      addSuffix = (original, generator = null) => {
        if (typeof generator === 'function') {
          return `${original}${generator(original)}`;
        }

        return `${original}-${uuid()}`;
      };

      /** checkSlug()
       * Checks for the existence of a data row using the specified slug
       * @param {String} The slug to check.
       */
      checkSlug = async slug => {
        try {
          const row = await this.constructor
            .query()
            .where(opts.slugField, slug)
            .first();

          return row ? false : true;
        } catch (err) {
          throw new Error(err.message);
        }
      };

      /** generateSlug()
       * Generates a slug based on the source and then checks to see if it's
       * unique, recursively doing so until a unique slug is found.
       * @param {String} original - The original (first) generated slug.
       * @param {String} current - The current iteration of the slug.
       */
      uniqueSlug = async (original, current = null, count = 0) => {
        const isUnique = await this.checkSlug(current || original);

        if (!isUnique && count <= MAX) {
          if (count === MAX) {
            return this.uniqueSlug(original, this.addSuffix(original), count);
          }

          count = count + 1;
          return this.uniqueSlug(original, this.addSuffix(original, opts.generateUniqueSuffix), count);
        }

        return current || original;
      };
    };
  };
};

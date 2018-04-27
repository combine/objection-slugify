const slugify = require('slug');

/**
 * Adds hooks to an Objection.Model to slugify from a source field.
 * @param {String} options.sourceField - Source field to slugify. Default: null
 * @param {String} options.slugField - Field to slugify. Default: 'slug'.
 * @param {Boolean} options.unique - Ensure slugs are unique. Default: false
 * @param {Objection.Model} The model class
 */
module.exports = options => {
  // Provide some default options
  const opts = Object.assign(
    {
      // The source field, or the source field to slugify
      sourceField: null,

      // The name of the field to save the slug to
      slugField: 'slug',

      // Ensure slugs are unique.
      unique: false
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
          const source = this[opts.sourceField];

          if (source && patch && old && source !== old[opts.sourceField]) {
            const slug = await this.generateSlug(source);
            this[opts.slugField] = slug;
          }
        });
      }

      generateSlug = async str => {
        const slug = slugify(str, { lower: true });

        if (opts.unique) {
          return await this.uniqueSlug(slug);
        } else {
          return Promise.resolve(slug);
        }
      };

      /** addSuffix()
       * Adds a suffix to the end of a slug
       */
      addSuffix = (original, suffix) => {
        return `${original}${suffix}`;
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
       * @param {Number} count - The number of times this slug appears.
       */
      uniqueSlug = async (original, current = null, count = 0) => {
        const isUnique = await this.checkSlug(current || original);

        if (!isUnique) {
          count = count + 1;

          return this.uniqueSlug(
            original,
            this.addSuffix(original, `-${count}`),
            count
          );
        }

        return current || original;
      };
    };
  };
};

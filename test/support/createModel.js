import { Model } from 'objection';
import slugifyPlugin from '../../src/index';

export default function(options) {
  const slugify = slugifyPlugin(Object.assign({
    sourceField: 'name',
    slugField: 'slugged',
    unique: true
  }, options));

  return class User extends slugify(Model) {
    static modelPaths = [__dirname];
    static tableName = 'users';
    static jsonSchema = {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        slugged: { type: 'string', minLength: 1, maxLength: 255 },
      }
    };
  }

}

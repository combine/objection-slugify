import { Model } from 'objection';
import slugifyPlugin from '../../src/index';

const slugify = slugifyPlugin({
  sourceField: 'name',
  slugField: 'slugged',
  unique: true
});

export default class User extends slugify(Model) {
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

import { Model } from 'objection';
import { Slugify } from '../../src/index';

const SluggedModel = Slugify(Model, {
  sourceField: 'name',
  slugField: 'slugged',
  unique: true
});

export default class User extends SluggedModel {
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

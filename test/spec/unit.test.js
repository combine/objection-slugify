import slugifyPlugin from '../../src/index';
import { Model } from 'objection';

// Set up assertions on slugify
let mockSlugifyAssertions = (str, opts) => { return str };

jest.mock('slugify', () => (str, opts) => {
    return mockSlugifyAssertions(str, opts);
});

describe('generateSlug', function() {
  it('will default options to lower: true', function() {
    mockSlugifyAssertions = (str, opts) => {
      expect(opts)
        .toEqual({ lower: true });

      return 'Asserted default options';
    };

    const slugifyMixin = slugifyPlugin({
      sourceField: 'name',
      slugField: 'slugged',
      slugifyOptions: {
        // 
      }
    });
  
    const model = new class MockModel extends slugifyMixin(Model) {}

    return model.generateSlug('slug test creation')
      .then((slug) => {
        expect(slug)
          .toEqual('Asserted default options');
      })
  });

  it('will pass slugifyOptions', function() {
    mockSlugifyAssertions = (str, opts) => {
      expect(opts)
        .toEqual({
          lower: true,
          test: 'an-option',
          remove: 'an actual option'
        });

      return 'Asserted overridden options';
    };

    const slugifyMixin = slugifyPlugin({
      sourceField: 'name',
      slugField: 'slugged',
      slugifyOptions: {
        test: 'an-option',
        remove: 'an actual option'
      }
    });
  
    const model = new class MockModel extends slugifyMixin(Model) {}

    return model.generateSlug('slug test creation')
      .then((slug) => {
        expect(slug)
          .toEqual('Asserted overridden options');
      })
  });
});
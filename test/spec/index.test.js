import createModel from '../support/createModel';

let Model = createModel();

describe('On create', function() {
  let instance;

  beforeAll(async function() {
    instance = await Model.query().insert({ name: 'Foo Bar' });
  });

  it('slugifies the name', function() {
    expect(instance.slugged).toEqual('foo-bar');
  });

  describe('when slug already exists', function() {
    let instance2;

    beforeAll(async function() {
      instance2 = await Model.query().insert({ name: 'Foo Bar' });
    });

    it('creates a unique slug with a numerical postfix', function() {
      expect(instance2.slugged).toEqual('foo-bar-1');
    });
  });
});

describe('on update', function() {
  let instance;

  describe('when source field has changed', function() {
    describe('and opts.update is enabled', function() {
      beforeAll(async function() {
        instance = await Model.query().insert({ name: 'Food Bar' });
        instance = await instance.$query().patchAndFetch({ name: 'Bar Baz' });
      });

      it('updates the slug', function() {
        expect(instance.name).toEqual('Bar Baz');
        expect(instance.slugged).toEqual('bar-baz');
      });
    });
    describe('and opts.update is disabled', function() {
      beforeAll(async function() {
        Model = createModel({ update: false });
        instance = await Model.query().insert({ name: 'Zoo Bar' });
        instance = await instance.$query().patchAndFetch({ name: 'Zab Bar' });
      });

      it('updates the slug', function() {
        expect(instance.name).toEqual('Zab Bar');
        expect(instance.slugged).toEqual('zoo-bar');
      });
    });
  });

  describe('when source field has not changed', function() {
    let instance;

    beforeAll(async function() {
      instance = await Model.query().insert({ name: 'Woo Bar' });
      instance = await instance.$query().patchAndFetch({
        name: 'Baz Bar',
        description: 'hello'
      });
    });

    it('does not update the slug', function() {
      expect(instance.name).toEqual('Baz Bar');
      expect(instance.slugged).toEqual('woo-bar');
    });
  });
});

import User from '../support/User';

describe('Slugify', function() {
  let user;

  beforeAll(async function() {
    user = await User.query().insert({
      name: 'Foo Bar',
    });
  });

  describe('on create', function() {
    it('slugifies the name', function() {
      expect(user.slugged).toEqual('foo-bar');
    });

    describe('when slug already exists', function() {
      let user2;

      beforeAll(async function() {
        user2 = await User.query().insert({
          name: 'Foo Bar',
        });
      });

      it('creates a unique slug with a numerical postfix', function() {
        expect(user2.slugged).toEqual('foo-bar-1');
      });
    });
  });

  describe('on update', function() {
    describe('if the name is updated', function() {
      beforeAll(async function() {
        user = await user.$query().patchAndFetch({ name: 'Bar Baz' });
      });

      it('updates the slug', function() {
        expect(user.name).toEqual('Bar Baz');
        expect(user.slugged).toEqual('bar-baz');
      });
    });

    describe('if the name is updated with the same name', function() {
      let user;

      beforeAll(async function() {
        user = await User.query().insert({
          name: 'Foo Bar',
        });

        user = await user.$query().patchAndFetch({
          name: 'Foo Bar',
          description: 'hello'
        });
      });

      it('does not update the slug', function() {
        expect(user.name).toEqual('Foo Bar');
        expect(user.slugged).toEqual('foo-bar');
      });
    });
  });
});

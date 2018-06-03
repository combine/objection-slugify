import createModel from '../support/createModel';
import slug from 'slug';
import faker from 'faker';

let Model = createModel();
let instance, name;

describe('on create', function() {
  name = faker.name.findName();

  beforeAll(async function() {
    instance = await Model.query().insert({ name });
  });

  it('slugifies the name', function() {
    expect(instance.slugged).toEqual(slug(name, { lower: true }));
  });

  describe('when slug already exists', function() {
    let instance2;

    describe('and opts.unique is true', function() {
      beforeAll(async function() {
        instance2 = await Model.query().insert({ name });
      });

      it('creates a unique slug with a suffixed uuid', function() {
        expect(instance2.slugged).toMatch(
          new RegExp(`${slug(name, { lower: true })}-(\\w+)`)
        );
      });

      describe('with opts.generateUniqueSuffix specified', function() {
        beforeAll(async function() {
          Model = createModel({
            generateUniqueSuffix: () => {
              return '-anything-we-want';
            }
          });

          instance2 = await Model.query().insert({ name });
        });

        it('creates a slug with the specified suffix', function() {
          expect(instance2.slugged).toEqual(
            `${slug(name, { lower: true })}-anything-we-want`
          );
        });

        describe('but it does not create a unique slug', function() {
          beforeAll(async function() {
            Model = createModel({ generateUniqueSuffix: () => '' });
            instance2 = await Model.query().insert({ name });
          });

          it('defaults to using UUID as the suffix', function() {
            expect(instance2.slugged).toMatch(
              new RegExp(`${slug(name, { lower: true })}-(\\w+)`)
            );
          });
        });
      });
    });

    describe('and opts.unique is false', function() {
      beforeAll(async function() {
        Model = createModel({ unique: false });
        instance2 = await Model.query().insert({ name });
      });

      it('uses a non unique slug', function() {
        expect(instance.slugged).toEqual(instance2.slugged);
        expect(instance2.slugged).toMatch(slug(name, { lower: true }));
      });
    });
  });
});

describe('on update', function() {
  let instance, name, newName;

  describe('when source field has changed', function() {
    describe('and opts.update is enabled', function() {
      name = faker.name.findName();
      newName = faker.name.findName();

      beforeAll(async function() {
        instance = await Model.query().insert({ name });
        instance = await instance.$query().patchAndFetch({ name: newName });
      });

      it('updates the slug', function() {
        expect(instance.name).toEqual(newName);
        expect(instance.slugged).toEqual(slug(newName, { lower: true }));
      });
    });

    describe('and opts.update is disabled', function() {
      name = faker.name.findName();
      newName = faker.name.findName();

      beforeAll(async function() {
        Model = createModel({ update: false });
        instance = await Model.query().insert({ name });
        instance = await instance.$query().patchAndFetch({ name: newName });
      });

      it('does not update the slug', function() {
        expect(instance.name).toEqual(newName);
        expect(instance.slugged).toEqual(slug(name, { lower: true }));
      });
    });
  });

  describe('when source field has not changed', function() {
    let instance,
      name = faker.name.findName();

    beforeAll(async function() {
      instance = await Model.query().insert({ name });
      instance = await instance.$query().patchAndFetch({
        name,
        description: 'hello'
      });
    });

    it('does not update the slug', function() {
      expect(instance.name).toEqual(name);
      expect(instance.slugged).toEqual(slug(name, { lower: true }));
    });
  });
});

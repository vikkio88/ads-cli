var _faker=require('../../libs/generator/faker');describe('faker test',function(){test('name generation',function(){expect(_faker.faker.name('it')).not.toBe(undefined);});test('surname generation',function(){expect(_faker.faker.surname('it')).not.toBe(undefined);});test('city generation',function(){expect(_faker.faker.city('it')).not.toBe(undefined);});});
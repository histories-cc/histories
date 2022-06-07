import FirstLetterUppercase from '../FirstLetterUppercase';

describe('First letter to uppercase', () => {
  test('All lowercase', () => {
    expect(FirstLetterUppercase('hello world!')).toEqual('Hello world!');
  });

  test('First uppercase', () => {
    expect(FirstLetterUppercase('Hello world!')).toEqual('Hello world!');
  });
});

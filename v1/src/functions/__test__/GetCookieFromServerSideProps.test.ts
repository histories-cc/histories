import GetCookieFromServerSideProps from '../GetCookieFromServerSideProps';

describe('Get cookie from server side props', () => {
  test('Only one', () => {
    expect(GetCookieFromServerSideProps('cookie=somevalue;', 'cookie')).toEqual(
      'somevalue'
    );
  });

  test('Get the second cookie', () => {
    expect(
      GetCookieFromServerSideProps(
        'firstCookie=firstCookieValue; cookie=secondCookieValue;',
        'cookie'
      )
    ).toEqual('secondCookieValue');
  });

  test('Real value', () => {
    const now = new Date().toString();

    expect(
      GetCookieFromServerSideProps(
        `firstCookie=firstCookieValue; secondCookie=secondCookieValue; cookie=${now}; fourthCookie=fourthCookieValue;`,
        'cookie'
      )
    ).toEqual(now);
  });

  test('There is not any', () => {
    expect(
      GetCookieFromServerSideProps(
        'firstCookie=firstCookieValue; secondCookie=secondCookieValue; thirdCookie=thirdCookieValue;',
        'cookie'
      )
    ).toEqual(null);
  });

  test('Cookies are undefined', () => {
    expect(GetCookieFromServerSideProps(undefined, 'cookie')).toEqual(null);
  });
});

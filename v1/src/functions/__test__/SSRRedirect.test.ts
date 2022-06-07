import SSRRedirect from '../SSRRedirect';

describe('SSR redirect', () => {
  // Me: I don't think this test is necessary...
  // Copilot: because it's not a function
  // Me: Thanks Copilot, you can always tell me why I'm retarded

  test('Only one needed', () => {
    expect(SSRRedirect('/login')).toEqual({
      redirect: {
        destination: '/login',
        permanent: false,
        basePath: false,
      },
    });
  });
});

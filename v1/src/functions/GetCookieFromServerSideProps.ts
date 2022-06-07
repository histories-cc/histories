// cookies = req.headers.cookie;
function GetCookieFromServerSideProps(
  cookies: string | undefined,
  cookieName: string
) {
  return cookies
    ? cookies
        .split(';') // split cookies to array
        .find((c) => c.trim().startsWith(cookieName + '=')) // get JWT cookie
        ?.split('=')[1] ?? // get just JWT token from `jwt=xxxxxx`
        null // if there is not JWT cookie, return null
    : null;
}

export default GetCookieFromServerSideProps;

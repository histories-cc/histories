import OptimizeString from '../OptimizeString';

describe('Optimize string', () => {
  // HTML
  test('Optimize HTML', () => {
    expect(OptimizeString(html)).toEqual(optimizedHtml);
  });

  // CYPHER
  test('Optimize Cypher', () => {
    expect(OptimizeString(cypher)).toEqual(optimizedCypher);
  });
});

const optimizedCypher = ' MATCH (n) DETACH DELETE n ';

const cypher = `
    // This query will delete everything, so don't run it on production

    MATCH (n)           // select all nodes
    DETACH DELETE n     // delete all relations and nodes
`;

const optimizedHtml =
  '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <meta http-equiv="X-UA-Compatible" content="ie=edge" /> <title>Verify email</title> </head> <body style="font-family: Roboto, Arial, Helvetica, sans-serif; font-size: 16px" > <section style="margin: auto; max-width: 469px; display: block"> <img src="https://www.histories.cc/logo/big-black.svg" alt="logo" height="50px" style="margin: auto; display: block; padding: 25px 0 15px 0" /> <h1>Hey John 👋</h1> <p style="text-align: justify"> Welcome to Histories, platform for sharing historical photos of places and much more. Before we start, we need to confirm your email address. </p> <div style="display: flex; align-items: center; padding-bottom: 40px"> <a href="https://www.histories.cc/verify?token=1234" style=" background-color: #fc6e47; color: white; border: 0; border-radius: 8px; padding: 8px 30px; font-size: 14px; font-weight: bold; text-decoration: none; margin: auto; " > Confirm </a> </div> <p>If this wasn’t you, ignore this email and don’t click confirm.</p> <footer style=" margin-top: 60px; padding-top: 20px; border-top: 1px solid #f0f0f0; " > <div style=" display: flex; gap: 8px; justify-content: center; text-align: center; line-height: 40px; " > <img src="https://www.histories.cc/logo/small.png" alt="logo" height="40px" width="40px" style="border-radius: 8px" /> <a href="https://www.histories.cc" style="font-weight: bold; text-decoration: none; color: black" > histories.cc </a> </div> <p style="color: #6a6a6a; text-align: center"> Don’t want to receive these emails?<br /> <a href="https://www.histories.cc/settings/notifications" style="color: #fc6e47; text-decoration: none" > Unsubscribe here </a> </p> <p>© 2022 Kryštof Krátký. All rights reserved.</p> </footer> </section> </body> </html> ';

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Verify email</title>
  </head>
  <body
    style="font-family: Roboto, Arial, Helvetica, sans-serif; font-size: 16px"
  >
    <section style="margin: auto; max-width: 469px; display: block">
      <img
        src="https://www.histories.cc/logo/big-black.svg"
        alt="logo"
        height="50px"
        style="margin: auto; display: block; padding: 25px 0 15px 0"
      />
      <h1>Hey John 👋</h1>
      <p style="text-align: justify">
        Welcome to Histories, platform for sharing historical photos of places
        and much more. Before we start, we need to confirm your email address.
      </p>

      <div style="display: flex; align-items: center; padding-bottom: 40px">
        <a
          href="https://www.histories.cc/verify?token=1234"
          style="
            background-color: #fc6e47;
            color: white;
            border: 0;
            border-radius: 8px;
            padding: 8px 30px;
            font-size: 14px;
            font-weight: bold;
            text-decoration: none;
            margin: auto;
          "
        >
          Confirm
        </a>
      </div>
      <p>If this wasn’t you, ignore this email and don’t click confirm.</p>

      <footer
        style="
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        "
      >
        <div
          style="
            display: flex;
            gap: 8px;
            justify-content: center;
            text-align: center;
            line-height: 40px;
          "
        >
          <img
            src="https://www.histories.cc/logo/small.png"
            alt="logo"
            height="40px"
            width="40px"
            style="border-radius: 8px"
          />
          <a
            href="https://www.histories.cc"
            style="font-weight: bold; text-decoration: none; color: black"
          >
            histories.cc
          </a>
        </div>
        <p style="color: #6a6a6a; text-align: center">
          Don’t want to receive these emails?<br />
          <a
            href="https://www.histories.cc/settings/notifications"
            style="color: #fc6e47; text-decoration: none"
          >
            Unsubscribe here
          </a>
        </p>
        <p>© 2022 Kryštof Krátký. All rights reserved.</p>
      </footer>
    </section>
  </body>
</html>
`;

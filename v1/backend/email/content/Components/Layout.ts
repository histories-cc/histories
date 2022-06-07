import { Footer, Header } from '.';

function Layout(inside: string, title: string) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${title}</title>
      </head>
      <body
        style="font-family: Roboto, Arial, Helvetica, sans-serif; font-size: 16px"
      >
        <section style="margin: auto; max-width: 469px; display: block">
          ${Header}
            ${inside}
          ${Footer}
        </section>
      </body>
    </html>
    
  `;
}

export default Layout;

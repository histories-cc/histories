import Cookie from 'js-cookie';
import Router from 'next/router';

const LogOut = () => {
  Cookie.remove('session');
  Router.reload();
};

export default LogOut;

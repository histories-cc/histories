import Cookie from 'js-cookie';
import Router from 'next/router';

const LogOut = () => {
  Cookie.remove('jwt');
  Router.reload();
};

export default LogOut;

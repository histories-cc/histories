import Head from 'next/head';
import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/router';

const checkCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  
  return;
};

const Log_in = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <Head>
        <title>log in</title>
        <meta name="description" content="login to histories" />
      </Head>
      <div className="bg-red-500">{errorMessage}</div>
      email
      <input
        className="bg-blue-100 border-gray-700 border-2"
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <br />
      password
      <input
        className="bg-blue-100 border-gray-700 border-2"
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <br />
      <button
        className="bg-blue-100 border-gray-700 border-2"
      >
        log in
      </button>
      <br />
      <button
        className="bg-blue-100 border-gray-700 border-2"
        
      >
        log out
      </button>
    </>
  );
};

export default Log_in;

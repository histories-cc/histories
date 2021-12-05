import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import { LoginContext } from '../../components/Layout';
import { Navbar } from '../../components/Navbar';

// Component
const Component = {
  title: 'Navbar',
  component: Navbar,
};
export default Component;

// Template
const Template: Story<{
  loading: boolean;
  isUserLoggedIn?: boolean;
  data: {
    isLogged: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      verified: string;
      profile?: string;
      collections: Array<{
        id: number;
        name: string;
        description: string;
        createdAt: number;
      }>;
    };
  };
}> = (args) => (
  <LoginContext.Provider
    value={{
      ...args,
      data: {
        isLogged: args.isUserLoggedIn
          ? {
              ...args.data.isLogged,
              profile:
                args.data.isLogged.profile ??
                `https://avatars.dicebear.com/api/initials/${args.data.isLogged.firstName}%20${args.data.isLogged.lastName}.svg`,
            }
          : null,
      },
      error: undefined,
      refetch: undefined,
    }}
  >
    <Navbar />
  </LoginContext.Provider>
);

// Examples
export const Primary = Template.bind({});
Primary.args = {
  // loading data from query
  loading: false,
  isUserLoggedIn: true,
  // logged context mock up
  data: {
    isLogged: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      profile: `https://avatars.dicebear.com/api/initials/test%20test.svg`,
      verified: 'true',
      collections: [
        {
          id: 1,
          name: 'Collection 1',
          description: 'Collection 1 description',
          createdAt: 1638605250347,
        },
      ],
    },
  },
};

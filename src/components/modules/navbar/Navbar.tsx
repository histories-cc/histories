import { useSearchQuery } from '@graphql/queries/search.graphql';
import { Menu, Transition } from '@headlessui/react';
import MeContext from '@src/contexts/MeContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiSearch } from 'react-icons/hi';

import DropdownTransition from '../dropdown/DropdownTransition';
import { NavbarItem, UserDropdown } from './index';

interface SearchInput {
  q: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const meContext = React.useContext(MeContext); // me context
  const { t } = useTranslation<string>(); // i18n
  const userIsLogged = meContext.data?.me?.id; // if user is logged in
  const { register } = useForm<SearchInput>(); // search input
  const searchQuery = useSearchQuery({ variables: { input: { text: '' } } }); // search query for search input
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  if (meContext.error) console.error(meContext.error);

  return (
    <nav className="fixed z-50 w-full bg-white border-b border-gray-200 dark:text-white dark:bg-[#171716] dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-full max-w-6xl px-4 py-2 m-auto">
        {/* LEFT SIDE */}
        <span className="flex items-center h-full gap-2 text-gray-600 dark:text-zinc-100">
          {/* SEARCH */}
          <HiSearch className="block w-5 h-5 md:hidden" />

          <form
            action="/search"
            className="relative items-center hidden w-full px-4 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 max-w-[240px] rounded-xl gap-2 md:flex"
          >
            {/* SEARCH ICON */}
            <button type="submit">
              <HiSearch className="w-5 h-5 text-zinc-300" />
            </button>
            <input
              {...register('q')}
              onFocus={() => setSearchFocused(true)} // when input is focused
              onBlur={
                () => setTimeout(() => setSearchFocused(false), 500) // timeout so click on result is registered before blur
              } // when input is not focused
              onChange={
                async (e) =>
                  await searchQuery.refetch({ input: { text: e.target.value } }) // on input change refetch
              }
              className="inline-block w-full py-2 placeholder-gray-600 dark:placeholder-zinc-500 bg-transparent border-none outline-none rounded-xl"
              placeholder="Search histories"
            />
            {/* SEARCH RESULTS */}
            {searchFocused && (
              <div className="absolute left-0 w-full bg-white border border-gray-200 shadow-md top-12 rounded-xl max-w-[360px]">
                {searchQuery.data?.search.posts.map((post) => (
                  <Link href={`/post/${post.id}`} key={post.id} passHref>
                    <div className="block px-1 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-400">
                      {post?.description?.substring(0, 32)}...
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <NavbarItem
            text="Home"
            href="/home"
            active={router.pathname === '/home'}
          />
          <NavbarItem
            text={t('map')}
            href="/"
            active={router.pathname === '/'}
          />
        </span>

        {/* RIGHT SIDE */}
        <span className="flex items-center gap-2 pr-č">
          {userIsLogged ? (
            <UserDropdown />
          ) : (
            <>
              <span className="hidden md:block">
                <Link href="/login">
                  <a className="block px-4 py-1 font-semibold text-gray-600 border border-transparent hover:bg-gray-200 hover:border-gray-200 translate ease-in-out duration-200 rounded-md dark:text-gray-200">
                    {t('login')}
                  </a>
                </Link>
              </span>
              <span className="hidden md:block">
                <Link href="/register">
                  <a className="block px-4 py-1 font-medium bg-gray-800 border border-gray-800 rounded-md text-gray-50">
                    {t('register')}
                  </a>
                </Link>
              </span>
              <span className="block md:hidden">
                <Menu as="div" className="relative">
                  <Menu.Button
                    as="div"
                    className="relative w-8 h-8 bg-gray-400 border-2 border-transparent rounded-full cursor-pointer transition ease-in-out"
                  ></Menu.Button>
                  <Transition as={Fragment} {...DropdownTransition}>
                    <Menu.Items
                      as="div"
                      className="absolute right-0 z-50 flex flex-col w-48 mt-2 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
                    >
                      <Link href="/login" passHref>
                        <Menu.Item
                          as="div"
                          className="rounded-t-lg dropdown-item"
                        >
                          {t('login')}
                        </Menu.Item>
                      </Link>

                      <Link href="/register" passHref>
                        <Menu.Item as="div" className="dropdown-item">
                          {t('register')}
                        </Menu.Item>
                      </Link>

                      {/* CLOSE */}
                      <Menu.Item
                        as="div"
                        className="rounded-b-lg dropdown-item"
                      >
                        {t('close')}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </span>
            </>
          )}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;

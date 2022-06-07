import Suspense from '@components/elements/Suspense';
import { useSearchQuery } from '@graphql';
import { Menu, Transition } from '@headlessui/react';
import MeContext from '@src/contexts/MeContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useContext, useEffect, useState } from 'react';
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
  const meContext = useContext(MeContext); // me context
  const { t } = useTranslation<string>(); // i18n
  const [userIsLogged, setUserIsLogged] = useState<boolean>(
    meContext.data?.me?.profile !== undefined
  );

  useEffect(() => {
    setUserIsLogged(meContext.data?.me?.profile !== undefined);
  }, [meContext.data]);

  const { register } = useForm<SearchInput>(); // search input
  const searchQuery = useSearchQuery({ variables: { input: { text: '' } } }); // search query for search input
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  if (meContext.error) console.error(meContext.error);

  return (
    <nav className="fixed z-50 w-full bg-white border-b border-gray-200 dark:text-white dark:bg-[#171716] dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-full max-w-6xl px-4 py-2 m-auto">
        {/* LEFT SIDE */}
        <span className="flex items-center h-full text-gray-600 gap-2 dark:text-zinc-100">
          {/* SEARCH */}
          <HiSearch className="block w-5 h-5 md:hidden" />

          <form
            action="/search"
            className="relative items-center hidden w-full px-4 bg-white border border-gray-300 dark:bg-zinc-700 dark:border-zinc-600 max-w-[240px] rounded-xl gap-2 md:flex"
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
              className="inline-block w-full py-2 placeholder-gray-600 bg-transparent border-none outline-none dark:placeholder-zinc-500 rounded-xl"
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
        <span className="flex items-center gap-4">
          <Suspense
            condition={!userIsLogged}
            fallback={
              <>
                <Link href="/create/post">
                  <a className="block px-4 py-2 font-bold text-white rounded-lg transition ease-in-out bg-brand">
                    {t('create_post')}
                  </a>
                </Link>
                <UserDropdown />
              </>
            }
          >
            <>
              <span className="hidden md:block">
                <Link href="/login">
                  <a className="block px-4 py-2 font-bold text-gray-600 rounded-lg dark:text-gray-200 transition ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                    {t('login')}
                  </a>
                </Link>
              </span>
              <span className="hidden md:block">
                <Link href="/register">
                  <a className="block px-4 py-2 font-bold text-white rounded-lg transition ease-in-out bg-brand">
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
          </Suspense>
        </span>
      </div>
    </nav>
  );
};

export default Navbar;

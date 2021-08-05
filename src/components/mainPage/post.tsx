import Link from 'next/link';
import React, { FC } from 'react';

import { BiShare, BiCollection } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa';
import { HiOutlineHeart, HiOutlineLocationMarker } from 'react-icons/hi';

const Post: FC<{
  key: number;
  url: string;
  username: string;
  description: string;
}> = ({ url, username, key, description }) => {
  return (
    <div
      key={key}
      className="w-full p-4 mb-12 rounded-2xl text-white"
      style={{ backgroundColor: '#242526' }}
    >
      <div className="w-full">
        <div className="float-left flex">
          <div className="h-10 w-10 bg-gray-600 rounded-full mb-4"></div>
          <Link href={`/${username}`}>
            <a className="pl-2 pt-1.5 text-blue-500 ">{username}</a>
          </Link>
        </div>

        <div className="float-right pt-1.5">
          <Link href="/">
            <a className="text-blue-500 flex">
              <HiOutlineLocationMarker size={24} className="mx-2" />
              Pardubice hlavní nádraží
            </a>
          </Link>
        </div>
      </div>
      <div className="w-full mt-14 mb-4 text-white">{description}</div>
      <img className="w-full rounded-lg" src={url} alt="post from userxxx" />

      <div className="w-full h-12 pt-2">
        <div className="flex float-left">
          <HiOutlineHeart size={36} className="mr-2" />
          <FaRegComment size={32} className="mx-2" />
          <BiShare size={36} className="mx-2" />
        </div>
        <div className="float-right">
          <BiCollection size={36} className="mx-2" />
        </div>
      </div>
    </div>
  );
};

export default Post;

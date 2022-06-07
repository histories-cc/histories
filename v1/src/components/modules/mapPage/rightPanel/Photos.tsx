import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { MapContext } from '@src/contexts/MapContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const Photos = () => {
  const mapContext = React.useContext(MapContext);

  return (
    <>
      {mapContext.postsQuery?.data?.posts.map((post: any) => {
        return (
          <motion.div
            key={post.id}
            className="flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            {post.url && (
              <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
                <Image
                  src={UrlPrefix + post.url[0]}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="rounded-t-lg"
                  alt="Profile picture"
                />
              </div>
            )}
            <div className="px-4 py-2">
              <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
                {post?.description?.substring(0, 35)}...
              </h3>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

export default Photos;

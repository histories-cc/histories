import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/solid';
import { Avatar } from '../../atoms';

interface ICommentProps {
  id: string;
  createdAt: Date;
  author: {
    username: string;
    firstName: string;
    lastName?: string;
    profile: string;
  };
  content: string;
  likes: number;
  iLike: boolean;
}

const Comment: React.FC<ICommentProps> = ({
  id,
  author,
  createdAt,
  likes,
  iLike: iLiked,
  content,
}) => {
  const isLogged = true;

  // variables
  const likesWithoutMe = iLiked ? likes - 1 : likes;

  // states
  const [iLike, setILike] = useState<boolean>(iLiked);

  function OnLike() {}

  function OnUnlike() {}

  useEffect(() => {
    if (iLike) {
      OnLike();
    } else {
      OnUnlike();
    }
  }, [iLike]);

  return (
    <div className="rounded-lg p-4 bg-white flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Avatar src={author.profile} />
          <div>
            <strong className="text-base">
              {author.firstName} {author?.lastName}
            </strong>
          </div>
        </div>
        <strong className="text-xs">
          {createdAt.toLocaleDateString('cs')}
        </strong>
      </div>
      <p className="text-base px-3">{content}</p>
      <div className="flex gap-1 text-subtle font-medium px-3 text-base">
        <div
          onClick={() => isLogged && setILike(!iLike)}
          className="cursor-pointer flex gap-1"
        >
          <HeartIcon
            className={`${iLike ? 'text-brand' : 'text-subtle'} w-5`}
          />
          {likesWithoutMe + (iLike ? 1 : 0)}
        </div>
      </div>
    </div>
  );
};

export default Comment;

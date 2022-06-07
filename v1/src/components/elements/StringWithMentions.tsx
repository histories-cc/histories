import MeContext from '@src/contexts/MeContext';
import Link from 'next/link';
import React, { useContext } from 'react';

interface ITextWithMentionsProps {
  text: string;
}

const StringWithMentions: React.FC<ITextWithMentionsProps> = ({ text }) => {
  const meContext = useContext(MeContext);

  return (
    <>
      {text
        .split(' ') // split text by spaces to array of words
        .map((word) =>
          word[0] === '@' ? ( // if word starts with @ (mention) create link to user profile
            <Link href={`/user/${word.substring(1)}`}>
              <a
                className={`${
                  word.substring(1) === meContext.me?.username
                    ? 'bg-yellow-500/40 rounded-lg p-1 text-yellow-700'
                    : 'text-blue-600'
                }`}
              >
                {' ' + word}
              </a>
            </Link>
          ) : word[0] === '#' ? ( // if word starts wit # (hashtag) create link to tag
            <Link href={`/tag/${word.substring(1)}`}>
              <a className="text-blue-600">{' ' + word}</a>
            </Link>
          ) : word[0] === '*' && word.at(-1) === '*' ? (
            <span className="font-semibold">
              {' ' + word.substring(1, word.length - 1) + ' '}
            </span>
          ) : word[0] === '_' && word.at(-1) === '_' ? (
            <span className="italic">
              {' ' + word.substring(1, word.length - 1) + ' '}
            </span>
          ) : (
            // else just return word
            ' ' + word + ' '
          )
        )}
    </>
  );
};

export default StringWithMentions;

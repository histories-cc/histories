const ValidateHashtag = (hashtag: string): { error: string | null } => {
  const regex = /^[a-zA-Z0-9-_]{4,32}$/i;
  // ok
  if (regex.test(hashtag)) return { error: null };
  // invalid
  return { error: 'Hashtag is not valid' };
};

export default ValidateHashtag;

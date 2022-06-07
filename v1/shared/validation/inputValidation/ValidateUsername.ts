const ValidateUsername = (
  username: string
): {
  error: string | null;
} => {
  const regex = /^[a-zA-Z0-9_.]{4,32}$/i;

  // is undefined || null || ""
  if (!username)
    return { error: 'Username has to be longer than 3 characters' };
  // regex
  else if (regex.test(username)) return { error: null };
  else {
    // too short
    if (username.length < 4)
      return { error: 'Username has to be longer than 3 characters' };
    // too long
    else if (username.length > 32)
      return { error: 'Username has to be shorter than 32 characters' };
    // contains forbidden characters
    else
      return {
        error:
          'Username can only contain letters, numbers, underscores and periods',
      };
  }
};

export default ValidateUsername;

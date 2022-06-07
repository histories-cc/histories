const ValidatePassword = (
  password: string
): {
  error: string | null;
} => {
  // too short
  if (password.length < 8)
    return { error: 'Password has to be longer than 8 characters' };
  // too long
  else if (password.length > 128)
    return { error: 'Password has to be shorter than 128 characters' };
  // ok
  else return { error: null };
};

export default ValidatePassword;

const ValidateName = (
  name: string
): {
  error: string | null;
} => {
  const regex = /^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:'¨[\]"`]{1,}$/i;

  // too short
  if (name.length === 0) return { error: 'is empty' };
  // too long
  else if (name.length > 128)
    return { error: 'has to be shorter than 128 characters' };
  // regex
  else if (regex.test(name)) return { error: null };
  // contains forbidden characters
  else return { error: 'can\'t contain special characters like \\/*?!"<>|' };
};

export default ValidateName;

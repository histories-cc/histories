// validate comment
const ValidateComment = (text: string): { error: string | null } => {
  const regex = /^(?!.*(\/|\\|\||"|`)).*/i;
  // too longe
  if (text.length > 8000) return { error: 'Comment is too long' };
  // empty
  if (text.length == 0) return { error: 'Comment cannot be empty' };
  else if (regex.test(text)) return { error: null };
  else return { error: 'Description contains invalid characters' };
};

export default ValidateComment;

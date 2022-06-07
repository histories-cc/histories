// validate photo description, collection description, user bio..e
const ValidateDescription = (text: string): { error: string | null } => {
  const regex = /^(?!.*(\/|\\|\||"|`)).*/i;
  // too longe
  if (text.length > 150) return { error: 'Description is too long' };
  else if (regex.test(text)) return { error: null };
  else return { error: 'Description contains invalid characters' };
};

export default ValidateDescription;

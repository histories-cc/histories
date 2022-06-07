const GeneratedProfileUrl = (firstName: string, lastName: string) => {
  return `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
    firstName
  )}%20${encodeURIComponent(lastName)}.svg`;
};

export default GeneratedProfileUrl;

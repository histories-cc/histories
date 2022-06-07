function SSRRedirect(to: string) {
  return {
    redirect: {
      destination: to,
      permanent: false,
      basePath: false,
    },
  };
}

export default SSRRedirect;

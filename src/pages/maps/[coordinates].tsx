import { GetServerSideProps } from "next"

export default () => { }

// compatibility with Google maps - when maps.google.com is replaced with histories.cc show the same coordinates on map
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const rgx = /^@([0-9]|.)*,([0-9]|.)*,([0-9]|.)*z$/

  if (typeof query.coordinates !== "string" || !rgx.test(query.coordinates))
    return {
      redirect: {
        permanent: false,
        destination: `/`
      },
    };


  const coordinates = query.coordinates
  const [lat, lng, z] = coordinates.substring(1, coordinates.length - 2).split(",")
  return {
    redirect: {
      permanent: false,
      destination: `/?lat=${lat}&lng=${lng}&z=${z}`,
    },
  };

}

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import UserLayout from '@components/Layouts/User';
import MapStyleMenu from '@components/Modules/map/MapStyleMenu';
import Marker from '@components/Modules/Minimap/Marker';
import Card from '@components/Modules/UserPage/Card';
import { PostsDocument } from '@graphql/post.graphql';
import { UserDocument, UserQuery } from '@graphql/user.graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@lib/functions';
import GetMapStyle from '@lib/functions/map/GetMapStyle';
import { IViewport, MapStyles } from '@lib/types/map';
import { GetServerSidePropsContext } from 'next';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMapGL from 'react-map-gl';

import UrlPrefix from '../../../shared/config/UrlPrefix';
import { ValidateUsername } from '../../../shared/validation';

const UserMapPage: React.FC<{
  userQuery: UserQuery;
  postsTmp: any;
}> = ({ userQuery, postsTmp }) => {
  const user = userQuery.user;

  const [viewport, setViewport] = useState<IViewport>({
    latitude: 50,
    longitude: 15,
    zoom: 9,
    bearing: 0,
    pitch: 0,
  });
  const { t } = useTranslation();

  const [mapStyle, setMapStyle] = useState<MapStyles>('theme');

  const { resolvedTheme } = useTheme();

  return (
    <UserLayout
      user={user}
      currentTab="map"
      head={{
        title: `${user.firstName}'s map | hiStories`,
        description: `${user.firstName}'s map of posts on HiStories`,
        canonical: `https://www.histories.cc/user/${user.username}/map`,
        openGraph: {
          title: `${user.firstName} ${user.lastName} | HiStories`,
          type: 'website',
          images: [
            {
              url: user.profile.startsWith('http')
                ? user.profile
                : UrlPrefix + user.profile,
              width: 92,
              height: 92,
              alt: `${user.firstName}'s profile picture`,
            },
          ],
          url: `https://www.histories.cc/user/${user.username}/map`,
          description: `${user.firstName}'s map of posts on HiStories`,
          site_name: 'Profil map page',
          profile: user,
        },
      }}
    >
      <div className="flex flex-col w-full h-full gap-4">
        {postsTmp.length < 1 && (
          <Card warning>
            <div>{t('no_posts')}</div>
          </Card>
        )}
        <ReactMapGL
          {...viewport}
          {...{
            width: '100%',
            height: '100%',
            className: 'rounded-lg relative',
            // default map style by theme
            mapStyle: GetMapStyle(mapStyle, resolvedTheme),
            mapboxApiAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN, // MAPBOX API ACCESS TOKEN
          }}
          onViewportChange={setViewport}
        >
          {
            // postsQuery.loading ?
            postsTmp.map((post: any) => (
              <Marker
                key={post.id}
                latitude={post.place.latitude}
                longitude={post.place.longitude}
                onClick={
                  // on click set viewport to marker location
                  () =>
                    setViewport({
                      latitude: post.place.latitude,
                      longitude: post.place.longitude,
                      zoom: 14,
                      bearing: 0,
                      pitch: 0,
                    })
                }
              />
            ))
          }
          <div className="absolute z-40 right-2 bottom-2">
            <MapStyleMenu setMapStyle={setMapStyle} viewport={viewport} />
          </div>
        </ReactMapGL>
      </div>
    </UserLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        'http://localhost:3000/api/graphql',
      headers: {
        authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),

    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next')) {
    // check if username is valid, if not redirect to 404 page with argument
    if (typeof ctx.query.username !== 'string')
      return SSRRedirect('/404?error=user_does_not_exist');

    const validateUsername = ValidateUsername(ctx.query.username).error;
    if (validateUsername) return SSRRedirect('/404?error=user_does_not_exist');

    try {
      const { data: userQuery }: { data: UserQuery } = await client.query({
        query: UserDocument,
        variables: { input: { username: ctx.query.username } },
      });

      const { data: postsData } = await client.query({
        query: PostsDocument,
        variables: {
          input: {
            filter: {
              authorUsername: ctx.query.username,
              skip: 0,
              take: 200,
            },
          },
        },
      });

      // return props
      return {
        props: {
          userQuery,
          postsTmp: postsData.posts,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=user_does_not_exist');
    }
  }
  return {
    // @ts-ignore
    // this should not be needed 🤷‍♀️
    props: { user: { username: ctx.query.username }, anonymous },
  };
};
export default UserMapPage;

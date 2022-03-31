import { QueryResult } from '@apollo/client';
import { MapPlacesQuery } from '@graphql';
import { PostsQuery } from '@graphql';
import React from 'react';

import {
  Exact,
  InputMaybe,
  Maybe,
  PlacesInput,
  PostsInput,
} from '../../../src/graphql/index';
import { IBounds, IViewport } from '../map';

interface IMapContext {
  bounds: IBounds;
  setBounds: React.Dispatch<React.SetStateAction<IBounds>>;
  whatToShow: 'places' | 'photos';
  setWhatToShow: React.Dispatch<React.SetStateAction<'places' | 'photos'>>;
  viewport: IViewport;
  setViewport: React.Dispatch<React.SetStateAction<IViewport>>;
  sidebarPlace: Maybe<number>;
  setSidebarPlace: React.Dispatch<React.SetStateAction<Maybe<number>>>;
  timeLimitation: [number, number];
  setTimeLimitation: React.Dispatch<React.SetStateAction<[number, number]>>;
  placesQuery:
    | QueryResult<
        MapPlacesQuery,
        Exact<{
          input?: InputMaybe<PlacesInput> | undefined;
        }>
      >
    | undefined;
  postsQuery:
    | QueryResult<
        PostsQuery,
        Exact<{
          input?: InputMaybe<PostsInput> | undefined;
        }>
      >
    | undefined;
  hoverPlaceId: number | null;
  setHoverPlaceId: React.Dispatch<React.SetStateAction<number | null>>;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default IMapContext;

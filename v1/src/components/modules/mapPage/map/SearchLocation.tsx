import { Combobox, ComboboxInput, ComboboxOption } from '@reach/combobox';
import { IViewport } from '@src/types/map';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiSearch } from 'react-icons/hi';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

interface SearchLocationProps {
  viewport: IViewport;
  setViewport: React.Dispatch<React.SetStateAction<IViewport>>;
}

const SearchLocation: React.FC<SearchLocationProps> = ({
  viewport,
  setViewport,
}) => {
  const { t } = useTranslation<string>(); // i18n
  const [showList, setShowList] = useState<boolean>(false); // show list of results
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete(); // get suggestions from Google maps

  // on select
  function handleSelect(val: string) {
    setValue(val, false); // set value of the input field

    getGeocode({ address: val }) // get coordinates of the selected search result
      .then((results) => getLatLng(results[0])) // get coordinates
      .then(({ lat, lng }) =>
        setViewport({ ...viewport, latitude: lat, longitude: lng, zoom: 14 })
      ) // set coordinates
      .catch((error) => console.log('😱 Error: ', error)); // error handling
  }

  return (
    <div className="w-full max-w-screen md:max-w-[40vw]">
      <Combobox
        onSelect={handleSelect}
        aria-labelledby="demo"
        openOnFocus={true}
        className="h-auto px-2 py-2 leading-tight text-gray-700 bg-white border appearance-none rounded-xl focus:outline-none focus:shadow-outline"
      >
        <div className="flex w-full">
          {/* INPUT */}
          <ComboboxInput
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!showList) setShowList(true);
              setValue(e.target.value);
            }} // on change
            onFocus={() => setShowList(true)}
            onBlur={() => setTimeout(() => setShowList(false), 200)} // without delay the list will be hidden before click is registered
            disabled={!ready} // disable input field if suggestions are not ready
            placeholder={t('search_place')} // placeholder text
            className="inline-block w-full px-2 py-1 placeholder-gray-600 bg-transparent border-none outline-none rounded-xl"
          />
          {/* SEARCH ICON */}
          <button>
            <HiSearch className="w-6 h-6 text-gray-300" />
          </button>
        </div>
        {/* SEARCH RESULTS */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: data.length > 0 && showList ? 'auto' : 0 }}
          exit={{ height: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex flex-col w-full overflow-y-hidden divide-y"
        >
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <div key={place_id} className="py-0.5">
                <ComboboxOption
                  key={place_id}
                  className="px-2 text-black list-none rounded-lg cursor-pointer py-1.5 hover:bg-blue-500 hover:text-white"
                  value={description}
                  draggable={false}
                />
              </div>
            ))}
        </motion.div>
      </Combobox>
    </div>
  );
};

export default SearchLocation;

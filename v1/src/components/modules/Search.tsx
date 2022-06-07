import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import React from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

const PlacesAutocomplete = ({ setSearchCoordinates }: any) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete();

  const handleInput = (e: any) => {
    setValue(e.target.value);
  };

  const handleSelect = (val: string) => {
    setValue(val, false);

    getGeocode({ address: val })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setSearchCoordinates({ lat, lng });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  return (
    <Combobox
      onSelect={handleSelect}
      aria-labelledby="demo"
      openOnFocus={true}
      className="h-auto px-2 py-2 leading-tight text-gray-700 bg-white border rounded-lg shadow appearance-none w-[300px] focus:outline-none focus:shadow-outline"
    >
      <div className="flex w-full">
        <BiSearchAlt2 size={24} />
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="search place"
          className="inline-block w-full px-2 border-none rounded-lg outline-none text-light-text"
        />
        {value.length > 0 && (
          <button
            onClick={() => {
              setValue('');
            }}
          >
            x
          </button>
        )}
      </div>
      <ComboboxPopover portal={false}>
        <ComboboxList className="w-full">
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                className="px-2 py-1 rounded-lg cursor-pointer hover:bg-[#242526] hover:text-white"
                key={place_id}
                value={description}
                draggable={false}
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default PlacesAutocomplete;

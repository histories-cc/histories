import { MapStyles } from '@src/types/map';

import { Dark, Light, Satellite } from '../../constants/MapStyles';

function GetMapStyle(style: MapStyles, theme?: string) {
  return style === 'theme'
    ? theme === 'dark'
      ? Dark
      : Light
    : style === 'dark'
    ? Dark
    : style === 'satellite'
    ? Satellite
    : Light;
}

export default GetMapStyle;

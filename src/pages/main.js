import React, { forwardRef, useRef, useState } from 'react';
import MapWrap from '../components/Map/index';
import styles from "./main.less";
import SliderLayer from './layers/SliderLayer';
import RealTime from './layers/RealTime';
import LayerSwitch from '@/components/LayerSwitch';

const menus = [
  {
    label: 'RealTime',
    value: 'RealTime',
    checked: true,
  },
  {
    label: 'Archives',
    value: 'Archives',
    // checked: true,
  },
];

export default function (props) {
  const [layerType, updateLayerType] = useState(menus[0].value);
  const layerRef = useRef(null);
  const LayerRender = forwardRef((props, ref) => {
    if (layerType === 'RealTime') {
      return <RealTime ref={ref} {...props} />;
    }
    return <SliderLayer ref={ref} {...props} />
  });

  const onChange = event => {
    console.log(event.target.value);
    updateLayerType(event.target.value);
  };

  console.log(layerRef.current);

  return (
    <div className={styles.wrap}>
      <MapWrap>
        <LayerSwitch tabs={menus} onChange={onChange} />
        <LayerRender ref={layerRef} />
      </MapWrap>
    </div>
  );
}

import React from 'react';
import { Vector } from '@/viz/layers/Vector';
import popup, { getPopupContent } from '@/components/Popup';

class RealTime extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      // lists: [],
    };

    this.lists = [];

    this.layerId = 'RealTime';

    this.selectFeature = null;

    this.message = null;

    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.initLayer();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.selectFeature) {
      this.selectFeature.removePopup();
    }

    if (this.message) {
      this.message && this.message();
      this.message = null;
    }

    this.layer && this.layer.destroyed();
    // window.map.clearPopup && window.map.clearPopup();
  }

  handleClick(features) {
    if (features && features.length > 0) {
      const current = features[0];
      const properties = current.getProperties();

      if (!popup['Test']) {
        console.warn(`不存在的气泡类型 - [Test]`);
      }
      const content = getPopupContent(
        popup['Test'],
        '',
        properties,
      );

      current.setInfoWindow({
        content,
        autoPan: true,
        width: 120,
        // 'minHeight': 120,
        'custom': true,
        // 'autoOpenOn' : 'click',
        autoCloseOn: true,
        dx: 0,
        dy: 5,
      });
      setTimeout(() => {
        current.openInfoWindow();
      });
    } else {
      console.log('click none');
    }
  }

  initLayer() {
    this.layer = new Vector(this.layerId, window.map, {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            color: '#fe7316',
            label: 'TEST1'
          },
          geometry: {
            type: 'Point',
            coordinates: [104.21, 36.42],
          },
        },
        {
          type: 'Feature',
          properties: {
            color: '#1bc8ff',
            label: 'TEST2'
          },
          geometry: {
            type: 'Point',
            coordinates: [103.21, 36.42],
          },
        },
      ],
    }, {});
    this.layer.on('click', this.handleClick, this);
  }

  render() {
    return null;
  }
}

export default RealTime;

import { VectorLayer, GeoJSON } from 'maptalks';

import Base from './Base';

export class Vector extends Base {
  constructor(id, map, data, options = {}) {
    super(id, map, data);

    this.options = options;

    this.addLayers();
  }

  addLayers() {
    const layer = this.checkLayer(this.layerId);
    if (!layer) {
      this.layer = new VectorLayer(this.layerId, this.data, {
        enableSimplify: false,
        style: [
          {
            symbol: {
              // lineColor: '#fe7316',
              lineColor: {
                property: 'color',
                type: 'identity',
              },
              lineWidth: 1.5,
              'markerType' : 'ellipse',
              'markerFill' : {
                property: 'color',
                type: 'identity',
              },
              'markerFillOpacity' : 0.9,
              'markerWidth' : 55,
              'markerHeight' : 55,
              'markerLineWidth' : 0,
              textFaceName: 'sans-serif',
              textName: '{label}', // value from name in geometry's properties
              textWeight: 'normal', // 'bold', 'bolder'
              textStyle: 'normal', // 'italic', 'oblique'
              textSize: 13,
              textFont: null, // same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
              textFill: '#34495e',
              textOpacity: 1,
              textHaloFill: '#fff',
              textHaloRadius: 1,
              textWrapWidth: null,
              textWrapCharacter: '\n',
              textLineSpacing: 0,
              textDx: 0,
              textDy: 0,
              textHorizontalAlignment: 'middle', // left | middle | right | auto
              textVerticalAlignment: 'middle', // top | middle | bottom | auto
              textAlign: 'center', // left | right | center | auto
            },
          },
        ]
      });

      this.map.addLayer(this.layer);

      this.addEvents();
    }
  }

  updateFeature() {
    if (this.data) {
      this.features = GeoJSON.toGeometry(this.data);
    }
    if (this.layer) {
      this.layer.clear();
      this.layer.addGeometry(this.features);
    }
  }

  removeLayers() {
    const layer = this.checkLayer(this.layerId);
    if (layer) {
      this.map.removeLayer(layer);
    }
  }

  handleClick(event) {
    this.map.identify(
      {
        coordinate: event.coordinate,
        layers: [this.layer],
      },
      geos => {
        console.log(this, geos);
        this.emit(
          'click',
          geos.filter(geo => geo.type !== 'MultiPoint'),
        );
      },
    );
  }

  /**
   * 添加事件监听
   */
  addEvents() {
    super.addEvents();
    this.map.on('click', this.handleClick, this);
  }

  /**
   * 移除事件监听
   */
  removeEvents() {
    this.map.off('click', this.handleClick, this);
  }
}

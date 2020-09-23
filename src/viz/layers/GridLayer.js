// import * as maptalks from 'maptalks';
import { GridLayer as GLayer } from 'maptalks.gridlayer';

import Base from './Base';

export class GridLayer extends Base {
  constructor(id, map, data, options = {}) {
    super(id, map, data);

    this.options = options;

    this.addLayers();
  }

  setData(data) {
    if (data) {
      this.data = data;
    } else {
      this.data = null;
    }

    const layer = this.checkLayer(this.layerId);
    if (layer) {
      layer.setGrid(this.data, 0);
    }
  }

  addLayers() {
    const layer = this.checkLayer(this.layerId);
    if (!layer) {
      const layer = new GLayer(this.layerId, this.data, {
        symbol : {
          'lineWidth': 0
        }
      });

      this.map.addLayer(layer);

      this.addEvents();
    }
  }

  removeLayers() {
    const layer = this.checkLayer(this.layerId);
    if (layer) {
      this.map.removeLayer(layer);
    }
  }

  /**
   * 添加事件监听
   */
  addEvents() {
    super.addEvents();
  }

  /**
   * 移除事件监听
   */
  removeEvents() {}
}

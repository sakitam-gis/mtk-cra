import { ui, GeoJSON } from 'maptalks';
import EventEmitter from 'eventemitter3';
import popup, { getPopupContent } from '@/components/Popup';

export default class Base extends EventEmitter {
  constructor(id, map, data) {
    super();
    this.id = id;

    this.map = map;

    this.layerId = '';

    this.makeField();

    this.data = [];

    if (data) {
      this.setData(data);
    }
  }

  makeField() {
    this.layerId = `${this.id}-layer`;
  }

  setData(data) {
    const features = data.features.filter(d => d.geometry);

    this.data = {
      type: 'FeatureCollection',
      features: features || [],
    };

    this.updateFeature();
  }

  updateFeature() {
    if (this.data) {
      this.features = GeoJSON.toGeometry(this.data);
    }
  }

  clearData() {
    this.setData({
      features: [],
    });
  }

  getData() {
    return this.data;
  }

  remove() {}

  checkLayer(layerId) {
    return this.map.getLayer(layerId);
  }

  addLayers() {
    throw Error('should overwride');
  }

  removeLayers() {
    const layer = this.checkLayer(this.layerId);
    if (layer) {
      this.map.removeLayer(layer);

      this.layer = null;
    }
  }

  /**
   * 添加事件监听
   */
  addEvents() {
    this.removeEvents();
  }

  /**
   * 移除事件监听
   */
  removeEvents() {}

  setPopup(type, coordinate, options) {
    if (!popup[type]) {
      console.warn(`不存在的气泡类型 - [${type}]`);
    }
    const content = getPopupContent(popup[type], '', options);

    this.popup = new ui.InfoWindow({
      single: true,
      autoCloseOn: true,
      width: 300,
      height: 'auto',
      custom: true,
      dx: options.dx,
      dy: options.dy,
      content,
    })
      .show(coordinate)
  }

  openPopup() {
    if (!this.popup) return;
    this.popup.addTo(this.map);
  }

  removePopup() {
    if (!this.popup) return;
    this.popup.remove();
  }

  destroyed() {
    const { map } = this;
    if (!map) return;
    this.removeLayers();
    this.removeEvents();
  }
}

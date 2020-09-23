import "maptalks/dist/maptalks.css";
import React, { Component } from "react";
import { Map, TileLayer, GroupTileLayer } from "maptalks";
import styles from './index.less';

class MapComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      mapLoaded: false
    };
  }

  componentDidMount() {
    // this.createMap();
  }

  createMap(el) {
    if (el) {
      this.map = new Map(el, {
        center: [104.21, 36.42],
        // dragPitch: false,
        zoom: 7,
        minZoom: 2,
        maxZoom: 13,
        baseLayer: new GroupTileLayer("group", [
          new TileLayer("base", {
            urlTemplate:
              "https://mt{s}.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G",
            // 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            subdomains: [1, 2, 3],
            repeatWorld: true
            // debug: true,
          })
        ])
        // dragRotate: false,
        // attribution: false,
      });

      // var extent = this.map.getExtent();
      // this.map.setMaxExtent(extent);

      window.map = this.map;

      this.setState({
        mapLoaded: true
      });
    }
  }

  setRef = (el) => {
    if (el) {
      this.createMap(el);
    } else {
      // this.dis
    }
  };

  render() {
    const { children } = this.props;
    const { mapLoaded } = this.state;
    let childrens /*: React.ReactNodeArray */ = [];
    if (Array.isArray(children)) {
      childrens = children;
    } else {
      childrens.push(children);
    }

    return (
      <div className={styles.mapWarp}>
        <div ref={this.setRef} className={styles.map} />
        {mapLoaded && childrens}
      </div>
    );
  }
}

export default MapComponent;

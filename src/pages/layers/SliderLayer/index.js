import fde from 'fast-deep-equal';
import { throttle } from 'lodash';
import dayjs from '@/utils/dayjs';
import { getDataList, getData } from '@/service';
import { GridLayer } from '@/viz/layers/GridLayer';
import Base from './Base';

class GridLayerCom extends Base {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { params } = nextProps;
    if (!fde(params, prevState.params)) {
      return {
        params,
      };
    }
    return null;
  }

  constructor(props, context) {
    super(props, context);
    this.layerId = 'grid';
  }

  componentDidMount() {
    this.mounted = true;
    const { throttleEvent } = this.props;
    this.updateTimeList();
    this.initLayer();
    this.resizeHandler = throttleEvent
      ? throttle(this.resizeHandlerInner, 50)
      : this.resizeHandlerInner;
    window.addEventListener('resize', this.resizeHandler);
    this.fetchList();
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { params } = prevProps;
    if (params) {
      return params;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { params } = this.props;
    if (params && snapshot && !fde(params, snapshot)) {
      this.fetchList();
    }
  }

  initLayer() {
    const current = this.times[0];
    this.layer = new GridLayer(this.layerId, window.map, current);
  }

  // 默认时间的比对，如果确认返回列表无缺失，则可以省略
  updateTimeList() {
    const current = this.times[0];
    this.setState(
      prevState => ({
        ...prevState,
        current,
        data: this.times,
        showSlider: true,
      }),
      () => {
        this.resizeHandler();

        if (current) {
          this.updateLayerData();
        }
      },
    );
  }

  fetchList() {
    const { params } = this.props;
    const date = dayjs();
    getDataList({
      dataType: params?.dataType,
      startTime: date.format('YYYYMMDDHHmm'),
      endTime: date.add(2, 'hour').format('YYYYMMDDHHmm'),
    })
      .then(data => {
        this.times = data;

        const current = this.times[0];

        this.setState(
          prevState => ({
            ...prevState,
            current,
            data: this.times,
            showSlider: true,
          }),
          () => {
            if (current) {
              this.updateLayerData();
            }

            setTimeout(() => {
              this.resizeHandler();
            }, 100);
          },
        );
      })
      .catch(error => {
        console.error(error);
        this.setState({
          current: {},
          data: [],
        });
      });
  }

  async updateLayerData() {
    const { current } = this.state;
    const { onLayerUpdate } = this.props;

    if (this.message) {
      this.closeLoading(this.message);
    }

    try {
      const data = await getData(current?.id);
      if (!this.mounted) return false;
      if (data && data.code === 200 && this.layer) {
        this.layer.setData(data?.data);

        onLayerUpdate && onLayerUpdate(this.layer);
      }
      return true;
    } catch (e) {
      console.log(e);
      this.closeLoading(this.message);
      return false;
    }
  }
}

export default GridLayerCom;

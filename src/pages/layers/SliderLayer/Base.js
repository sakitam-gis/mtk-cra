import throttle from 'lodash/debounce';
import { Radio, message } from 'antd';
import React from 'react';
import ReactDom from 'react-dom';
import SliderWrap from '@/components/Player/main';
import SliderBar from '@/components/Player/slider';
import dayjs, { mockDataTime } from '@/utils/dayjs';
import styles from './index.less';

class Base extends React.Component {
  static defaultProps = {
    throttleEvent: true,
    onLayerInit: () => undefined,
    onLayerUpdate: () => undefined,
  };

  state = {
    marks: [],
    hasData: false,
    speed: 1000,
    showSlider: true,
    filterData: [],
    data: [],
    current: {},
  };

  constructor(props, context) {
    super(props, context);

    this.layerId = 'grid';

    this.sliderRef = React.createRef();

    this.times = [];

    this.message = null;

    this.mounted = false;
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
  }

  componentWillUnmount() {
    this.mounted = false;
    this.layer && this.layer.destroyed();
    if (this.message) {
      this.closeLoading(this.message);
    }
    window.removeEventListener('resize', this.resizeHandler);
  }

  updateTimeList() {
    let startTime = dayjs();
    const h = startTime.hour();
    const relh = h - (h % 6);
    startTime = startTime.hour(relh);
    const endTime = startTime.add(7, 'd');
    const lists = mockDataTime(startTime, endTime, {
      interval: 6 * 10,
      paddingRight: true,
      paddingLeft: true,
    });

    this.times = lists;
    const current = lists[0];
    this.setState(
      prevState => ({
        ...prevState,
        current,
        data: lists,
        showSlider: true,
      }),
      () => {
        this.resizeHandler();

        if (current) {
          // this.addImageTile(res[idx]);
          this.updateLayerData();
        }
      },
    );
  }

  initLayer() {}

  updateLayerData() {
    return Promise.resolve();
  }

  handleSliderChange = (type, item) => {
    if (type === 'inner') {
      this.setState(
        prevState => ({
          ...prevState,
          current: item,
        }),
        () => {
          this.updateLayerData();
        },
      );
    }
  };

  tipFormatter = value => {
    const { marks } = this.state;
    if (typeof marks[value] === 'string') {
      return <span>{marks[value]}</span>;
    }
    return <span>{marks[value].label}</span>;
  };

  onAfterChange = value => {
    const { marks } = this.state;
    const item = marks[value];
    if (item) {
      this.setState(
        prevState => ({
          ...prevState,
          level: item.value,
        }),
        () => {
          this.updateLayerData();
        },
      );
    }
  };

  handleSpeedChange = value => {
    this.setState({
      speed: Number(value?.target?.value || 1000),
    });
  };

  handlePreLoad(ctx, cp) {
    if (ctx.state.isPlaying) {
      cp.call(ctx);
    }
    // if (ctx.isPlaying && !this.preLoaded) {
    //   this.preLoadImages(this.times)
    //     .finally(() => {
    //       this.preLoaded = true;
    //       cp.call(ctx);
    //     });
    // }
  }

  /**
   * 后退
   * @param next
   */
  handlePrev = next => {
    if (this.sliderRef && this.sliderRef.current) {
      // @ts-ignore
      const value = this.sliderRef.current.getPrevValue();

      this.setState(
        prevState => ({
          ...prevState,
          current: value,
        }),
        () => {
          this.updateLayerData().then(res => {
            if (!this.mounted) {
              return false;
            }
            if (res) {
              next(() => {
                console.log('prev', value);
              });
            } else {
              message.error('上一帧数据获取失败');
            }
          });
        },
      );
    }
  };

  /**
   * 前进
   * @param next
   */
  handleNext = next => {
    if (this.sliderRef && this.sliderRef.current) {
      // @ts-ignore
      const value = this.sliderRef.current.getNextValue();

      this.setState(
        prevState => ({
          ...prevState,
          current: value,
        }),
        () => {
          this.updateLayerData().then(res => {
            if (!this.mounted) {
              return false;
            }
            if (res) {
              next(() => {
                // console.log('next', value);
              });
            } else {
              message.error('下一帧数据获取失败');
            }
          });
        },
      );
    }
  };

  resizeHandlerInner = () => {
    const slider = this.sliderRef;
    if (slider && slider.current) {
      // @ts-ignore
      const el = ReactDom.findDOMNode(slider.current);
      const w = 38;
      const len = this.times.length;
      const width = el.clientWidth;
      const rel = len * w;

      const compare = Math.ceil(rel / width);
      const filterData = this.times.map((item, idx) => ({
        ...item,
        showStep: idx % compare === 0,
        showLabel: idx % compare === 0,
      }));

      this.setState({
        filterData,
      });

      //console.log('filterData', filterData);
    }
  };

  createSpeed = () => {
    const { speed } = this.state;
    return (
      <div className="speed-switch">
        <Radio.Group
          defaultValue={speed}
          onChange={this.handleSpeedChange}
          buttonStyle="solid"
        >
          <Radio.Button value={2000}>慢</Radio.Button>
          <Radio.Button value={1000}>中</Radio.Button>
          <Radio.Button value={500}>快</Radio.Button>
        </Radio.Group>
      </div>
    );
  };

  closeLoading(loading) {
    loading && loading();

    this.message = null;
  }

  render() {
    const {
      // marks,
      showSlider,
      speed,
      filterData,
      data,
      current,
    } = this.state;

    return (
      <div className={styles.wrap}>
        {showSlider && (
          <SliderWrap
            autoplay={false}
            interval={speed}
            prev={this.handlePrev}
            next={this.handleNext}
            preStart={this.handlePreLoad}
            sliderRef={this.sliderRef}
            speedContent={this.createSpeed()}
            overlayClassName="slider-speed-wrap"
          >
            <SliderBar
              value={current}
              data={data}
              filterData={filterData}
              breakLine
              ref={this.sliderRef}
              onChange={this.handleSliderChange}
            />
          </SliderWrap>
        )}
      </div>
    );
  }
}

export default Base;

import './main.less';
import isFunction from 'lodash/isFunction';
import classnames from 'classnames';
import React, { Component } from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';

class SliderWrap extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      isPlaying: false,
    };
  }

  componentDidMount () {
    const { autoplay, immediate, preStart } = this.props;
    // const { isPlaying } = this.state;
    if (autoplay) {
      this.setState({
        isPlaying: true,
      });
      // eslint-disable-next-line no-unused-expressions
      preStart(this, () => {
        immediate && this.handleAutoPlay();
        this.initPlayer();
      }); // 自动播放时，默认预加载
    }
  }

  componentWillUnmount () {
    this.stop();
  }

  stop() {
    this.setState({
      isPlaying: false,
    });
    this.clearTimer();
  }

  resetPlayer() {
    this.setState({
      isPlaying: false,
    });
    this.clearTimer();
    const slider = this.getSlider();
    if (slider) {
      slider.resetIndex();
    }
  }

  getSlider() {
    const { sliderRef } = this.props;
    return sliderRef.current;
  }

  getNextValue() {
    const slider = this.getSlider();
    if (slider) {
      return slider.getNextValue();
    }
    return null;
  }

  getPrevValue() {
    const slider = this.getSlider();
    if (slider) {
      return slider.getPrevValue();
    }
    return null;
  }

  /**
   * 清空定时器
   */
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * 初始化自动播放定时器
   */
  initPlayer = () => {
    const { interval } = this.props;
    const { isPlaying } = this.state;
    if (isPlaying) {
      this.timer = setTimeout(() => {
        this.handleAutoPlay();
      }, interval);
    }
  }

  /**
   * 处理自动播放
   */
  handleAutoPlay = () => {
    const { next } = this.props;
    next(this.autoPlayCallback);
    // this.props.next(this.autoPlayCallback);
  }

  /**
   * 自动播放 callback（所有的下一步的执行必须等待外部调用接口成功）
   */
  autoPlayCallback = (cb) => {
    const slider = this.getSlider();
    if (slider) {
      slider.next();
      this.clearTimer();
      this.initPlayer();
      const value = slider.getValue();
      if (isFunction(cb)) {
        cb(value);
      }
    }
  }

  /**
   * 上一帧 callback（所有的下一步的执行必须等待外部调用接口成功）
   */
  prevCallback = (cb) => {
    const slider = this.getSlider();
    if (slider) {
      slider.prev();
      const value = slider.getValue();
      if (isFunction(cb)) {
        cb(value);
      }
    }
  }

  /**
   * 下一帧 callback（所有的下一步的执行必须等待外部调用接口成功）
   */
  nextCallback = (cb) => {
    const slider = this.getSlider();
    if (slider) {
      slider.next();
      const value = slider.getValue();
      if (isFunction(cb)) {
        cb(value);
      }
    }
  }

  /**
   * 上一帧处理函数
   */
  handlePrev = () => {
    const { prev } = this.props;
    prev(this.prevCallback);
  }

  /**
   * 下一帧处理函数
   */
  handleNext = () => {
    const { next } = this.props;
    next(this.nextCallback);
  }

  handleLayerType = () => {
    const { onLayerChange } = this.props;
    onLayerChange();
  };

  handlePlayState = () => {
    const { preStart, onPlayState } = this.props;
    this.setState((prevState) => ({
      ...prevState,
      isPlaying: !prevState.isPlaying,
    }), () => {
      const { isPlaying } = this.state;
      if (isPlaying) {
        preStart(this, () => {
          this.initPlayer();
        }); // 点击播放开始时进行预加载
        // this.initPlayer();
      } else { // 停止播放后立即清除定时器，避免延时情况的处理
        this.clearTimer();
      }

      // 向外暴露播放状态操作事件（目前是为了处理预加载）
      onPlayState(isPlaying);
    });
  };

  render () {
    const {
      children, layerContent, speedContent,
      showLayerSwitch, labelOptions,
      overlayClassName,
    } = this.props;
    const { isPlaying } = this.state;

    return (<div className="sakitam-player">
      {
        showLayerSwitch && <Tooltip
          className="menu-tooltip__radar"
          placement="topLeft"
          overlay={layerContent || ''}
        >
          <span className="sakitam-player__layer">
            <span
              onClick={this.handleLayerType}
              className="sakitam-player__layer-icon iconfont icon-tuceng2"/>
            <span className="sakitam-player__menu-text">图层</span>
          </span>
        </Tooltip>
      }
      <span className="sakitam-player__menu">
        <span
          onClick={this.handlePlayState}
          className={classnames({
            'sakitam-player__menu-icon': true,
            'playing': isPlaying,
          })}
        />
        <span className="sakitam-player__menu-text">
          {
            isPlaying ? labelOptions?.menuLabel?.pause : labelOptions?.menuLabel?.play
          }
        </span>
      </span>
      <span className="sakitam-player__back">
        <span
          onClick={this.handlePrev}
          className="sakitam-player__back-icon"/>
        <span className="sakitam-player__back-text">
          {
            labelOptions?.backLabel
          }
        </span>
      </span>
      {
        children || null
      }
      <span className="sakitam-player__next">
        <span
          onClick={this.handleNext}
          className="sakitam-player__next-icon"/>
        <span className="sakitam-player__next-text">
          {
            labelOptions?.nextLabel
          }
        </span>
      </span>
      <Tooltip
        className="menu-tooltip__radar"
        placement="top"
        arrowPointAtCenter
        overlayClassName={overlayClassName}
        overlay={speedContent || ''}
      >
        <span className="sakitam-player__speed">
          <span
            onClick={this.handleLayerType}
            className={classnames({ 'sakitam-player__speed-icon': true })}/>
          <span className="sakitam-player__speed-text">速度</span>
        </span>
      </Tooltip>
    </div>);
  }
}

SliderWrap.propTypes = {
  next: PropTypes.func,
  prev: PropTypes.func,
  preStart: PropTypes.func,
  immediate: PropTypes.bool,
  autoplay: PropTypes.bool,
  interval: PropTypes.number,
  labelOptions: PropTypes.object,
  // interval: PropTypes.checkPropTypes(val =>
  //   // TIP: 不可过小
  //   val >= 200
  // ),
  onLayerChange: PropTypes.func,
  onPlayState: PropTypes.func,
  showLayerSwitch: PropTypes.bool,
  layerContent: PropTypes.any,
  speedContent: PropTypes.any,
};

SliderWrap.defaultProps = {
  showLayerSwitch: false,
  onLayerChange: () => undefined,
  onPlayState: () => undefined,
  labelOptions: {
    menuLabel: {
      play: '播放',
      pause: '暂停',
    },
    backLabel: '上一个',
    nextLabel: '下一个',
  },
  next: (next) => {
    if (isFunction(next)) {
      next.call(this);
    }
  },
  prev: (next) => {
    if (isFunction(next)) {
      next.call(this);
    }
  },
  preStart: (preStart) => {
    if (isFunction(preStart)) {
      preStart.call(this);
    }
  },
  immediate: false,
  autoplay: false,
  interval: 3000,
  layerContent: '',
  speedContent: '',
};

export default SliderWrap;

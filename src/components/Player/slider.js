import './slider.less';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import classnames from 'classnames';
import fde from 'fast-deep-equal';
import React, { Component } from 'react';
import { Slider } from 'antd';

function checkShow(filterData, value, key) {
  if (filterData && filterData.length > 0) {
    const item = find(filterData, itemInner => itemInner.id === value);
    return item?.[key] !== undefined ? item?.[key] : true;
  }
  return true;
}

function getMarks({ data, filterData }) {
  const len = data.length - 1;
  const dx = 100 / len;
  const marks = {};

  for (let i = 0; i <= len; i++) {
    const { time: label, id } = data[i];
    marks[i * dx] = {
      style: {
        display: checkShow(filterData, id, 'showLabel') ? 'block' : 'none',
        color: '#fff'
      },
      label,
      formatTime: data[i].formatTime,
    };
  }

  return marks;
}

class SliderBar extends Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    const marks = getMarks(nextProps);
    // console.log(nextProps);
    if (!fde(marks, prevState.marks)) {
      return {
        marks: marks || [],
      };
    }

    if (!isEmpty(nextProps.value) && !fde(nextProps.value, prevState.value)) {
      const { data } = nextProps;
      const len = data.length - 1;
      const dx = 100 / len;
      const index = findIndex(data, (item) => item?.id === nextProps.value?.id);
      return {
        value: dx * index,
      };
    }

    return null;
  }

  constructor (props, context) {
    super(props, context);
    this.state = {
      marks: {},
    };

    this.sliderRef = React.createRef();

    this.index = 0;
  }

  componentDidMount () {
    // this.createMap();
  }

  handleChange = (value) => {
    // console.log(value);
    const { onChange, data } = this.props;
    const len = data.length - 1;
    const dx = 100 / len;
    const index = Math.floor(value / dx);
    this.index = index;
    const itemVal = find(data, (item, idx) => idx === index);
    this.setState({
      value,
    });
    if (onChange && isFunction(onChange)) {
      onChange('inner', itemVal);
    }
  };

  setValueByIndex(index) {
    const { data, onChange } = this.props;
    const len = data.length - 1;
    const dx = 100 / len;
    this.setState({
      value: dx * index,
    });
    const itemVal = find(data, (item, idx) => idx === index);
    if (onChange && isFunction(onChange)) {
      onChange('outer', itemVal);
    }
  }

  prev() {
    if (this.sliderRef && this.sliderRef.current) {
      this.index = this.index - 1 > 0 ? this.index - 1 : 0;
      this.setValueByIndex(this.index);
    }
  }

  next() {
    const { data, loop } = this.props;
    if (this.sliderRef && this.sliderRef.current) {
      const length = data.length - 1;
      // eslint-disable-next-line no-nested-ternary
      this.index = this.index + 1 <= length ? this.index + 1 : (loop ? 0 : length);
      this.setValueByIndex(this.index);
    }
  }

  resetIndex() {
    const { value } = this.props;
    this.index = 0;
    this.setState({
      value,
    });
  }

  // setValue(value) {
  //   const { data, onChange } = this.props;
  //   const len = data.length - 1;
  //   const dx = 100 / len;
  //   this.setState({
  //     value: dx * index,
  //   });
  // }

  getValue() {
    return this.state;
  }

  getPrevValue() {
    const { data, loop } = this.props;
    let index = this.index; // eslint-disable-line
    if (this.sliderRef && this.sliderRef.current) {
      const length = data.length - 1;
      // eslint-disable-next-line no-nested-ternary
      index = this.index - 1 > 0 ? this.index - 1 : (loop ? length : 0);
    }
    return find(data, (item, idx) => idx === index);
  }

  getNextValue() {
    const { data, loop } = this.props;
    let index = this.index; // eslint-disable-line
    if (this.sliderRef && this.sliderRef.current) {
      const length = data.length - 1;
      // eslint-disable-next-line no-nested-ternary
      index = this.index + 1 <= length ? this.index + 1 : (loop ? 0 : length);
    }
    return find(data, (item, idx) => idx === index);
  }

  tipFormatter = (value) => {
    const { marks } = this.state;
    if (typeof marks[value] === 'string') {
      return <span>{marks[value]}</span>;
    }
    if (isObject(marks[value])) {
      return <span>{marks[value].formatTime}</span>;
    }
    return '';
  };

  render () {
    const {
      step,
      className,
      min, max,
      vertical,
      included,
      dots,
      onBeforeChange,
      // defaultValue,
      onAfterChange,
      handleStyle,
      trackStyle,
      railStyle,
      dotStyle,
      activeDotStyle,
    } = this.props;

    const { marks, value } = this.state;

    return (
      <span className={classnames('sakitam-slider', className)}>
        <Slider
          value={value}
          defaultValue={value}
          ref={this.sliderRef}
          tooltipVisible
          min={min}
          max={max}
          marks={marks}
          step={step}
          vertical={vertical}
          included={included}
          dots={dots}
          tipFormatter={this.tipFormatter}
          onBeforeChange={onBeforeChange}
          // onChange={onChange}
          onAfterChange={onAfterChange}
          handleStyle={handleStyle}
          trackStyle={trackStyle}
          railStyle={railStyle}
          dotStyle={dotStyle}
          activeDotStyle={activeDotStyle}
          onChange={this.handleChange}
          // defaultValue={defaultValue}
        />
      </span>
    );
  }
}

SliderBar.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  loop: PropTypes.bool,
  step: PropTypes.any,
  dotStyle: PropTypes.object,
  activeDotStyle: PropTypes.object,
  railStyle: PropTypes.object,
  trackStyle: PropTypes.object,
  handleStyle: PropTypes.object,
};

SliderBar.defaultProps = {
  min: 0,
  max: 100,
  loop: true,
  step: null,
  dotStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  activeDotStyle: {
    borderColor: '#fff',
  },
  railStyle: {
    // background: 'linear-gradient(rgba(0, 0, 0, 0))',
  },
  trackStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.633)',
    // linear-gradient(70deg,#0ebeff,#ffdd40,#ae63e4,#47cf73)
    // backgroundImage: 'linear-gradient(90deg, rgba(80, 175, 255, 0.7), rgba(0, 25, 72, 0.8))',
    // background: 'linear-gradient(rgba(80, 175, 255, 0.7), rgba(0, 25, 72, 0.8));',
  },
  handleStyle: {
    // borderColor: 'transparent',
    border: '2px solid #9cd5ff',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    boxShadow: 'inset 0 0 10px 5px rgba(80, 175, 255, 0.7)',
  },
};

export default SliderBar;

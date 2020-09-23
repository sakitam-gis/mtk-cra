import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import { Radio } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

class LayerSwitch extends React.Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    const { tabs, defaultValue } = nextProps;
    const { panelSelected } = prevState;
    if (isEmpty(panelSelected)) {
      if (defaultValue) {
        return {
          panelSelected: defaultValue,
        };
      }
      if (tabs && tabs.length > 0) {
        return {
          panelSelected: get(tabs, '0', {})
        };
      }
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      panelSelected: {},
    };
  }

  componentDidMount () {
  }

  onChange = item => {
    this.setState({
      panelSelected: item,
    });
    const { onChange } = this.props;
    if (onChange && isFunction(onChange)) {
      onChange(item);
    }
  };

  render() {
    const { tabs, className } = this.props;
    const { panelSelected } = this.state;

    return (
      <div className={classnames(className, styles.layerSwitch)}>
        <Radio.Group
          className={styles.checkbox}
          options={tabs}
          defaultValue={Array.isArray(panelSelected) ? panelSelected : panelSelected.value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

LayerSwitch.defaultProps = {
  tabs: [],
};

export default LayerSwitch;

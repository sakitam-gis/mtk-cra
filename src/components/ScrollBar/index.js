import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

import styles from './index.less';

const Wrapper = styled.div`
  width: calc(100% - 30px);
`;

const ScrollbarInner = styled.div`
   width: calc(100% + 30px);
   height: ${props => `${props.scrollbarHeight || '100%'}`};
   overflow-y: auto;
   overflow-x: hidden;
`;

export default function ScrollBar(props) {
  const { children, className } = props;
  return (
    <div className={classnames(styles.scrollbarWrapper, className)}>
      <ScrollbarInner {...props}>
        <Wrapper>
          {
            children
          }
        </Wrapper>
      </ScrollbarInner>
    </div>
  );
}

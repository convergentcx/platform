import React from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  padding: 50;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWindow = styled.div`
  position: relative;
  background: #FFF;
  border-radius: 5px;
  width: 500px;
  min-height: 300px;
  margin: 0 auto;
  padding: 30px;
`;

const CloseModal = styled.div`
  position: absolute;
  cursor: pointer;
  top: 30px;
  right: 30px;
  font-weight: 900;
  :hover {
    color: #0044DD;
  }
`;

class Modal extends React.Component<any, any> {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <Backdrop onClick={this.props.closeModal}>
        <ModalWindow onClick={(e) => { e.stopPropagation(); }}>
          <CloseModal onClick={this.props.closeModal}>X</CloseModal>
          {this.props.children}
        </ModalWindow>
      </Backdrop>
    )
  }
};

export default Modal;
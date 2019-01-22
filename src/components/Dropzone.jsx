import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

const getColor = (props) => {
  if (props.isDragReject) {
    return '#c66';
  }
  if (props.isDragActive) {
    return '#6c6';
  }
  return '#666';
};

const Container = styled.div`
  width: calc(100% - 16px);
  border-radius: 10px;
  margin-top: 8px;
  height: 420px;
  border-width: 2px;
  border-radius: 5px;
  border-color: ${props => getColor(props)};
  border-style: ${props => props.isDragReject || props.isDragActive ? 'solid' : 'dashed'};
  background-color: ${props => props.isDragReject || props.isDragActive ? '#eee' : ''};
`;

const Subject = () => (
  <Dropzone accept="image/*">
    {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles }) => {
      return (
        <Container
          isDragActive={isDragActive}
          isDragReject={isDragReject}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragAccept ? 'Drop' : 'Drag'} files here...
        </Container>
      )
    }}
  </Dropzone>
);

export default Subject;
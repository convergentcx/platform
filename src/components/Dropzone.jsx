import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

const Container = styled.div`
  width: 160px;
  border-radius: 10px;
  margin-top: 8px;
  height: 160px;
  border-width: 2px;
  border-radius: 5px;
  border-color: #000;
  border-style: ${props => props.isDragReject || props.isDragActive ? 'solid' : 'dashed'};
  background-color: ${props => props.isDragReject || props.isDragActive ? '#eee' : '#E9EDF2'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Subject = (props) => (
  <Dropzone accept="image/*" onDrop={props.upload} maxSize={1000000}>
    {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles }) => {
      return (
        <Container
          isDragActive={isDragActive}
          isDragReject={isDragReject}
          {...getRootProps()}
        >
          <input {...getInputProps()}/>
          {props.preview ? <img src={props.preview} style={{ width: '100%', height: '100%' }}/> : 'Click to upload'}
        </Container>
      )
    }}
  </Dropzone>
);

export default Subject;

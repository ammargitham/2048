import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff4f;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 5rem;
  color: #796e62;
  font-weight: bold;
  flex: 2;
  justify-content: center;

  & > span {
    text-align: center;
  }
`;

// const ExtraInfo = styled.div`
//   flex: 1;
// `;

export default function GameOver({ className, innerRef }) {
  return (
    <Container ref={innerRef} className={className}>
      <Title>
        <span>Game Over!</span>
      </Title>
      {/* <ExtraInfo>Extra info</ExtraInfo> */}
    </Container>
  );
}

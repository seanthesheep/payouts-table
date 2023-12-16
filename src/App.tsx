import Payouts from './payouts/Payouts';
import styled from 'styled-components';

const AppContainer = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Inter");
  font-family: "Inter", sans-seriff
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 100vw;

  h3 {
    margin-left: 3rem;
    margin-bottom: 15px;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: 48px;
    letter-spacing: -0.8px;
  }
`;


function App() {

  return (

    <AppContainer>
      <h3>Payouts</h3>
      <Payouts />
    </AppContainer>
  )
}

export default App

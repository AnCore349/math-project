import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 5px;
`;

export const LineBox = styled.div`
  display: flex;
`;

export const ButtonBox = styled.div`
  display: flex;
  margin: 20px 0 10px 0;
`;

export const AuthMessage = styled.p`
  margin: 8px 10px;
  color: #ff8585;
  font-size: 0.9rem;
`;

export const FormSwitcher = styled.div`
  position: relative;
`;

export const RegistrationSuccessPopup = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  background: rgba(5, 12, 30, 0.94);
  color: #b7ffca;
  font-size: 1.1rem;
  text-align: center;
  box-shadow: 0 0 24px rgba(80, 255, 160, 0.3);
`;
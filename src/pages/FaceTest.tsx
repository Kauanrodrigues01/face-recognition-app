import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import WebcamCapture from '../components/WebcamCapture';
import type { FaceTestResponse } from '../types';

const FaceTest: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<FaceTestResponse | null>(null);

  const handleTest = async (imageData: string) => {
    if (!email) {
      setError('Por favor, insira o email do usuário.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const testResult = await authService.testFace({
        email,
        face_image_base64: base64Data
      });
      setResult(testResult);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Erro ao testar reconhecimento facial');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const resetTest = () => {
    setResult(null);
    setError('');
    setEmail('');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>FR</Logo>
          <HeaderTitle>Teste de Reconhecimento Facial</HeaderTitle>
        </HeaderContent>
        <HeaderActions>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            Voltar
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <FaSignOutAlt /> Sair
          </Button>
        </HeaderActions>
      </Header>

      <ContentWrapper>
        <Description>
          Teste se uma foto corresponde à biometria cadastrada de um usuário.
          Insira o email do usuário e tire uma foto para verificar.
        </Description>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result ? (
          <ResultCard success={result.match}>
            <ResultIcon>
              {result.match ? (
                <FaCheckCircle size={64} />
              ) : (
                <FaTimesCircle size={64} />
              )}
            </ResultIcon>
            <ResultTitle>
              {result.match ? 'Reconhecido!' : 'Não Reconhecido'}
            </ResultTitle>
            <ResultMessage>{result.message}</ResultMessage>
            {result.user && (
              <UserInfo>
                <UserInfoItem>
                  <Label>Nome:</Label>
                  <Value>{result.user.name}</Value>
                </UserInfoItem>
                <UserInfoItem>
                  <Label>Email:</Label>
                  <Value>{result.user.email}</Value>
                </UserInfoItem>
              </UserInfo>
            )}
            <ConfidenceBar>
              <ConfidenceLabel>
                Confiança: {Math.round(result.confidence * 100)}%
              </ConfidenceLabel>
              <ConfidenceProgress>
                <ConfidenceFill
                  width={result.confidence * 100}
                  success={result.match}
                />
              </ConfidenceProgress>
            </ConfidenceBar>
            <Button onClick={resetTest} $fullWidth>
              Fazer Novo Teste
            </Button>
          </ResultCard>
        ) : (
          <TestCard>
            <InputGroup>
              <Label>Email do Usuário</Label>
              <StyledInput
                type="email"
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </InputGroup>

            <WebcamCapture onCapture={handleTest} disabled={loading} />

            <Instructions>
              <InstructionTitle>Instruções:</InstructionTitle>
              <InstructionsList>
                <InstructionItem>📧 Digite o email do usuário a ser testado</InstructionItem>
                <InstructionItem>📷 Tire uma foto do rosto</InstructionItem>
                <InstructionItem>✅ Veja se o rosto corresponde ao usuário cadastrado</InstructionItem>
              </InstructionsList>
            </Instructions>
          </TestCard>
        )}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const Description = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.error}20;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TestCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ResultCard = styled(Card)<{ success: boolean }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  animation: fadeIn 0.5s ease-out;
`;

const ResultIcon = styled.div<{ success?: boolean }>`
  color: ${({ success, theme }) => (success ? theme.colors.success : theme.colors.error)};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ResultTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ResultMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const UserInfo = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: left;
`;

const UserInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Value = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const StyledInput = styled(Input)`
  width: 100%;
`;

const ConfidenceBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ConfidenceLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: left;
`;

const ConfidenceProgress = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.colors.backgroundLighter};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const ConfidenceFill = styled.div<{ width: number; success: boolean }>`
  width: ${({ width }) => width}%;
  height: 100%;
  background: ${({ success, theme }) =>
    success
      ? `linear-gradient(90deg, ${theme.colors.success}, ${theme.colors.primary})`
      : `linear-gradient(90deg, ${theme.colors.error}, ${theme.colors.error}80)`};
  transition: width 0.5s ease-out;
`;

const Instructions = styled.div`
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InstructionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InstructionItem = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default FaceTest;
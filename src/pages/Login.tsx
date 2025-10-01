import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import WebcamCapture from '../components/WebcamCapture';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, faceLogin } = useAuth();

  const [mode, setMode] = useState<'traditional' | 'face'>('traditional');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async (imageData: string) => {
    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Remove the data:image/jpeg;base64, prefix if present
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      await faceLogin({ email, face_image_base64: base64Data });
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(
        error.response?.data?.detail ||
          'Falha no reconhecimento facial. Tente novamente ou use login tradicional.'
      );
      // Keep mode as 'face' when there's an error
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: 'traditional' | 'face') => {
    setMode(newMode);
    setError('');
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Logo>
            <FaFacebook size={40} />
          </Logo>
          <Title>Face Recognition</Title>
          <Subtitle>Sistema de Autenticação Biométrica</Subtitle>
        </Header>

        <StyledCard>
          <ModeToggle>
            <ModeButton $active={mode === 'traditional'} onClick={() => handleModeChange('traditional')}>
              <FaLock size={18} />
              <span>Senha</span>
            </ModeButton>
            <ModeButton $active={mode === 'face'} onClick={() => handleModeChange('face')}>
              <FaFacebook size={18} />
              <span>Facial</span>
            </ModeButton>
          </ModeToggle>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {mode === 'traditional' ? (
            <Form onSubmit={handleTraditionalLogin}>
              <InputGroup>
                <Label>Email</Label>
                <InputWrapper>
                  <InputIcon>
                    <FaEnvelope />
                  </InputIcon>
                  <StyledInput
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Senha</Label>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <StyledInput
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <Button type="submit" $fullWidth $isLoading={loading} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Form>
          ) : (
            <FaceLoginContainer>
              <InputGroup>
                <Label>Email</Label>
                <InputWrapper>
                  <InputIcon>
                    <FaEnvelope />
                  </InputIcon>
                  <StyledInput
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <WebcamCapture onCapture={handleFaceLogin} disabled={loading} />
            </FaceLoginContainer>
          )}

          <Divider>
            <span>ou</span>
          </Divider>

          <RegisterLink>
            Não tem uma conta?{' '}
            <Link to="/register">
              <strong>Cadastre-se</strong>
            </Link>
          </RegisterLink>
        </StyledCard>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background} 0%,
    ${({ theme }) => theme.colors.backgroundLight} 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.primary}10 0%,
      transparent 70%
    );
    animation: pulse 15s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.secondary}10 0%,
      transparent 70%
    );
    animation: pulse 20s ease-in-out infinite;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  animation: fadeIn 0.6s ease-out;
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const StyledCard = styled(Card)`
  animation-delay: 0.2s;
`;

const ModeToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  background: ${({ $active, theme }) =>
    $active
      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
      : 'transparent'};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.textSecondary)};

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
        : theme.colors.backgroundLighter};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FaceLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled(Input)`
  padding-left: ${({ theme }) => theme.spacing['3xl']};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.error}20;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  animation: slideUp 0.3s ease-out;
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }

  span {
    position: relative;
    display: inline-block;
    padding: 0 ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryLight};
    }
  }
`;

export default Login;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle, FaSignOutAlt, FaUserPlus, FaUsers, FaCamera } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEnrollFace = () => {
    navigate('/enroll-face');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>FR</Logo>
          <HeaderTitle>Face Recognition</HeaderTitle>
        </HeaderContent>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <FaSignOutAlt /> Sair
        </Button>
      </Header>

      <ContentWrapper>
        <WelcomeSection>
          <WelcomeTitle>Bem-vindo(a), {user?.name}!</WelcomeTitle>
          <WelcomeSubtitle>Gerenciamento de Conta e Biometria</WelcomeSubtitle>
        </WelcomeSection>

        <CardsGrid>
          <StyledCard>
            <CardIcon>
              <FaUser size={32} />
            </CardIcon>
            <CardTitle>Informa��es da Conta</CardTitle>
            <InfoList>
              <InfoItem>
                <InfoLabel><FaUser /> Nome:</InfoLabel>
                <InfoValue>{user?.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel><FaEnvelope /> Email:</InfoLabel>
                <InfoValue>{user?.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status:</InfoLabel>
                <StatusBadge active={user?.is_active}>
                  {user?.is_active ? (
                    <><FaCheckCircle /> Ativo</>
                  ) : (
                    <><FaTimesCircle /> Inativo</>
                  )}
                </StatusBadge>
              </InfoItem>
            </InfoList>
          </StyledCard>

          <StyledCard>
            <CardIcon>
              <FaUserPlus size={32} />
            </CardIcon>
            <CardTitle>Biometria Facial</CardTitle>
            <BiometricStatus>
              <StatusIcon enrolled={user?.face_enrolled || false}>
                {user?.face_enrolled ? <FaCheckCircle size={48} /> : <FaTimesCircle size={48} />}
              </StatusIcon>
              <StatusText>
                {user?.face_enrolled ? (
                  <>
                    <StatusTitle>Cadastrada</StatusTitle>
                    <StatusDescription>Sua biometria facial est� ativa</StatusDescription>
                  </>
                ) : (
                  <>
                    <StatusTitle>N�o Cadastrada</StatusTitle>
                    <StatusDescription>Configure o login facial para maior seguran�a</StatusDescription>
                  </>
                )}
              </StatusText>
            </BiometricStatus>
            {!user?.face_enrolled && (
              <Button fullWidth onClick={handleEnrollFace}>
                <FaUserPlus /> Cadastrar Biometria
              </Button>
            )}
          </StyledCard>
        </CardsGrid>

        <ActionsSection>
          <SectionTitle>Ações Disponíveis</SectionTitle>
          <ActionsList>
            <ActionCard onClick={() => navigate('/users')}>
              <ActionIcon>
                <FaUsers size={32} />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Gerenciar Usuários</ActionTitle>
                <ActionDescription>Visualize e gerencie todos os usuários do sistema</ActionDescription>
              </ActionText>
            </ActionCard>
            <ActionCard onClick={() => navigate('/face-test')}>
              <ActionIcon>
                <FaCamera size={32} />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Teste de Reconhecimento</ActionTitle>
                <ActionDescription>Teste o reconhecimento facial com diferentes fotos</ActionDescription>
              </ActionText>
            </ActionCard>
          </ActionsList>
        </ActionsSection>

        <FeaturesSection>
          <SectionTitle>Recursos do Sistema</SectionTitle>
          <FeaturesList>
            <FeatureItem>
              <FeatureIcon><FaCheckCircle /></FeatureIcon>
              <FeatureText>
                <FeatureTitle>Login Facial</FeatureTitle>
                <FeatureDescription>Autentica��o r�pida e segura usando reconhecimento facial</FeatureDescription>
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon><FaCheckCircle /></FeatureIcon>
              <FeatureText>
                <FeatureTitle>Anti-Spoofing</FeatureTitle>
                <FeatureDescription>Prote��o contra fraudes com detec��o de vivacidade</FeatureDescription>
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon><FaCheckCircle /></FeatureIcon>
              <FeatureText>
                <FeatureTitle>Criptografia de Ponta</FeatureTitle>
                <FeatureDescription>Dados biom�tricos criptografados com AES-128</FeatureDescription>
              </FeatureText>
            </FeatureItem>
          </FeaturesList>
        </FeaturesSection>
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
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  animation: fadeIn 0.5s ease-out;
`;

const WelcomeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CardIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const InfoLabel = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const StatusBadge = styled.span<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ active, theme }) => (active ? theme.colors.success : theme.colors.error)}20;
  color: ${({ active, theme }) => (active ? theme.colors.success : theme.colors.error)};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const BiometricStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatusIcon = styled.div<{ enrolled: boolean }>`
  color: ${({ enrolled, theme }) => (enrolled ? theme.colors.success : theme.colors.textMuted)};
`;

const StatusText = styled.div`
  flex: 1;
`;

const StatusTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatusDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  animation: slideUp 0.5s ease-out;
`;

const ActionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ActionCard = styled(Card)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const ActionIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  flex-shrink: 0;
`;

const ActionText = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ActionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const FeaturesSection = styled.div`
  animation: slideUp 0.5s ease-out;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FeatureItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(8px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

export default Dashboard;
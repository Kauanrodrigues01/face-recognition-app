import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import Card from "../components/Card";
import WebcamCapture from "../components/WebcamCapture";
import { useAuth } from "../contexts/AuthContext";

const EnrollFace: React.FC = () => {
  const navigate = useNavigate();
  const { enrollFace } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  const handleEnroll = async (imageData: string) => {
    setError("");
    setLoading(true);

    try {
      // Remove the data:image/jpeg;base64, prefix if present
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const result = await enrollFace({ face_image_base64: base64Data });
      setQualityScore(result.quality_score);
      setSuccess(true);

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(
        error.response?.data?.detail ||
          "Falha ao cadastrar biometria. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const skipForNow = () => {
    navigate("/dashboard");
  };

  if (success) {
    return (
      <Container>
        <ContentWrapper>
          <SuccessCard>
            <SuccessIcon>
              <FaCheckCircle size={64} />
            </SuccessIcon>
            <SuccessTitle>Biometria Cadastrada!</SuccessTitle>
            <SuccessMessage>
              Qualidade da foto: <strong>{qualityScore}/100</strong>
            </SuccessMessage>
            <SuccessSubtext>Redirecionando...</SuccessSubtext>
          </SuccessCard>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>Cadastrar Biometria Facial</Title>
          <Subtitle>
            Configure o login facial para acesso rápido e seguro
          </Subtitle>
        </Header>

        <StyledCard>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <WebcamCapture onCapture={handleEnroll} disabled={loading} />

          <ButtonGroup>
            <Button variant="outline" onClick={skipForNow} disabled={loading}>
              Pular por Enquanto
            </Button>
          </ButtonGroup>
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
    ${({ theme }) => theme.colors.background},
    ${({ theme }) => theme.colors.backgroundLight}
  );
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 700px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledCard = styled(Card)``;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.error}20;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SuccessCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
`;

const SuccessIcon = styled.div`
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: fadeIn 0.5s ease-out;
`;

const SuccessTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SuccessMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SuccessSubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default EnrollFace;

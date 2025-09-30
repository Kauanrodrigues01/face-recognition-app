import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import { FaCamera, FaRedo, FaCheck } from 'react-icons/fa';

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  disabled?: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, disabled = false }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const confirm = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  return (
    <Container>
      <WebcamContainer>
        {capturedImage ? (
          <CapturedImage src={capturedImage} alt="Captured" />
        ) : (
          <StyledWebcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
              aspectRatio: window.innerWidth < 768 ? 0.75 : 1.777,
            }}
          />
        )}
        <Overlay />
      </WebcamContainer>

      <ButtonGroup>
        {!capturedImage ? (
          <CaptureButton onClick={capture} disabled={disabled}>
            <FaCamera size={20} />
            <span>Capturar Foto</span>
          </CaptureButton>
        ) : (
          <>
            <RetakeButton onClick={retake} disabled={disabled}>
              <FaRedo size={18} />
              <span>Tirar Novamente</span>
            </RetakeButton>
            <ConfirmButton onClick={confirm} disabled={disabled}>
              <FaCheck size={18} />
              <span>Confirmar</span>
            </ConfirmButton>
          </>
        )}
      </ButtonGroup>

      <Instructions>
        <InstructionItem>📷 Posicione seu rosto no centro</InstructionItem>
        <InstructionItem>💡 Certifique-se de ter boa iluminação</InstructionItem>
        <InstructionItem>👤 Apenas um rosto deve aparecer</InstructionItem>
      </Instructions>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const WebcamContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  aspect-ratio: 16 / 9;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: 3 / 4;
    min-height: 500px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    aspect-ratio: 3 / 4;
    min-height: 450px;
  }
`;

const StyledWebcam = styled(Webcam)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  aspect-ratio: 3 / 4;
  border: 3px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary}40,
      ${({ theme }) => theme.colors.secondary}40
    );
    animation: pulse 2s ease-in-out infinite;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 70%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 75%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const CaptureButton = styled(Button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const RetakeButton = styled(Button)`
  background: ${({ theme }) => theme.colors.backgroundLighter};
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.backgroundLight};
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;

const ConfirmButton = styled(Button)`
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Instructions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const InstructionItem = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

export default WebcamCapture;
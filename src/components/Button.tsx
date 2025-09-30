import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
  $isLoading?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  border: none;
  outline: none;
  white-space: nowrap;

  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${`${theme.spacing.sm} ${theme.spacing.md}`};
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return css`
          padding: ${`${theme.spacing.lg} ${theme.spacing['2xl']}`};
          font-size: ${theme.fontSizes.lg};
        `;
      default:
        return css`
          padding: ${`${theme.spacing.md} ${theme.spacing.xl}`};
          font-size: ${theme.fontSizes.md};
        `;
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.secondary};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background: ${theme.colors.secondaryDark};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primary};
            color: ${theme.colors.white};
          }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.error};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background: #dc2626;
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.md};

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }
        `;
    }
  }}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      position: relative;
      color: transparent;
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    white-space: normal;

    ${({ size = 'md', theme }) => {
      if (size === 'lg') {
        return css`
          padding: ${`${theme.spacing.md} ${theme.spacing.xl}`};
          font-size: ${theme.fontSizes.md};
        `;
      }
      return '';
    }}
  }
`;

export default Button;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import type { User } from '../types';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await userService.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Erro ao deletar usuário');
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>FR</Logo>
          <HeaderTitle>Gerenciamento de Usuários</HeaderTitle>
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
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <LoadingContainer>
            <Spinner />
            <LoadingText>Carregando usuários...</LoadingText>
          </LoadingContainer>
        ) : (
          <UsersGrid>
            {users.map(user => (
              <UserCard key={user.id}>
                <UserIcon>
                  <FaUser size={32} />
                </UserIcon>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                  <UserMeta>
                    <Badge enrolled={user.face_enrolled}>
                      {user.face_enrolled ? (
                        <><FaCheckCircle /> Biometria Cadastrada</>
                      ) : (
                        <><FaTimesCircle /> Sem Biometria</>
                      )}
                    </Badge>
                    {user.is_active !== undefined && (
                      <Badge active={user.is_active}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    )}
                  </UserMeta>
                </UserInfo>
                <UserActions>
                  <IconButton onClick={() => handleDelete(user.id)} danger>
                    <FaTrash />
                  </IconButton>
                </UserActions>
              </UserCard>
            ))}
          </UsersGrid>
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
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.error}20;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.colors.backgroundLighter};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled(Card)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
  }
`;

const UserIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UserEmail = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Badge = styled.span<{ enrolled?: boolean; active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ enrolled, active, theme }) => {
    if (enrolled !== undefined) return enrolled ? theme.colors.success : theme.colors.textMuted;
    if (active !== undefined) return active ? theme.colors.success : theme.colors.error;
    return theme.colors.textMuted;
  }}20;
  color: ${({ enrolled, active, theme }) => {
    if (enrolled !== undefined) return enrolled ? theme.colors.success : theme.colors.textMuted;
    if (active !== undefined) return active ? theme.colors.success : theme.colors.error;
    return theme.colors.textMuted;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const UserActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const IconButton = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ danger, theme }) => (danger ? theme.colors.error : theme.colors.primary)}20;
  color: ${({ danger, theme }) => (danger ? theme.colors.error : theme.colors.primary)};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ danger, theme }) => (danger ? theme.colors.error : theme.colors.primary)};
    color: white;
  }
`;

export default Users;
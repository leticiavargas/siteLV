import { adminUsersApi } from '@/lib/api';
import { DeleteButton } from '@/app/admin/_components/DeleteButton';
import { AddUserForm } from './_components/AddUserForm';
import './styles.css';

export default async function AdminUsuarios() {
  const { items: usuarios } = await adminUsersApi.list();
  const superAdmin = process.env.ADMIN_EMAIL;

  return (
    <>
      <div className="adminUsuariosHeader">
        <div>
          <h1 className="adminPageTitle">Usuários</h1>
          <p className="adminPageSubtitle">
            Gerencie quem tem acesso à área administrativa
          </p>
        </div>
      </div>

      <div className="adminUsuariosAddSection">
        <h2 className="adminUsuariosAddTitle">Adicionar usuário</h2>
        <AddUserForm />
      </div>

      <div className="adminUsuariosTableWrapper">
        <table className="adminUsuariosTable">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nome</th>
              <th>Adicionado em</th>
              <th><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            <tr className="adminUsuariosSuperAdmin">
              <td className="adminUsuariosEmail">{superAdmin}</td>
              <td>Letícia Vargas</td>
              <td className="adminUsuariosData">—</td>
              <td className="adminUsuariosAcoes">
                <span className="adminUsuariosBadge">super-admin</span>
              </td>
            </tr>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td className="adminUsuariosEmail">{usuario.email}</td>
                <td>{usuario.nome || '—'}</td>
                <td className="adminUsuariosData">
                  {usuario.createdAt
                    ? new Date(usuario.createdAt).toLocaleDateString('pt-BR')
                    : '—'}
                </td>
                <td className="adminUsuariosAcoes">
                  <DeleteButton
                    endpoint="/adminUsers"
                    id={usuario.id}
                    nome={usuario.email}
                    className="adminUsuariosAcaoBtn adminUsuariosAcaoBtn--danger"
                    ariaLabel={`Remover acesso de "${usuario.email}"`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

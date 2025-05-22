import { useEffect }   from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTokens }  from '../../utils/auth';
import { toast }       from '../../utils/toast';

export default function LoginSuccess() {
  const nav = useNavigate();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const a = p.get('accessToken');
    const r = p.get('refreshToken');

    if (a && r) {
      saveTokens(a, r);
      toast('Logged in via Google!', 'success');
      const role = localStorage.getItem('userRole');
      if (role==='ROLE_ADMIN')      nav('/admin');
      else if (role==='ROLE_INSTRUCTOR') nav('/instructor/dashboard');
      else                            nav('/student/dashboard');
    } else {
      toast('OAuth login failed','error');
      nav('/login');
    }
  }, [nav]);

  return null;
}

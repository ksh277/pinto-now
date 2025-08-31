import TopNavClient from './TopNavClient';
import { serverGetUser } from '@/lib/auth/jwt';

export default async function TopNav() {
  const user = await serverGetUser();
  return <TopNavClient initialUser={user} />;
}

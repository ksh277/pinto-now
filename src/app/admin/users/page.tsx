'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  created_at: string;
  last_login?: string;
  total_orders?: number;
  total_spent?: number;
  points?: number;
};

const roleLabels: Record<string, string> = {
  user: '일반회원',
  admin: '관리자',
  premium: '프리미엄',
  banned: '차단됨'
};

const roleColors: Record<string, string> = {
  user: 'bg-blue-100 text-blue-800',
  admin: 'bg-red-100 text-red-800',
  premium: 'bg-purple-100 text-purple-800',
  banned: 'bg-gray-100 text-gray-800'
};

const statusLabels: Record<string, string> = {
  active: '활성',
  inactive: '비활성',
  suspended: '정지됨',
  deleted: '삭제됨'
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  deleted: 'bg-gray-100 text-gray-800'
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('사용자 권한 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('사용자 권한 업데이트 중 오류가 발생했습니다.');
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('사용자 상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('사용자 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const bulkUpdateRole = async (newRole: string) => {
    try {
      const updatePromises = selectedUsers.map(userId =>
        fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: newRole }),
        })
      );

      await Promise.all(updatePromises);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error bulk updating users:', error);
      alert('일괄 업데이트 중 오류가 발생했습니다.');
    }
  };

  const exportToCSV = () => {
    const headers = ['이메일', '이름', '권한', '상태', '가입일', '주문수', '총구매금액', '포인트'];
    const csvData = filteredUsers.map(user => [
      user.email,
      user.name || '',
      roleLabels[user.role] || user.role,
      statusLabels[user.status] || user.status,
      new Date(user.created_at).toLocaleDateString('ko-KR'),
      user.total_orders || 0,
      user.total_spent || 0,
      user.points || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">사용자 데이터를 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <Button onClick={exportToCSV}>CSV 내보내기</Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">관리자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">프리미엄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'premium').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="이메일, 이름으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="권한 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 권한</SelectItem>
            {Object.entries(roleLabels).map(([role, label]) => (
              <SelectItem key={role} value={role}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            {Object.entries(statusLabels).map(([status, label]) => (
              <SelectItem key={status} value={status}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedUsers.length > 0 && (
          <Select onValueChange={bulkUpdateRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={`${selectedUsers.length}개 일괄변경`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleLabels).map(([role, label]) => (
                <SelectItem key={role} value={role}>{label}로 변경</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 사용자 테이블 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
              onCheckedChange={toggleAllUsers}
            />
            <span className="text-sm text-gray-600">
              전체 선택 ({selectedUsers.length}/{filteredUsers.length})
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>선택</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>권한</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>주문수</TableHead>
                <TableHead>총구매</TableHead>
                <TableHead>포인트</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <p className="text-gray-500">표시할 사용자가 없습니다.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.name || '-'}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role] || 'bg-gray-100 text-gray-800'}>
                        {roleLabels[user.role] || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status] || 'bg-gray-100 text-gray-800'}>
                        {statusLabels[user.status] || user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell>{user.total_orders || 0}건</TableCell>
                    <TableCell>{(user.total_spent || 0).toLocaleString()}원</TableCell>
                    <TableCell>{(user.points || 0).toLocaleString()}P</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            관리
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>사용자 관리</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">사용자 정보</h4>
                                <p>이메일: {selectedUser.email}</p>
                                <p>이름: {selectedUser.name || '미설정'}</p>
                                <p>가입일: {new Date(selectedUser.created_at).toLocaleDateString('ko-KR')}</p>
                                {selectedUser.last_login && (
                                  <p>마지막 로그인: {new Date(selectedUser.last_login).toLocaleDateString('ko-KR')}</p>
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">권한 변경</h4>
                                <div className="flex gap-2 flex-wrap">
                                  {Object.entries(roleLabels).map(([role, label]) => (
                                    <Button
                                      key={role}
                                      variant={selectedUser.role === role ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateUserRole(selectedUser.id, role)}
                                    >
                                      {label}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">상태 변경</h4>
                                <div className="flex gap-2 flex-wrap">
                                  {Object.entries(statusLabels).map(([status, label]) => (
                                    <Button
                                      key={status}
                                      variant={selectedUser.status === status ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateUserStatus(selectedUser.id, status)}
                                    >
                                      {label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
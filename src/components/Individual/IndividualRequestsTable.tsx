import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateTime } from '../../utils/helpers';
import { Users, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';
import { HelpRequest } from '@/types/individual';

interface IndividualRequestsTableProps {
  requests: HelpRequest[];
  onStatusChange: (requestId: number, newStatus: 'approved' | 'rejected') => void;
}

const IndividualRequestsTable: React.FC<IndividualRequestsTableProps> = ({ 
  requests, 
  onStatusChange 
}) => {

  const normalizeStatus = (status: string) => {
    if (!status) return "pending";
    return status.toLowerCase().trim();
  };

  const getStatusBadge = (status: string) => {
    const s = normalizeStatus(status);

    switch (s) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            مقبول
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            مرفوض
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            قيد المراجعة
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          طلبات المساعدة الغذائية ({requests.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد طلبات مساعدة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>عدد الأفراد</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {requests.map((request) => {
                  const status = normalizeStatus(request.status);

                  return (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.name}</TableCell>

                     

                      <TableCell>{request.numberOfPeople} أشخاص</TableCell>

                      <TableCell>{getStatusBadge(status)}</TableCell>

                      <TableCell>
                        {request.createdAt
                          ? formatDateTime(request.createdAt)
                          : "—"}
                      </TableCell>

                      <TableCell>
                        {status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 text-white"
                              onClick={() => onStatusChange(Number(request.id), 'approved')}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              قبول
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onStatusChange(Number(request.id), 'rejected')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              رفض
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            تمت المراجعة
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndividualRequestsTable;

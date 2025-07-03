from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class IsCommander(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'commander'

class IsLogisticsOfficer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'officer'

from rest_framework.permissions import BasePermission

class IsAdminOrCommanderOrOfficer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        role = request.user.role
        if role == 'admin': return True
        if role == 'commander':
            return getattr(obj, 'base', None) == request.user.base
        if role == 'officer':
            return view.basename in ('purchases', 'transfers') and request.method in ('GET','POST')
        return False

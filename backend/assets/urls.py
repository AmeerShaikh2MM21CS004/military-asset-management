from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('bases', BaseViewSet)
router.register('equipment-types', EquipmentTypeViewSet)
router.register('assets', AssetViewSet, basename='asset')
router.register('transfers', TransferViewSet)
router.register('assignments', AssignmentViewSet)
router.register('expenditures', ExpenditureViewSet)
router.register('purchases', PurchaseViewSet, basename='purchase') 

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-metrics/', dashboard_metrics),        
    path('net-movement-details/', net_movement_details),  
]

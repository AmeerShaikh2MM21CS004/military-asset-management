from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('bases', BaseViewSet)
router.register('equipment-types', EquipmentTypeViewSet)
router.register('assets', AssetViewSet)
router.register('transfers', TransferViewSet)
router.register('assignments', AssignmentViewSet)
router.register('expenditures', ExpenditureViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

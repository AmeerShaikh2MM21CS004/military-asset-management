from rest_framework import viewsets
from .models import Base, EquipmentType, Asset, Transfer, Assignment, Expenditure
from .serializers import *
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from assets.models import Purchase, Transfer
from rest_framework import status

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        purchase = serializer.save()
        # Check if asset exists for base and equipment_type
        asset, created = Asset.objects.get_or_create(
            base=purchase.base,
            equipment_type=purchase.equipment_type,
            name=f"{purchase.equipment_type.name} - {purchase.base.name}",
            defaults={
                'quantity': 0,
                'purchase_date': purchase.date
            }
        )
        asset.quantity += purchase.quantity
        asset.save()

class BaseViewSet(viewsets.ModelViewSet):
    queryset = Base.objects.all()
    serializer_class = BaseSerializer
    permission_classes = [AllowAny]

class EquipmentTypeViewSet(viewsets.ModelViewSet):
    queryset = EquipmentType.objects.all()
    serializer_class = EquipmentTypeSerializer
    permission_classes = [AllowAny]

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all() 
    serializer_class = AssetSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Asset.objects.filter(quantity__gt=0)
   

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Transfer, Asset
from .serializers import TransferSerializer

class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        asset_id = request.data.get("asset")
        from_base = request.data.get("from_base")
        to_base = request.data.get("to_base")
        quantity = int(request.data.get("quantity"))
        date = request.data.get("date")

        try:
         asset = Asset.objects.get(id=asset_id, base_id=from_base)
        except Asset.DoesNotExist:
         return Response({"error": "Asset not found at from_base"}, status=400)

        if asset.quantity < quantity:
            return Response({"error": "Insufficient quantity at from_base"}, status=400)

        asset.quantity -= quantity
        asset.save()

    # Create or update asset at to_base
        to_asset, _ = Asset.objects.get_or_create(
          name=asset.name,
          base_id=to_base,
          equipment_type=asset.equipment_type,
          defaults={"quantity": 0, "purchase_date": asset.purchase_date}
        )
        to_asset.quantity += quantity
        to_asset.save()

        transfer = Transfer.objects.create(
         asset=asset,
         from_base_id=from_base,
         to_base_id=to_base,
         quantity=quantity,
         date=date
        )

        return Response(TransferSerializer(transfer).data, status=status.HTTP_201_CREATED)

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [AllowAny]

class ExpenditureViewSet(viewsets.ModelViewSet):
    queryset = Expenditure.objects.all()
    serializer_class = ExpenditureSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_metrics(request):
    from assets.models import Asset, Transfer, Assignment, Expenditure, Base, EquipmentType
    from django.db.models import Sum, Q

    date = request.GET.get("date")
    base_id = request.GET.get("base")
    type_id = request.GET.get("type")

    assets = Asset.objects.all()
    if date:
        assets = assets.filter(purchase_date=date)
    if base_id:
        assets = assets.filter(base_id=base_id)
    if type_id:
        assets = assets.filter(equipment_type_id=type_id)

    opening_balance = assets.aggregate(total=Sum("quantity"))['total'] or 0
    closing_balance = opening_balance  # Placeholder if no logic
    assigned = Assignment.objects.aggregate(total=Sum("quantity"))['total'] or 0
    expended = Expenditure.objects.aggregate(total=Sum("quantity"))['total'] or 0

    purchases = assets.aggregate(total=Sum("quantity"))['total'] or 0
    transfer_in = Transfer.objects.filter(to_base_id=base_id).aggregate(total=Sum("quantity"))['total'] if base_id else 0
    transfer_out = Transfer.objects.filter(from_base_id=base_id).aggregate(total=Sum("quantity"))['total'] if base_id else 0

    net_movement = (purchases or 0) + (transfer_in or 0) - (transfer_out or 0)

    return Response({
        "opening_balance": opening_balance,
        "closing_balance": closing_balance,
        "net_movement": net_movement,
        "assigned": assigned,
        "expended": expended,
        "details": {
            "purchases": purchases,
            "transfer_in": transfer_in,
            "transfer_out": transfer_out
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def net_movement_details(request):
    base_id = request.GET.get('base')  # Optional: filter by base
    filters = {}
    if base_id:
        filters['asset__base_id'] = base_id

    purchases = Purchase.objects.filter(**filters)
    transfers_in = Transfer.objects.filter(to_base_id=base_id) if base_id else Transfer.objects.all()
    transfers_out = Transfer.objects.filter(from_base_id=base_id) if base_id else Transfer.objects.all()

    return Response({
        'purchases': PurchaseSerializer(purchases, many=True).data,
        'transfer_in': TransferSerializer(transfers_in, many=True).data,
        'transfer_out': TransferSerializer(transfers_out, many=True).data
    })

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def purchases_view(request):
    if request.method == 'GET':
        base = request.GET.get('base')
        equipment_type = request.GET.get('equipment_type')
        date = request.GET.get('date')

        queryset = Purchase.objects.all()

        if base:
            queryset = queryset.filter(base_id=base)
        if equipment_type:
            queryset = queryset.filter(equipment_type_id=equipment_type)
        if date:
            queryset = queryset.filter(date=date)

        serializer = PurchaseSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = PurchaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

